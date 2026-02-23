import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Clock, Search, MapPin, DollarSign, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobDiscovery() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({ search: '', location: '', minBudget: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await API.get('/jobs', { params: filters });
                setJobs(data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="p-10 text-indigo-600 font-bold animate-pulse">Scanning for opportunities...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Opportunities</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        placeholder="Search by skill or title..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium text-lg">No jobs are currently available. Check back soon!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                        {/* indicate if applied */}
                                        {job.hasApplied && (
                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-black uppercase">
                                                Already Applied
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{job.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded"><MapPin size={14}/> {job.location}</span>
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded"><Clock size={14}/>KES {job.budget}</span>
                                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                                            Hiring: {job.Employer?.companyName || 'Verified Employer'}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={`/worker/jobs/${job.id}`}
                                    className={`p-3 rounded-xl transition-all ${
                                        job.Applications?.length > 0 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}