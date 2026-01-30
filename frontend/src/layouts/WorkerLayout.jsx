import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, Briefcase, MessageSquare, LogOut, CheckCircle } from 'lucide-react';

export default function WorkerLayout({ children }) {
    const { logout, user } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/worker', icon: LayoutDashboard },
        { name: 'My Profile', href: '/worker/profile', icon: User },
        { name: 'Find Jobs', href: '/worker/jobs', icon: Briefcase},
        { name: 'Messages', href: '/worker/messages', icon: MessageSquare},
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-indigo-800">
                Kazi <span className="text-indigo-400">Worker</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => (
                    <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                    <item.icon size={20} />
                    {item.name}
                    </Link>
                ))}
                </nav>
                <button 
                onClick={logout}
                className="p-4 border-t border-indigo-800 flex items-center gap-3 hover:bg-red-600 transition-colors"
                >
                <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-slate-800">Welcome, {user?.email}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Worker Account
                    </span>
                </div>
                </header>
                <div className="p-8">
                {children}
                </div>
            </main>
         </div>
    );
}