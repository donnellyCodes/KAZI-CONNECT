import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function PostJob() {
    const CATEGORIES = ["Electrician", "House help", "Mason", "Contractor", "House Keeping", "Carpenter", "Painter"];
    const [jobData, setJobData] = useState({ title: '', description: '', location: '', budget: '', category: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/jobs', jobData);
            alert("Job posted successfully!");
            navigate('/employer/my-jobs');
        } catch (err) { alert("Error posting job"); }
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Post a New Requirement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600">Job Title</label>
                    <input
                        required className="w-full mt-1 p-2 border rounded-md"
                        placeholder="e.g. Need a Professional Electrician"
                        onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600">Job Category</label>
                    <select
                        required
                        className="w-full mt-1 p-2 border rounded-md bg-white"
                        onChange={(e) => setJobData({...jobData, category: e.target.value})}
                    >
                        <option value="">What type of worker do you need?</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Location</label>
                        <input
                            required className="w-full mt-1 p-2 border rounded-md"
                            placeholder="e.g. Kilimani, Nairobi"
                            onChange={(e) => setJobData({...jobData, location: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600">Budget (KES)</label>
                        <input 
                            required type="number" className="w-full mt-1 p-2 border rounded-md" 
                            placeholder="Amount"
                            onChange={(e) => setJobData({...jobData, budget: e.target.value})}
                        />
                    </div>
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
                    Publish Job Post
                </button>
            </form>
        </div>
    );
}