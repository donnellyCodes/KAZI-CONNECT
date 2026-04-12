import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
    Briefcase, 
    Users, 
    PlusCircle, 
    ArrowRight, 
    TrendingUp, 
    Clock, 
    CheckCircle, 
    XCircle,
    Eye,
    Calendar,
    DollarSign,
    UserCheck,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
    const [stats, setStats] = useState({ 
        totalJobs: 0, 
        activeJobs: 0,
        totalApplicants: 0,
        completedJobs: 0,
        pendingReview: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // Fetch stats
                const statsResponse = await API.get('/jobs/employer-stats');
                setStats(statsResponse.data);
                
                // Fetch recent jobs from API
                const jobsResponse = await API.get('/jobs/my-jobs?limit=5');
                setRecentJobs(jobsResponse.data || []);
                
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                // Set empty arrays on error to prevent undefined issues
                setRecentJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'review': return 'text-yellow-600 bg-yellow-100';
            case 'completed': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'active': return <CheckCircle size={16} />;
            case 'review': return <AlertCircle size={16} />;
            case 'completed': return <Eye size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, Employer!</h1>
                <p className="text-blue-100 mb-6">Manage your jobs and track applications all in one place.</p>
                <div className="flex flex-wrap gap-4">
                    <Link 
                        to="/employer/post-job" 
                        className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors"
                    >
                        <PlusCircle size={20} /> Post New Job
                    </Link>
                    <Link 
                        to="/employer/my-jobs" 
                        className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors"
                    >
                        <Briefcase size={20} /> View All Jobs
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Briefcase className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalJobs}</h3>
                    <p className="text-green-600 text-sm mt-2">+12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <UserCheck className="text-blue-500" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Total Applicants</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalApplicants || 0}</h3>
                    <p className="text-blue-600 text-sm mt-2">+8% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-xl">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <AlertCircle className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeJobs}</h3>
                    <p className="text-yellow-600 text-sm mt-2">Need attention</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <CheckCircle className="text-purple-600" size={24} />
                        </div>
                        <DollarSign className="text-purple-500" size={20} />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Completed Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.completedJobs || 0}</h3>
                    <p className="text-purple-600 text-sm mt-2">This month</p>
                </div>
            </div>

            {/* Recent Jobs Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                        <Link 
                            to="/employer/my-jobs" 
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                                            {getStatusIcon(job.status)}
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-1">
                                            <Users size={16} className="text-gray-400" />
                                            {job.applicants}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {job.budget}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            {job.posted}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link 
                                            to={`/employer/jobs/${job.id}/applicants`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <PlusCircle className="text-blue-600" size={24} />
                        <span className="text-blue-600 text-2xl font-bold">01</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Post a New Job</h3>
                    <p className="text-gray-600 text-sm mb-4">Create a new job posting and find the perfect candidate</p>
                    <Link 
                        to="/employer/post-job"
                        className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700"
                    >
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="text-green-600" size={24} />
                        <span className="text-green-600 text-2xl font-bold">02</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Review Applicants</h3>
                    <p className="text-gray-600 text-sm mb-4">Check and review applications for your posted jobs</p>
                    <Link 
                        to="/employer/my-jobs"
                        className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
                    >
                        View Applications <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <Briefcase className="text-purple-600" size={24} />
                        <span className="text-purple-600 text-2xl font-bold">03</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Jobs</h3>
                    <p className="text-gray-600 text-sm mb-4">Edit, update, or manage your active job postings</p>
                    <Link 
                        to="/employer/my-jobs"
                        className="text-purple-600 font-medium flex items-center gap-1 hover:text-purple-700"
                    >
                        Manage Jobs <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}