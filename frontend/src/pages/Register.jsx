import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [role, setRole] = useState('worker'); // This is a default role
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyName: '',
        location: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // structure backend data
        const submissionData = {
            email: formData.email,
            password: formData.password,
            role: role,
            profileData: role === 'worker' ? { firstName: formData.firstName, lastName: formData.lastName, location: formData.location }
                : { companyName: formData.companyName, location: formData.location }
        };

        try {
            const { data } = await API.post('/auth/register', submissionData);
            login(data.user, data.token); // automatic login after registration
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.error || err.message));
        } 
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-10 shadow-xl rounded-2xl">
                <div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join Kazi Connect as a Worker or Employer
                </p>
                </div>

                {/* Role Selection Toggles */}
                <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                    className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all ${role === 'worker' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'}`}
                    onClick={() => setRole('worker')}
                >
                    Worker
                </button>
                <button
                    className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all ${role === 'employer' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'}`}
                    onClick={() => setRole('employer')}
                >
                    Employer
                </button>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <input
                    name="email" type="email" required placeholder="Email Address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleChange}
                />
                <input
                    name="password" type="password" required placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={handleChange}
                />

                {/* Conditional Fields for Worker */}
                {role === 'worker' && (
                    <>
                    <div className="flex gap-4">
                        <input
                        name="firstName" type="text" required placeholder="First Name"
                        className="w-1/2 p-3 border border-gray-300 rounded-lg outline-none"
                        onChange={handleChange}
                        />
                        <input
                        name="lastName" type="text" required placeholder="Last Name"
                        className="w-1/2 p-3 border border-gray-300 rounded-lg outline-none"
                        onChange={handleChange}
                        />
                    </div>
                    </>
                )}

                {/* Conditional Fields for Employer */}
                {role === 'employer' && (
                    <input
                    name="companyName" type="text" required placeholder="Company or Individual Name"
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                    onChange={handleChange}
                    />
                )}

                <input
                    name="location" type="text" required placeholder="Location (e.g. Nairobi, Kenya)"
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                    Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
            </form>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login here</Link>
                </p>
            </div>
        </div>
        </div>
    );
}
