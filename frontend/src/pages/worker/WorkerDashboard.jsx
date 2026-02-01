import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Briefcase, CheckCircle, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkerDashboard() {
    const [stats, setStats] = useState({ totalApplications: 0, acceptedApplications: 0});
    const [recentJobs, setRecentJobs] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await API.get('/jobs/worker-stats');
                const jobRes = await API.get('/jobs?limits=3');
                setStats(statsRes.data);
                setRecentJobs(jobRes.data.slice(0, 3)); // only show the top 3
                const myJobsRes = await API.get('/jobs');
                const hired = myJobsRes.data.filter(job => job.hasApplied && job.status === 'in-progress');
                setActiveJobs(hired);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-10 text-indigo-600 font-bold">Loading your dashboard...</div>

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
                    <Briefcase className="mb-4 opacity-50" size={32} />
                    <p className="text-indigo-100 text-sm font-medium">Total Applications</p>
                    <h3 className="text-4xl font-black">{stats.totalApplications}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <CheckCircle className="mb-4 text-green-500" size={32} />
                    <p className="text-slate-500 text-sm font-medium">Jobs hired</p>
                    <h3 className="text-4xl font-black text-slate-800">{stats.acceptedApplications}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <Clock className="mb-4 text-amber-500" size={32} />
                    <p className="text-slate-500 text-sm font-medium">Active Tasks</p>
                    <h3 className="text-4xl font-black text-slate-800">{activeJobs.length}</h3>
                </div>
            </div>
            
            {/* Active Projects Section */}
            {activeJobs.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        Current Projects
                    </h3>
                    <div className="grid gap-4">
                        {activeJobs.map(job => (
                            <div key={job.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{job.title}</h4>
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mt-1">Status: In Progress</p>
                                </div>
                                <Link
                                    to="/worker/messages"
                                    state={{ contactId: job.Employer?.userId }}
                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                    <MessageSquare size={20} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">New Opportunities</h3>
                    <Link to="/worker/jobs" className="text-indigo-600 font-bold text-sm flex items-center gap-1">
                        Browse All <ArrowRight size={16}/>
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentJobs.map(job => (
                       <div key={job.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">{job.title}</h4>
                                <p className="text-xs text-slate-500">{job.location} • KES {job.budget}</p>
                            </div>
                            <Link to={`/worker/jobs/${job.id}`} className="text-indigo-600"><ArrowRight size={20}/></Link>
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4">Current Projects</h3>
                    {activeJobs.map(job => (
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="font-bold">{job.title}</p>
                                <p className="text-xs text-emerald-600 font-bold uppercase">Status: In Progress</p>
                            </div>
                            <Link to="/worker/messages" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <MessageSquare size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}