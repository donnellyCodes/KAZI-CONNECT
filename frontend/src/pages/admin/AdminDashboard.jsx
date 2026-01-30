import { Users, Briefcase, IndianRupee, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { name: 'Total Workers', value: '1,240', icon: Users, color: 'bd-blue-500' },
        { name: 'Active Jobs', value: '85', icon: Briefcase, color: 'bg-emerald-500' },
        { name: 'Escrow volume', value: 'KES 450K', icon: IndianRupee, color: 'bg-amber-500' },
        { name: 'Pending Disputes', value: '12', icon: AlertCircle, color: 'bg-red-500' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))} 
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent System Logs</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                            <span className="text-slate-600">New worker registration: worker_{i}@example.com</span>
                            <span className="text-gray-400">2 mins ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}