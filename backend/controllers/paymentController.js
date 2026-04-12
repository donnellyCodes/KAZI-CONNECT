const crypto = require('crypto');
const axios = require('axios');
const { Payment, Job, Worker, Employer } = require('../models');

const generateReference = (prefix) =>
    `${prefix}${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const MPESA_BASE_URL = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';

const formatTimestamp = (date = new Date()) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error('Missing M-Pesa consumer key or consumer secret.');
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await axios.get(
        `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
            headers: {
                Authorization: `Basic ${auth}`
            },
            timeout: 20000,
            proxy: false
        }
    );

    if (!response.data?.access_token) {
        throw new Error('Failed to get M-Pesa access token.');
    }

    return response.data.access_token;
};

const normalizePhoneNumber = (phoneNumber) => {
    const digitsOnly = String(phoneNumber || '').replace(/\D/g, '');
    if (digitsOnly.startsWith('254')) return digitsOnly;
    if (digitsOnly.startsWith('0')) return `254${digitsOnly.slice(1)}`;
    if (digitsOnly.startsWith('7') || digitsOnly.startsWith('1')) return `254${digitsOnly}`;
    return digitsOnly;
};

const parseCallbackMetadata = (items = []) => {
    const map = Object.fromEntries(items.map((item) => [item.Name, item.Value]));
    return {
        amount: map.Amount,
        mpesaReceiptNumber: map.MpesaReceiptNumber,
        transactionDate: map.TransactionDate,
        phoneNumber: map.PhoneNumber
    };
};

exports.initiatePayment = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { phoneNumber } = req.body;

        const employer = await Employer.findOne({ where: { userId: req.user.id } });
        if (!employer) {
            return res.status(404).json({ message: 'Employer profile not found' });
        }

        const job = await Job.findOne({
            where: { id: jobId, employerId: employer.id }
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'completed') {
            return res.status(400).json({ message: 'Payment is only allowed after the job is completed.' });
        }

        if (!job.hiredWorkerId) {
            return res.status(400).json({ message: 'This job does not have a hired worker yet.' });
        }

        const worker = await Worker.findByPk(job.hiredWorkerId);
        if (!worker) {
            return res.status(404).json({ message: 'Hired worker not found' });
        }

        let payment = await Payment.findOne({ where: { jobId } });
        if (payment?.status === 'paid') {
            return res.status(400).json({ message: 'Payment has already been completed for this job.' });
        }

        const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        if (!normalizedPhoneNumber) {
            return res.status(400).json({ message: 'A valid M-Pesa phone number is required.' });
        }

        const paymentPayload = {
            jobId,
            employerId: req.user.id,
            workerId: worker.userId,
            amount: job.budget,
            phoneNumber: normalizedPhoneNumber,
            status: 'pending',
            checkoutRequestId: generateReference('CHK'),
            transactionDate: new Date()
        };

        if (payment) {
            await payment.update(paymentPayload);
        } else {
            payment = await Payment.create(paymentPayload);
        }

        const liveConfigReady = Boolean(
            process.env.MPESA_CONSUMER_KEY &&
            process.env.MPESA_CONSUMER_SECRET &&
            process.env.MPESA_SHORTCODE &&
            process.env.MPESA_PASSKEY &&
            process.env.MPESA_CALLBACK_URL
        );
        const useMockMode = process.env.MPESA_MOCK_MODE !== 'false' || !liveConfigReady;

        if (useMockMode) {
            await payment.update({
                status: 'paid',
                mpesaReceiptNumber: generateReference('MOCK'),
                paidAt: new Date()
            });

            return res.json({
                message: liveConfigReady
                    ? 'Mock STK payment completed successfully.'
                    : 'Payment completed in mock mode until Safaricom credentials are configured.',
                payment
            });
        }

        const timestamp = formatTimestamp();
        const shortcode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const accessToken = await getAccessToken();
        const accountReference = `JOB-${job.id.slice(0, 8)}`;

        const stkResponse = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline',
                Amount: Math.round(Number(job.budget)),
                PartyA: normalizedPhoneNumber,
                PartyB: shortcode,
                PhoneNumber: normalizedPhoneNumber,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: accountReference,
                TransactionDesc: `Payment for job ${job.title}`
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                timeout: 20000,
                proxy: false
            }
        );

        await payment.update({
            checkoutRequestId: stkResponse.data?.CheckoutRequestID || payment.checkoutRequestId,
            phoneNumber: normalizedPhoneNumber,
            status: 'pending'
        });

        return res.json({
            message: stkResponse.data?.CustomerMessage || 'STK Push sent successfully.',
            payment
        });
    } catch (error) {
        const details = error.response?.data || error.message;
        res.status(500).json({ error: typeof details === 'string' ? details : JSON.stringify(details) });
    }
};

exports.getPaymentByJob = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: { jobId: req.params.jobId }
        });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.handleMpesaCallback = async (req, res) => {
    try {
        const callback = req.body?.Body?.stkCallback;
        if (!callback?.CheckoutRequestID) {
            return res.status(400).json({ message: 'Invalid callback payload.' });
        }

        const payment = await Payment.findOne({
            where: { checkoutRequestId: callback.CheckoutRequestID }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found for callback.' });
        }

        if (callback.ResultCode === 0) {
            const metadata = parseCallbackMetadata(callback.CallbackMetadata?.Item || []);
            await payment.update({
                status: 'paid',
                mpesaReceiptNumber: metadata.mpesaReceiptNumber || payment.mpesaReceiptNumber,
                paidAt: new Date(),
                transactionDate: metadata.transactionDate
                    ? new Date(String(metadata.transactionDate).replace(
                        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                        '$1-$2-$3T$4:$5:$6'
                    ))
                    : new Date(),
                phoneNumber: metadata.phoneNumber ? String(metadata.phoneNumber) : payment.phoneNumber
            });
        } else {
            await payment.update({
                status: 'failed'
            });
        }

        return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
