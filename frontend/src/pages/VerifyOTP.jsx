import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const email = state?.email || '';

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
        
        setError('');
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = ['', '', '', '', '', ''];
        
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i];
        }
        
        setOtp(newOtp);
        
        // Focus the last filled input
        const lastIndex = Math.min(pastedData.length - 1, 5);
        document.getElementById(`otp-${lastIndex}`)?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await API.post('/auth/verify-otp', { email, otp: otpCode });
            setIsVerified(true);
            
            // Auto-login after verification
            const { token, user } = response.data;
            if (token && user) {
                login(user, token);
            } else {
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0')?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setError('');

        try {
            await API.post('/auth/resend-otp', { email });
            setError('');
            // You could show a success message here
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    if (isVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                    <p className="text-gray-600 mb-6">Your account has been successfully verified. Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-96">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/register')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Register
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-blue-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600 text-sm">
                        We've sent a 6-digit code to<br />
                        <span className="font-semibold text-gray-900">{email}</span>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* OTP Input Form */}
                <form onSubmit={handleVerify}>
                    <div className="flex justify-center gap-2 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                {/* Resend Code */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                        {resendLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                </div>
            </div>
        </div>
    );
}