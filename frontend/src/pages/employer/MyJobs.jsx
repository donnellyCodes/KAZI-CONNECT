import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Users, MapPin, Clock, Briefcase, CheckCircle2, CreditCard, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const raiseDispute = async (jobId) => {
        const reason = prompt("Enter reason for dispute (e.g., Worker did not show up):");
        if (reason) {
            try {
                await API.post('/disputes', { jobId, reason });
                alert("Dispute raised. Admin will investigate.");
            } catch (err) {
                alert("Error raising dispute.");
            }
        }
    };

    const handleComplete = async (jobId) => {
        try {
            await API.put(`/jobs/${jobId}/complete`);
            alert("Job marked as completed.");
            fetchMyJobs();
        } catch (err) {
            alert("Failed to mark the job as completed.");
        }
    };

    const handlePayment = async (job) => {
        const phoneNumber = prompt("Enter the M-Pesa phone number to receive the STK Push:");
        if (!phoneNumber) return;

        try {
            const { data } = await API.post(`/payments/initiate/${job.id}`, { phoneNumber });
            alert(data.message || "Payment initiated.");
            fetchMyJobs();
        } catch (err) {
            alert(err.response?.data?.message || "Payment initiation failed.");
        }
    };

    const handleReview = async (job) => {
        const ratingInput = prompt("Rate the worker from 1 to 5:");
        if (!ratingInput) return;

        const rating = Number(ratingInput);
        if (!rating || rating < 1 || rating > 5) {
            alert("Please enter a valid rating between 1 and 5.");
            return;
        }

        const comment = prompt("Leave a short review comment:");
        if (comment === null) return;

        try {
            const { data } = await API.post(`/reviews/${job.id}`, { rating, comment });
            alert(data.message || "Review submitted successfully.");
            fetchMyJobs();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit review.");
        }
    };

    if (loading) {
        return <div className="p-10 text-emerald-600 animate-pulse font-bold">Loading your jobs...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Your Job Postings</h2>
                <Link to="/employer/post-job" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all">
                    + Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium text-lg">You haven't posted any jobs yet.</p>
                    <Link to="/employer/post-job" className="text-emerald-600 font-bold hover:underline mt-2 inline-block">
                        Create your first listing now
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => {
                        const payment = job.Payment;
                        const hasReview = Array.isArray(job.Reviews) && job.Reviews.length > 0;

                        return (
                            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-5 hover:border-emerald-300 transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
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
                                            {payment && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                                    payment.status === 'paid'
                                                        ? 'bg-green-100 text-green-700'
                                                        : payment.status === 'failed'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    Payment {payment.status}
                                                </span>
                                            )}
                                            {hasReview && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-amber-100 text-amber-700">
                                                    Reviewed
                                                </span>
                                            )}
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

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to={`/employer/jobs/${job.id}/applicants`}
                                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                                        >
                                            <Users size={18} /> Applicants
                                        </Link>

                                        {job.status === 'in-progress' && (
                                            <button
                                                onClick={() => handleComplete(job.id)}
                                                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                                            >
                                                <CheckCircle2 size={18} /> Mark Complete
                                            </button>
                                        )}

                                        {job.status === 'completed' && (!payment || payment.status !== 'paid') && (
                                            <button
                                                onClick={() => handlePayment(job)}
                                                className="flex items-center gap-2 bg-violet-50 text-violet-700 px-5 py-2.5 rounded-xl hover:bg-violet-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                                            >
                                                <CreditCard size={18} /> Pay Worker
                                            </button>
                                        )}

                                        {job.status === 'completed' && payment?.status === 'paid' && !hasReview && (
                                            <button
                                                onClick={() => handleReview(job)}
                                                className="flex items-center gap-2 bg-amber-50 text-amber-700 px-5 py-2.5 rounded-xl hover:bg-amber-500 hover:text-white transition-all font-bold text-sm shadow-sm"
                                            >
                                                <Star size={18} /> Leave Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => raiseDispute(job.id)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium self-start"
                                >
                                    Raise Dispute
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
