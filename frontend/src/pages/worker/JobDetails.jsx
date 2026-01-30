import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { MapPin, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [proposal, setProposal] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await API.get(`/jobs/${id}`);
                setJob(data);
            } catch (err) { console.error(err); }
        };
        fetchJob();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post(`/jobs/${id}/apply`, { proposal });
            alert("Application submitted");
            navigate('/worker/jobs');
        } catch (err) {
            alert(err.response?.data?.message || "Application failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (!job) return <div className="p-10 text-indigo-600">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4">
                <ArrowLeft size={20} /> Back to Listings
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Job Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-900 mb-6">{job.title}</h1>
                        <div className="flex flex-wrap gap-6 mb-8 p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-indigo-600" size={20} />
                                <span className="text-sm font-medium">{job.locations}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="text-indigo-600" size={20} />
                                <span className="text-sm font-medium text-green-700">KES {job.budget}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="text-indigo-600" size={20} />
                                <span className="text-sm font-medium">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-4 text-slate-800 uppercase tracking-wide">Job Description</h3>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed text-lg">
                            {job.description}
                        </p>
                    </div>
                </div>
                {/*Right: Application form */}
                <div className="space-y-6">
                    <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl sticky top-6">
                        <h3 className="text-xl font-bold mb-4">Submit Application</h3>
                        <p className="text-indigo-200 text-sm mb-6">Tell the employer whhy you are the best person for this task.</p>
                        <form onSubmit={handleApply} className="space-y-4">
                            <textarea
                                required
                                placeholder="Write your proposal here..."
                                className="w-full p-4 bg-indigo-800 border-none rounded-2xl text-white placeholder-indigo-400 focus:ring-2 focus:ring-white outline-none h-40"
                                onChange={(e) => setProposal(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all shadow-lg"
                            >
                                {submitting ? 'Submitting...' : 'Apply Now'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}