import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { MessageSquare, CheckCircle, User } from 'lucide-react';

export default function WorkerPublicProfile() {
    const { workerId } = useParams();
    const [worker, setWorker] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        API.get(`/users/worker-profile/${workerId}`).then(({ data }) => setWorker(data));
    }, [workerId]);

    if (!worker) return <p>Loading...</p>

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold">{worker.firstName} {worker.lastName}</h2>
                    <p className="text-slate-500">{worker.location}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-slate-400 uppercase text-xs">Experience</h3>
                    <p className="text-slate-700 mt-2">{worker.experience}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/employer/messages', { state: { contactId: worker.userId }})}
                        className="flex-1 bg-white border border-emerald-600 text-emerald-600 py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                    >
                        <MessageSquare size={20} /> Message
                    </button>
                    <button className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">
                        Hire This Worker
                    </button>
                </div>
            </div>
        </div>
    );
}