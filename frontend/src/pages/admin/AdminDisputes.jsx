import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

export default function AdminDisputes() {
    const disputes = [
        { id: 1, user: "John Doe", job: "Plumbing", reason: "Worker didn't show up", status: "open"},
        { id: 2, user: "Built-It Ltd", job: "Electrical", reason: "Overcharged", status: "open" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Active Disputes</h2>
            <div className="bg-white rounded-3xl border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                        <tr>
                            <th className="p-4">Raised By</th>
                            <th className="p-4">Job</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {disputes.map(d => (
                            <tr key={d.id} className="hover:bg-slate-50">
                                <td className="p-4 font-bold">{d.user}</td>
                                <td className="p-4 text-sm">{d.job}</td>
                                <td className="p-4 text-sm text-red-600 font-medium">{d.reason}</td>
                                <td className="p-4 flex gap-2">
                                    <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={18}/></button>
                                    <button className="p-2 bg-slate-100 text-slate-600 rounded-lg"><ExternalLink size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}