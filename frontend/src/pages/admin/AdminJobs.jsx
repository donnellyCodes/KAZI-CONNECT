import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Trash2 } from 'lucide-react';

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        API.get('/jobs').then(({ data }) => setJobs(data));
    }, []);

    const deleteJob = async (id) => {
        if (window.confirm("Are you sure you want to remove this job?")) {
            await API.delete(`/api/jobs/${id}`); // delete route
            setJobs(jobs.filter(j => j.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-xs uppercase font-black">
                    <tr>
                        <th className="p-4">Job Title</th>
                        <th className="p-4">Employer</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {jobs.map(job => (
                        <tr key={job.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold">{job.title}</td>
                            <td className="p-4">{job.Employer?.companyName}</td>
                            <td className="p-4">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{job.status}</span>
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => deleteJob(job.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}