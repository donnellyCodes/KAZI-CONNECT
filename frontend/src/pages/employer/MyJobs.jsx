import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Users, MapPin, Clock, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data } = await API.get('/jobs/my-jobs');
                setJobs(data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    const raiseDispute = async (jobId) => {
        const reason = prompt("Enter reason for dispute (e.g., Worker did not show up):");
        if (reason) {
            try {
                await API.post('/disputes', { jobId: jobId, reason });
                alert("Dispute raised. Admin will investigate.");
            } catch (err) {
                alert("Error raising dispute.");
            }
        }
    };

    if (loading) return <div className="p-10 text-emerald-600 animate-pulse font-bold">Loading your jobs...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Your Job Postings</h2>
                <Link to="/employer/post-job" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">
                    + Post New Job
                </Link>
            </div>

            {jobs.Length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium text-lg">You haven't posted any jobs yet.</p>
                    <Link to="/employer/post-job" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">
                        Create your first listing now
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center hover:border-emerald-300 transition-all">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                        job.status === 'open' ? 'bg-blue-100 text-blue-600' :
                                        job.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                                        'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex gap-4 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} className="text-emerald-500" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} className="text-emerald-500" /> Budget: KES {job.budget}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <Link
                                    to={`/employer/jobs/${job.id}/applicants`}
                                    className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                                >
                                    <Users size={18} />Applicants
                                </Link>

                                {job.status === 'in-progress' && (
                                    <button
                                        onClick={() => handleComplete(job.id)}
                                        className="text-sm font-bold text-blue-600 hover:underline"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => raiseDispute(job.id)}
                                className="text-xs text-red-500 hover:text-red-700 mt-2 font-medium"
                            >
                                Raise Dispute
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}