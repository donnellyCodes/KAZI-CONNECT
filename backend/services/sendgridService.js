const { Resend } = require('resend');
const resend = new Resend('re_5KbHk1qB_AMAKdDtNgLeXR32PeReJezvw');

const sendOTPEmail = async (email, otp, firstName = '') => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'KAZI CONNECT <onboarding@resend.dev>',
            to: [email],
            subject: 'KAZI CONNECT - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">🔐 Email Verification</h2>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            ${firstName ? `Hi <strong>${firstName}</strong>,` : 'Hello,'}
                        </p>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Welcome to <strong>KAZI CONNECT</strong>! Your OTP code is:
                        </p>
                        <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center;">
                            This code expires in 10 minutes.
                        </p>
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                            <p style="font-size: 12px; color: #999; margin: 0;">
                                If you didn't request this verification, please ignore this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log(`Email sent via Resend: ${data.id}`);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('Resend service error:', error);
        return { success: false, error: error.message };
    }
};

const sendWelcomeEmail = async (email, firstName) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'KAZI CONNECT <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to KAZI CONNECT! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">🎉 Welcome to KAZI CONNECT!</h2>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Hi <strong>${firstName}</strong>,
                        </p>
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Your email has been successfully verified! You can now:
                        </p>
                        <ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">
                            <li>✅ Create your worker profile</li>
                            <li>✅ Browse and apply for jobs</li>
                            <li>✅ Connect with employers</li>
                            <li>✅ Start earning opportunities</li>
                        </ul>
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="http://localhost:5173/login" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Login to Your Account
                            </a>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, messageId: data.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail, sendWelcomeEmail };