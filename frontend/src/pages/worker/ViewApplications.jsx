import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { User, MessageSquare, CheckCircle, XCircle, MapPin } from 'lucide-react';

export default function ViewApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const { data } = await API.get(`/jobs/${jobId}/applications`);
                setApplicants(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();     
    }, [jobId]);

    const handleStatusUpdate = async (appId, status ) => {
        try {
            await API.put(`/jobs/applications/${appId}`, { status });
            alert(`Application ${status}!`);
            // refresh list
            setApplicants(applicants.map(app => app.id === appId ? { ...app, status } : app));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const startChat = (workerUserId) => {
        // redirect to messages to select user
        navigate('/employer/messages', { state: { selectedUserId: workerUserId } });
    };

    if (loading) return <div className="p-10 text-emerald-600">Loading Applicants...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Applicants for Job</h2>
            {applicants.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
                    <p className="text-slate-500">No one has applied for this job yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applicants.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl">
                                        {app.Worker?.firstName?.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        {app.Worker?.firstName} {app.Worker?.lastName}
                                    </h3>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin size={12}/> {app.Worker?.location || 'No location set'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-slate-700 text-sm">
                                "{app.proposal}"
                            </div>
                            <div className="flex flex-row md:flex-col gap-2 justify-center">
                                <button
                                    onClick={() => startChat(app.Worker?.userId)}
                                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all text-sm font-bold"
                                >
                                    <MessageSquare size={18} /> Message
                                </button>

                                {app.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold"
                                        >
                                            <CheckCircle size={18} /> Hire Worker
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all text-sm font-bold"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className={`text-center py-2 px-4 rounded-xl font-bold text-xs uppercase tracking-widest ${
                                        app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {app.status}
                                    </div>                            
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}