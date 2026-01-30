import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase, AlertTriangle, BarChart3, LogOut, Settings } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { logout } = useAuth();

    const navigation = [
        { name: 'Statistics', href: '/admin', icon: BarChart3 },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Job Moderation', href: '/admin/jobs', icon: Briefcase },
        { name: 'Disputes & Reports', href: '/admin/disputes', icon: AlertTriangle },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="p-6 flex items-center gap-2 text-white text-2xl font-bold border-b border-slate-800">
                    <ShieldCheck className="text-crimson-500 text-red-500" />
                    Kazi <span className="text-red-500">Admin</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        <Link key={item.name} to={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all">
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    })}
                </nav>
                <button onClick={logout} className="p-4 border-t border-slate-800 flex items-center gap-3 hover:bg-red-900 hover:text-white transition-colors">
                    <LogOut size={20} /> Logout
                </button>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center">
                    <h1 className="text-lg font-bold text-slate-800 uppercase tracking-widest">System Control Panel</h1>
                    <div className="flex items-center gap-4">
                        <span className="flex h-3 w-3 rounded-full bg-screen-500"></span>
                        <span className="text-sm font-medium text-slate-600">System Online</span>
                    </div>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}