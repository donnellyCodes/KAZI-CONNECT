import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, Briefcase, IndianRupee, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalWorkers: 0,
        activeJobs: 0,
        escrowVolume: 0,
        pendingDisputes: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/users/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to load admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { name: 'Total Workers', value: stats.totalWorkers, icon: Users, color: 'bd-blue-500' },
        { name: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'bg-emerald-500' },
        { name: 'Escrow volume', value: `KES ${stats.escrowVolume.toLocaleString()}`, icon: IndianRupee, color: 'bg-amber-500' },
        { name: 'Pending Disputes', value: stats.pendingDisputes, icon: AlertCircle, color: 'bg-red-500' },
    ];

    if (loading) return <div className="p-10 text-slate-400 animate-pulse">Loading System Statistics...</div>

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white flex justify-between items-center shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black mb-1">System Health Overview</h2>
                    <p className="text-slate-400 text-sm">Real time data from Kazi Connect database</p>
                </div>
                <TrendingUp size={48} className="text-red-500 opacity-50" />
            </div>
            {/* Real Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((item) => (
                    <div key={item.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</p>
                                <h3 className="text-3xl font-black text-slate-800">{item.value}</h3>
                            </div>
                            <div className={`${item.color} p-3 rounded-2xl text-white shadow-lg shadow-current/20`}>
                                <item.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Analytics Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Recent platform activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <span className="text-sm text-slate-600 font-bold">New Worker Registered</span>
                            <span className="text-xs text-slate-400 italic">Today</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <span className="text-sm text-slate-600 font-bold">Payment to Escrow</span>
                            <span className="text-xs text-slate-400 italic">2 hours ago</span>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                    <h3 className="font-bold text-red-900 mb-2">Attention Required</h3>
                    <p className="text-red-700 text-sm mb-4">You have {stats.pendingDisputes} active disputes that require manual resolution to release funds.</p>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
                        Review Disputes
                    </button>
                </div>
            </div>
        </div>
    );      
}