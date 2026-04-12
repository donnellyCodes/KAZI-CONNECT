import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, FileText, Clock, AlertCircle, Send, Eye, Check } from 'lucide-react';
import API from '../../api/axios';

export default function PostJob() {
    const CATEGORIES = [
        "Electrician", "House help", "Mason", "Contractor", 
        "House Keeping", "Carpenter", "Painter", "Plumber", 
        "Gardener", "Driver", "Security", "Cleaner", "Other"
    ];
    
    const [jobData, setJobData] = useState({ 
        title: '', 
        description: '', 
        location: '', 
        budget: '', 
        category: '',
        customCategory: '',
        duration: '',
        urgency: 'normal'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));

        // clear custom category when switched from "Other" to predefined category
        if (name === 'category' && value !== 'Other') {
            setJobData(prev => ({ ...prev, customCategory: '' }));
        }

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!jobData.title.trim()) {
            newErrors.title = 'Job title is required';
        } else if (jobData.title.length < 10) {
            newErrors.title = 'Job title must be at least 10 characters';
        }
        
        if (!jobData.description.trim()) {
            newErrors.description = 'Job description is required';
        } else if (jobData.description.length < 50) {
            newErrors.description = 'Please provide a more detailed description (at least 50 characters)';
        }
        
        if (!jobData.category) {
            newErrors.category = 'Please select a category';
        } else if (jobData.category === 'Other' && !jobData.customCategory.trim()) {
            newErrors.customCategory = 'Please specify the job category';
        }
        
        if (!jobData.location.trim()) {
            newErrors.location = 'Location is required';
        }
        
        if (!jobData.budget || jobData.budget <= 0) {
            newErrors.budget = 'Please enter a valid budget amount';
        } else if (jobData.budget < 500) {
            newErrors.budget = 'Minimum budget is KES 500';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const submissionData = {
                ...jobData,
                category: jobData.category === 'Other' ? jobData.customCategory : jobData.category
            };

            await API.post('/jobs', submissionData);
            setShowSuccess(true);
            // Reset form after successful submission
            setJobData({ 
                title: '', 
                description: '', 
                location: '', 
                budget: '', 
                category: '',
                customCategory: '',
                duration: '',
                urgency: 'normal'
            });
        } catch (err) {
            console.error('Error posting job:', err);
            alert(err.response?.data?.message || 'Failed to post job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const urgencyLevels = [
        { value: 'low', label: 'Low (2+ weeks)', color: 'success' },
        { value: 'normal', label: 'Normal (1-2 weeks)', color: 'primary' },
        { value: 'high', label: 'High (3-7 days)', color: 'warning' },
        { value: 'urgent', label: 'Urgent (ASAP)', color: 'error' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                <p className="text-gray-600">
                    Find the perfect worker for your needs. Fill in the details below to get started.
                </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-green-900">Job Posted Successfully!</h3>
                        <p className="text-green-700 text-sm">Your job has been posted and is now visible to workers.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-600" />
                            Job Details
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Briefcase size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Need a Professional Electrician for Kitchen Renovation"
                                    value={jobData.title}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.title ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                            </div>
                            {errors.title ? (
                                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                            ) : (
                                <p className="text-gray-500 text-sm mt-1">Be specific about what you need done</p>
                            )}
                        </div>

                        {/* Job Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={jobData.category}
                                onChange={handleChange}
                                required
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.category ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">What type of worker do you need?</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {/* Custom Category Input */}
                            {jobData.category === 'Other' && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        name="customCategory"
                                        placeholder="Please specify the job category"
                                        value={jobData.customCategory}
                                        onChange={handleChange}
                                        required={jobData.category === 'Other'}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.customCategory ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.customCategory && (
                                        <p className="text-red-600 text-sm mt-1">{errors.customCategory}</p>
                                    )}
                                </div>
                            )}
                            {errors.category && (
                                <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                            )}
                        </div>

                        {/* Job Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe the work in detail. Include specific requirements, scope, and any special considerations..."
                                value={jobData.description}
                                onChange={handleChange}
                                required
                                rows={5}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.description ? (
                                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                            ) : (
                                <p className="text-gray-500 text-sm mt-1">
                                    Minimum 50 characters. More details help attract better candidates.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location & Budget Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MapPin size={20} className="text-blue-600" />
                            Location & Budget
                        </h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Kilimani, Nairobi"
                                        value={jobData.location}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.location ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.location ? (
                                    <p className="text-red-600 text-sm mt-1">{errors.location}</p>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-1">Be as specific as possible for better matches</p>
                                )}
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget (KES) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="budget"
                                        placeholder="Amount in KES"
                                        value={jobData.budget}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.budget ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.budget ? (
                                    <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-1">Minimum KES 500. Competitive rates attract better workers</p>
                                )}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Duration
                            </label>
                            <select
                                name="duration"
                                value={jobData.duration}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select duration</option>
                                <option value="few-hours">A few hours</option>
                                <option value="one-day">One day</option>
                                <option value="few-days">2-3 days</option>
                                <option value="one-week">One week</option>
                                <option value="few-weeks">2-3 weeks</option>
                                <option value="one-month">One month</option>
                                <option value="three-months">3 months</option>
                                <option value="six-months">6 months</option>
                                <option value="one-year">1 year</option>
                                <option value="two-years">2 years</option>
                                <option value="ongoing">Ongoing</option>
                            </select>
                        </div>

                        {/* Urgency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Urgency Level
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {urgencyLevels.map(level => (
                                    <label
                                        key={level.value}
                                        className="relative flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                                    >
                                        <input
                                            type="radio"
                                            name="urgency"
                                            value={level.value}
                                            checked={jobData.urgency === level.value}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{level.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Card */}
                <div className="bg-blue-50 rounded-xl border border-blue-200">
                    <div className="p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-500 mt-1" size={20} />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Tips for a Great Job Post</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Be specific about skills and experience required</li>
                                    <li>• Include timeline and any important deadlines</li>
                                    <li>• Mention if tools or materials will be provided</li>
                                    <li>• Clear requirements help attract the right candidates</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Posting...
                            </>
                        ) : (
                            <>
                                <Briefcase size={20} />
                                Publish Job Post
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/employer/my-jobs')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Create Post Button - Below Form */}
            <div className="border-t border-gray-200 pt-6">
                <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Create Your Post?</h3>
                            <p className="text-gray-600 text-sm">
                                After submitting your job post, you can view and manage all your postings from the My Job Postings page.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/employer/my-jobs')}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Eye size={20} />
                            View My Job Postings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}