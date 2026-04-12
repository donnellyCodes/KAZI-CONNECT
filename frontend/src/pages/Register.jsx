import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Building, MapPin, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState('worker');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyName: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Set role from URL parameter on component mount
    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'employer' || roleParam === 'worker') {
            setRole(roleParam);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // structure backend data
        const submissionData = {
            email: formData.email,
            password: formData.password,
            role: role,
            profileData: role === 'worker' 
                ? { firstName: formData.firstName, lastName: formData.lastName, location: formData.location }
                : { companyName: formData.companyName, location: formData.location }
        };

        try {
            const { data } = await API.post('/auth/register', submissionData);
            // redirect to OTP page
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const baseFields = formData.email && formData.password && formData.location;
        if (role === 'worker') {
            return baseFields && formData.firstName && formData.lastName;
        }
        return baseFields && formData.companyName;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-2xl">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
                        <span className="text-white text-2xl font-bold">K</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-600">Join Kazi Connect and start your journey</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-center text-gray-900">Join Kazi Connect</h2>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            <button
                                className={`w-1/2 py-3 text-sm font-medium rounded-md transition-all ${
                                    role === 'worker' 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setRole('worker')}
                            >
                                <User size={20} className="inline mr-2" />
                                I'm a Worker
                            </button>
                            <button
                                className={`w-1/2 py-3 text-sm font-medium rounded-md transition-all ${
                                    role === 'employer' 
                                        ? 'bg-green-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setRole('employer')}
                            >
                                <Building size={20} className="inline mr-2" />
                                I'm an Employer
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">Minimum 8 characters recommended</p>
                            </div>

                            {/* Conditional Fields for Worker */}
                            {role === 'worker' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                name="firstName"
                                                type="text"
                                                placeholder="First name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                name="lastName"
                                                type="text"
                                                placeholder="Last name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conditional Fields for Employer */}
                            {role === 'employer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            name="companyName"
                                            type="text"
                                            placeholder="Company or Individual Name"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="location"
                                        type="text"
                                        placeholder="e.g. Nairobi, Kenya"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading || !isFormValid()}
                            >
                                {loading ? "Creating account..." : `Create ${role === 'worker' ? 'Worker' : 'Employer'} Account`}
                                <ArrowRight size={20} />
                            </button>
                        </form>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link 
                                    to="/login" 
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
}
