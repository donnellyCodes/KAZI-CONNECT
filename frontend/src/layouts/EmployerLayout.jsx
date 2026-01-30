import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, PlusCircle, Briefcase, MessageSquare, LogOut, Users } from 'lucide-react';

export default function EmployerLayout({ children }) {
    const { logout, user } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/employer', icon: LayoutDashboard },
        { name: 'Company Profile', href: '/employer/profile', icon: User },
        { name: 'Post a New Job', href: '/employer/post-job', icon: PlusCircle },
        { name: 'My Job Postings', href: '/employer/my-jobs', icon: Briefcase },
        { name: 'Messages', href: '/employer/messages', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-emerald-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-emerald-800">
                    Kazi <span className="text-emerald-400">Employer</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.href} className="flex-items-center gap-3 p-3 rounded-lg hover:bg-emerald-800 transition-colors">
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <button onClick={logout} className="p-4 border-t border-emerald-800 flex items-center gap-3 hover:bg-red-600 transition-colors">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-slate-800">Employer Panel</h1>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">Verified Hiring Entity</span>
                </header>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}