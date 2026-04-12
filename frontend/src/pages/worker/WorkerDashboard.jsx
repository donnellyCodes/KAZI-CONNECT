import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Briefcase, CheckCircle, Clock, ArrowRight, MessageSquare, Zap, MapPin, DollarSign, TrendingUp, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-center">
            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {job.title}
                    </h4>
                    {job.matchScore && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            AI MATCH: {job.matchScore}%
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={14} />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <DollarSign size={14} />
                        KES {job.budget}
                    </div>
                </div>
            </div>
            <Link 
                to={`/worker/jobs/${job.id}`} 
                className="ml-4 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
            >
                <ArrowRight size={20} />
            </Link>
        </div>
    </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${color === 'primary' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
            <Icon className={color === 'primary' ? 'text-blue-200' : 'text-blue-500'} size={32} />
            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <TrendingUp size={16} />
                    <span className={color === 'primary' ? 'text-blue-200' : 'text-green-600'}>
                        {trend}
                    </span>
                </div>
            )}
        </div>
        <div>
            <p className={`text-sm font-medium ${color === 'primary' ? 'text-blue-100' : 'text-gray-600'}`}>
                {title}
            </p>
            <h3 className={`text-3xl font-black ${color === 'primary' ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </h3>
        </div>
    </div>
);

export default function WorkerDashboard() {
    const [stats, setStats] = useState({ totalApplications: 0, acceptedApplications: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await API.get('/jobs/worker-stats');
                const jobRes = await API.get('/jobs?limit=3');
                setStats(statsRes.data);
                setRecentJobs(jobRes.data.filter(job => job.status === 'open').slice(0, 3));
                const myJobsRes = await API.get('/jobs');
                const hired = myJobsRes.data.filter(job => job.status === 'in-progress');
                setActiveJobs(hired);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchAI = async () => {
            try {
                const { data } = await API.get('/jobs/recommendations');
                setRecommendations(data);
            } catch (err) { 
                console.error(err); 
            }
        };
        fetchAI();
    }, []);

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
            <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                    <p className="text-blue-100 text-lg">
                        Here's what's happening with your job search today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Applications"
                    value={stats.totalApplications}
                    icon={Briefcase}
                    color="primary"
                    trend="+12%"
                />
                <StatCard
                    title="Jobs Hired"
                    value={stats.acceptedApplications}
                    icon={CheckCircle}
                    color="success"
                />
                <StatCard
                    title="Active Jobs"
                    value={activeJobs.length}
                    icon={Clock}
                    color="default"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* AI Recommendations */}
                {recommendations.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Zap className="text-amber-500" size={24} />
                                AI Recommended for You
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-4">
                                {recommendations.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                            <div className="mt-4 text-center">
                                <Link to="/worker/jobs" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    View All Recommendations
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Opportunities */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">New Opportunities</h2>
                            <Link to="/worker/jobs" className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                                Browse All
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {recentJobs.length > 0 ? (
                            <div className="grid gap-4">
                                {recentJobs.map(job => (
                                    <div key={job.id} className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{job.title}</h4>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign size={14} />
                                                        KES {job.budget}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link to={`/worker/jobs/${job.id}`} className="text-blue-600">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="font-medium">No new opportunities available right now.</p>
                                <p className="text-sm mt-2">Check back later for new job postings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Projects */}
            {activeJobs.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Current Projects
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-4">
                            {activeJobs.map(job => (
                                <div key={job.id} className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{job.title}</h4>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                In Progress
                                            </span>
                                        </div>
                                        <Link
                                            to="/worker/messages"
                                            state={{ contactId: job.Employer?.userId }}
                                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            <MessageSquare size={20} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
