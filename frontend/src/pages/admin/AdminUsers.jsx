import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Check, X, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await API.get('/users/admin/users');
                setUsers(data);
            } catch (err) { console.error(err); }
        };
        fetchUsers();
    }, []);

    const handleVerify = async (workerId, status) => {
        try {
            await API.put('/users/admin/verify', { workerId, status });
            alert(`Worker ${status}`);
        } catch (err) { alert("Action failed"); }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-white text-sm">
                    <tr>
                        <th className="p-4">User Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-slate-700">{user.email}</td>
                            <td className="p-4 capitalize">{user.role}</td>
                            <td className="p-4">
                                {user.Worker?.isVerified ? 
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span> : 
                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Pending</span>
                                }
                            </td>
                            <td className="p-4 flex gap-2">
                                {user.role === 'worker' && !user.Worker?.isVerified && (
                                    <button onClick={() => handleVerify(user.Worker.id, 'verified')} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={20}/></button>
                                )}
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><ShieldAlert size={20}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}