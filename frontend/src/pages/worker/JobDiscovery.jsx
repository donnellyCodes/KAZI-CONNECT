import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, MapPin, DollarSign, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobDiscovery() {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({ search: '', location: '', minBudget: '' });

    const fetchJobs = async () => {
        try {
            const { data } = await API.get('/jobs', { params: filters });
            setJobs(data);
        } catch (err) { console.error(err); }
    };
    useEffect(() => { fetchJobs(); }, [filters]);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Search size={18}/> Filters
                </h3>
                <div className="space-y-4">
                    <input
                        placeholder="Search titles..."
                        className="w-full p-2 border rounded-lg text-sm"
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                    />
                    <input
                        placeholder="Location..."
                        className="w-full p-2 border rounded-lg text-sm"
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                    <input
                        type="number" placeholder="Min Budget (KES)"
                        className="w-full p-2 border rounded-lg text-sm"
                        onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                    />
                </div>
            </aside>

            {/* Main Job Feed */}
            <div className="flex-1 space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">
                                    NEW LISTING
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{job.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                                    <span className="flex items-center gap-1"><DollarSign size={14}/> KES {job.budget}</span>
                                    <span className="flex items-center gap-1"><Briefcase size={14}/> {job.Employer?.companyName}</span>
                                </div>
                            </div>
                            <Link
                                to={`/worker/jobs/${job.id}`}
                                className="bg-indigo-600 text-white p-3 rounded-xl group-hover:bg-indigo-700 transition-all"
                            >
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && <p className="text-center py-20 text-slate-400">No jobs found matching your criteria.</p>}
            </div>
        </div>
    );
}