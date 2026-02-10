import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Briefcase, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
    const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0 });
    useEffect(() => {
        API.get('/jobs/employer-stats').then(({ data }) => setStats(data));
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100">
                    <Briefcase className="mb-4 opacity-40" size={32} />
                    <p className="text-emerald-100 text-sm font-bold uppercase">Total Posted</p>
                    <h3 className="text-5xl font-black mt-1">{stats.totalJobs}</h3>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <Users className="mb-4 text-emerald-500" size={32} />
                    <p className="text-slate-400 text-sm font-bold uppercase">Jobs In Progress</p>
                    <h3 className="text-5xl font-black text-slate-800 mt-1">{stats.activeJobs}</h3>
                </div>
            </div>
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-emerald-900">Need more help?</h3>
                    <p className="text-emerald-700">Post a new job today and find workers</p>
                </div>
                <Link to="/employer/post-job" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                    <PlusCircle size={20} /> Post Job
                </Link>
            </div>
        </div>
    );
}