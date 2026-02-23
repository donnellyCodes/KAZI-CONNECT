// to test the AI algorithm

import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Brain, Search, User, Briefcase, Zap, Info } from 'lucide-react';

export default function AIInspector() {
    const [jobs, setJobs] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedJob, setSelectedJob] = useState([]);
    const [analysis, setAnalysis] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch all data for the simulator
        const fetchData = async () => {
            const jobsRes = await API.get('/jobs');
            const usersRes = await API.get('/users/admin/users'); // use admin route
            setJobs(jobsRes.data);
            setWorkers(usersRes.data.filter(u => u.role === 'worker'));
        };
        fetchData();
    }, []);

    const runAnalysis = async () => {
        if (!selectedJob) return alert("Select a job first");
        setLoading(true);
        try {
            const { data } = await API.get(`/jobs/${selectedJob.id}/applicants`);
            setAnalysis(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div className="space-y-8 p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-lg shadow-amber-200">
                    <Brain size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800">AI Matching Algorithm Inspector</h1>
                    <p className="text-slate-500">Demonstrates multi-factor scoring logic</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selection panel */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Briefcase className="text-amber-500" size={18}/> Select a job</h3>
                    <select
                        className="w-full p-3 bg-slate-100 rounded-xl outline-none"
                        onChange={(e) => setSelectedJob(jobs.find(j => j.id === e.target.value))}
                    >
                        <option>Choose a posted Job...</option>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>

                    {selectedJob && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-sm">
                            <p className="font-bold text-amber-800">Keywords extracted:</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {(selectedJob?.title || '').split(' ').map(w => <span key={w} className="bg-white px-2 py-1 rounded text-xs border">{w}</span>)}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={runAnalysis}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                    >
                        {loading ? "Processing..." : "Run AI Analysis"} <Zap size={18} className="text-amber-400" />
                    </button>
                </div>

                {/* Results and breakdown */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Zap className="text-amber-500" size={18}/> Ranking results</h3>
                    {analysis.length === 0 ? (
                        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-400">
                            Select a job and run the analysis to see AI logic.
                        </div>
                    ) : (
                        analysis.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                        <div>
                                            <h4 className="font-black text-slate-800">{item.Worker?.firstName} {item.Worker?.lastName}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-amber-500">{item.matchScore}%</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Match Confidence</p>
                                    </div>
                                </div>

                                {/* Score breakdown*/}
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span>Skills Relevancy</span>
                                            <span>50% Weight</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${item.matchScore > 50 ? 90 : 40}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span>Location Proximity</span>
                                            <span>20% Weight</span>
                                        </div>

                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${item.Worker?.location === selectedJob?.location ? 100 : 0}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span>Trust & Rating Factor</span>
                                            <span>30% Weight</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-amber-400 h-full transition-all duration-1000" style={{width: `80%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}