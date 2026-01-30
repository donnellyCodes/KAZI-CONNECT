import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold text-blue-600">KAZI<span className="text-slate-800">CONNECT</span></div>
                <div className="space-x-6 flex items-center">
                    <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600">Login</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all">Join Now</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Connecting <span className="text-blue-600">Talent</span> with <br />
                    Local <span className="text-blue-600">Opportunities</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    A trusted marketplace for skilled workers and employers.
                    Secure payments, verified profiles, and instant matching.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Link to="/register" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800">
                        I want to Hire <ArrowRight size={20} />
                    </Link>
                    <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                        I want to Work <Briefcase size={20} />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    <div className="text-center p-6">
                        <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <ShieldCheck className="text-blue-600" size={32} /> 
                        </div>
                        <h3 className="text-xl font-bold mb-3">Secure Escrow</h3>
                        <p className="text-slate-600">Payments are held securely and only released when the job is done to your satisfaction.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Zap className="text-indigo-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Matching</h3>
                        <p className="text-slate-600">Our smart algorithm connects the right skills to the right jobs in seconds.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="text-emerald-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Verified Workers</h3>
                        <p className="text-slate-600">Every worker on our platform undergoes strict identity verification process.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white text-xl font-bold mb-4 md:mb-0">KAZI CONNECT</div>
                    <p>© 2025 Kazi Connect. All rights reserved.</p>
                    <div className="space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}