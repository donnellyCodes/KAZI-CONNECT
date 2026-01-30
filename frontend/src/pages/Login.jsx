import { useState } from "react";
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data.user, data.token);
        } catch (err) {
            alert("Login failed: " + err.response?.data?.message);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Login to Kazi Connect</h2>
                <input
                    type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
                <div className="text-center mt-4 text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold">Register here</Link>
                </div>
            </form>
        </div>
    )
}