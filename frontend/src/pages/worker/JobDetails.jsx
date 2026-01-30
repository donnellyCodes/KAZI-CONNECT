import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [proposal, setProposal] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        API.get(`/jobs/${id}`).then(({ data }) => setJob(data));
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/jobs/${id}/apply`, { proposal });
            alert("Application submitted");
            navigate('/worker');
        } catch (err) {
            alert(err.response?.data?.message || "Application failed");
       }
    };

    if (!job) return <div>Loading...</div>

    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold mb-4">Apply for this job</h3>
                    <form onSubmit={handleApply} className="space-y-4">
                        <textarea
                            required placeholder="Why are you a good fit?"
                            className="w-full p-3 border rounded-xl h-32 text-sm"
                            onChange={(e) => setProposal(e.target.value)}
                        />
                        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
                            Submit Proposal
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}