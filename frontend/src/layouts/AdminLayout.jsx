import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase, AlertTriangle, BarChart3, LogOut, Brain, Menu, X, Bell, Settings } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { logout, user } = useAuth();
    const location= useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'System Overview', href: '/admin', icon: BarChart3 },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Job Moderation', href: '/admin/jobs', icon: Briefcase },
        { name: 'AI Matching Lab', href: '/admin/ai-inspector', icon: Brain },
        { name: 'Disputes & Reports', href: '/admin/disputes', icon: AlertTriangle },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out`}>
                <div className="p-6 flex items-center gap-3 text-white text-2xl font-black border-b border-slate-800 overflow-hidden">
                    <ShieldCheck className= "text-red-500 shrink-0" size={32}/>
                    {isSidebarOpen && <span className="tracking-tighter">KAZI <span className="text-red-500">ADMIN</span></span>}
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                isActive 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                                    : 'hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon size={22} className="shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin profile and logout */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    {isSidebarOpen && (
                        <div className="px-3 py-2 bg-slate-800/50 rounded-xl mb-2">
                            <p className="text-[10px] font-black uppercase text-slate-500">Super Admin</p>
                            <p className="text-xs text-white truncate">{user?.email}</p>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="p-4 border-t border-slate-800 flex items-center gap-3 hover:bg-red-900 hover:text-white transition-colors"
                    >
                        <LogOut size={22} className="shrink-0" /> 
                        {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* content area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-slate-500"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                            System Control Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative p-2 text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-800">Admin User</p>
                                <p className="text-[10px] text-green-500 font-bold uppercase">System Online</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-black">
                                A
                            </div>
                        </div>
                    </div>
                </header>
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">{children}</div>
                </div>
            </main>
        </div>
    );
}