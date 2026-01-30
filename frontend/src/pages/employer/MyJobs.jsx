import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Users, MapPin, Clock, Link } from 'lucide-react';

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data } = await API.get('/jobs');
                setJobs(data);
            } catch (err) { console.error(err); }
        };
        fetchMyJobs();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Active Postings</h2>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-emerald-700">{job.title}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                                <span className="flex items-center gap-1"><Clock size={14}/> Budget: KES {job.budget}</span>
                            </div>
                        </div>
                        <Link
                            to={`/employer/jobs/${job.id}/applicants`}
                            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all font-medium"
                        >
                            <Users size={18} /> View Applicants
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}