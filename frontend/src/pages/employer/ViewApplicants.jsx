import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { User, MessageSquare, CheckCircle, XCircle, MapPin, Mail } from 'lucide-react';

export default function ViewApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // fetch applicants for a specific job
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const { data } = await API.get(`/jobs/${jobId}/applicants`);
                console.log("Data receivec from API:", data);
                setApplicants(data);
            } catch (err) {
                console.error("Error fetching applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    // To handle hiring or rejecting an applicant
    const handleStatusUpdate = async (appId, status) => {
        try {
            await API.put(`/jobs/applicants/${appId}`, { status });
            alert(`Successfully updated status to: ${status}`);

            // update UI list locally without refreshing the page
            setApplicants(applicants.map(app => app.id === appId ? {...app, status } : app));
        } catch (err) {
            alert("Failed to update status: Make sure the backend route exists.");
        }
    };

    // navigate to chat with this worker
    const startChat = (id) => {
        console.log("DEBUG: Redirecting to chat with User ID:", workerUserId);

        if (!id) return alert("Worker ID not found");

        navigate('/employer/messages', { state: { contactId:workerUserId } });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-emerald-600 font-bold animate-pulse">
            Loading applications...
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Job Applications</h2>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                    {applicants.length} Total Applicants
                </span>
            </div>

            {applicants.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 text-lg font-medium">No workers have applied for this job yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applicants.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start gap-6 hover:shadow-md transition-shadow">
                            {/* AI Ribbon */}
                            <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold shadow-sm">
                                AI MATCH: {app.matchScore || '85'}%
                            </div>
                            {/* Worker Info section */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                                        {app.Worker?.firstName?.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-xl">
                                        {app.Worker?.firstName}{app.Worker?.lastName}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><MapPin size={14}/> {app.Worker?.location || 'Unknown'}</span>
                                        <span className="flex items-center gap-1"><Mail size={14}/> {app.Worker?.User?.email}</span>
                                    </div>
                                </div>
                            </div>
                            {/* The proposal/bio */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                <span className="absolute -top-2 left-4 bg-white px-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Worker's Proposal</span>
                                <p className="text-slate-700 text-sm leading-relaxed italic">"{app.proposal || 'No proposal message provided.'}"</p>
                            </div>
                            {/* Action buttons section */}
                            <div className="flex flex-row md:flex-col gap-3 w-full md:w-48">
                                <button
                                    onClick={() => {
                                        const messagingId = app.Worker?.User?.id || app.Worker?.userId;
                                        if (messagingId) {
                                            navigate('/employer/messages', { state: { contactId: messagingId } });
                                        } else {
                                            alert("Cannot start chat: Messaging ID missing for this worker.");
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm"
                                >
                                    <MessageSquare size={18} /> Chat
                                </button>
                                {app.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-md"
                                        >
                                            <CheckCircle size={18} /> Hire
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all font-bold text-sm"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className={`w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest border ${
                                        app.status === 'accepted' 
                                        ?'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-red-50 text-red-700 border-red-200'
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