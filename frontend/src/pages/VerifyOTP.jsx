import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function VerifyOTP() {
    const [otp, setOtp ] = useState('');
    const { state } = useLocation(); // get email from registration
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            await API.post('/auth/verify-otp', { email: state.email, otp});
            alert("Verified! You can now login.");
            navigate('/login');
        } catch (err) { alert("Invalid OTP"); }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <form onSubmit={handleVerify} className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center">
                <h2 className="text-2xl font-black mb-2">Verify Account</h2>
                <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code sent to {state?.email}</p>
                <input
                    className="w-full p-4 bg-slate-100 rounded-2xl text-center text-2xl font-bold tracking-[10px] outline-none border-2 focus:border-blue-500"
                    maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)}
                />
                <button className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold">Verify Code</button>
            </form>
        </div>
    );
}