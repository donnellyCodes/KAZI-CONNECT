import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Zap, Users, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
    return (
        <div className={clsx('min-h-screen', 'bg-white')}>
            {/* Navigation */}
            <nav className={clsx('flex', 'justify-between', 'items-center', 'p-6', 'max-w-7xl', 'mx-auto')}>
                <div className={clsx('flex', 'items-center', 'gap-2')}>
                    <div className={clsx('w-10', 'h-10', 'bg-blue-600', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                        <span className={clsx('text-white', 'font-bold', 'text-xl')}>K</span>
                    </div>
                    <div className={clsx('text-2xl', 'font-bold', 'text-gray-900')}>KAZI<span className="text-blue-600">CONNECT</span></div>
                </div>
                <div className={clsx('space-x-4', 'flex', 'items-center')}>
                    <Link to="/login" className={clsx('text-gray-600', 'font-medium', 'hover:text-blue-600', 'transition-colors')}>
                        Login
                    </Link>
                    <Link to="/register">
                        <button className={clsx('bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'font-medium', 'hover:bg-blue-700', 'transition-colors')}>
                            Join Now
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={clsx('max-w-7xl', 'mx-auto', 'px-6', 'py-20', 'text-center')}>            
                <h1 className={clsx('text-5xl', 'md:text-7xl', 'font-extrabold', 'text-gray-900', 'mb-6', 'tracking-tight')}>
                    Connecting <span className="text-blue-600">Talent</span> with{' '}
                    <br />
                    Local <span className="text-blue-600">Opportunities</span>
                </h1>
                
                <p className={clsx('text-xl', 'text-gray-600', 'max-w-2xl', 'mx-auto', 'mb-10')}>
                    A trusted marketplace for skilled workers and employers.
                    Secure payments, verified profiles, and instant matching.
                </p>
                
                <div className={clsx('flex', 'flex-col', 'md:flex-row', 'justify-center', 'gap-4', 'mb-16')}>
                    <Link to="/register?role=employer" className={clsx('w-full', 'md:w-auto')}>
                        <button className={clsx('w-full', 'md:w-auto', 'bg-gray-900', 'text-white', 'px-8', 'py-4', 'rounded-xl', 'font-bold', 'text-lg', 'flex', 'items-center', 'justify-center', 'gap-2', 'hover:bg-gray-800', 'transition-colors')}>
                            I want to Hire
                            <ArrowRight size={24} />
                        </button>
                    </Link>
                    <Link to="/register?role=worker" className={clsx('w-full', 'md:w-auto')}>
                        <button className={clsx('w-full', 'md:w-auto', 'bg-blue-600', 'text-white', 'px-8', 'py-4', 'rounded-xl', 'font-bold', 'text-lg', 'flex', 'items-center', 'justify-center', 'gap-2', 'hover:bg-blue-700', 'transition-colors')}>
                            I want to Work
                            <Briefcase size={24} />
                        </button>
                    </Link>
                </div>

                {/* Trust Indicators */}
                <div className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8', 'max-w-4xl', 'mx-auto')}>
                    <div className={clsx('flex', 'items-center', 'justify-center', 'gap-3')}>
                        <CheckCircle className="text-green-500" size={24} />
                        <div className="text-left">
                            <p className={clsx('font-bold', 'text-lg')}>95%</p>
                            <p className={clsx('text-sm', 'text-gray-600')}>Success Rate</p>
                        </div>
                    </div>
                    <div className={clsx('flex', 'items-center', 'justify-center', 'gap-3')}>
                        <Users className="text-blue-500" size={24} />
                        <div className="text-left">
                            <p className={clsx('font-bold', 'text-lg')}>10K+</p>
                            <p className={clsx('text-sm', 'text-gray-600')}>Active Users</p>
                        </div>
                    </div>
                    <div className={clsx('flex', 'items-center', 'justify-center', 'gap-3')}>
                        <TrendingUp className="text-purple-500" size={24} />
                        <div className="text-left">
                            <p className={clsx('font-bold', 'text-lg')}>24h</p>
                            <p className={clsx('text-sm', 'text-gray-600')}>Avg. Match Time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={clsx('bg-gray-50', 'py-20', 'px-6')}>
                <div className={clsx('max-w-7xl', 'mx-auto')}>
                    <div className={clsx('text-center', 'mb-16')}>
                        <div className={clsx('inline-block', 'bg-gray-100', 'text-gray-700', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium', 'mb-4')}>Features</div>
                        <h2 className={clsx('text-4xl', 'font-bold', 'text-gray-900', 'mb-4')}>
                            Why Choose Kazi Connect?
                        </h2>
                        <p className={clsx('text-xl', 'text-gray-600', 'max-w-2xl', 'mx-auto')}>
                            We've built everything you need to find the perfect match or get hired quickly.
                        </p>
                    </div>
                    
                    <div className={clsx('grid', 'md:grid-cols-3', 'gap-8')}>
                        <div className={clsx('bg-white', 'p-8', 'rounded-2xl', 'text-center', 'hover:shadow-lg', 'transition-all', 'duration-300')}>
                            <div className="space-y-4">
                                <div className={clsx('bg-blue-100', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto')}>
                                    <ShieldCheck className="text-blue-600" size={32} />
                                </div>
                                <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>Secure Escrow</h3>
                                <p className="text-gray-600">
                                    Payments are held securely and only released when the job is done to your satisfaction.
                                </p>
                                <div className={clsx('flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'text-gray-500')}>
                                    <CheckCircle size={16} className="text-green-500" />
                                    Bank-level security
                                </div>
                            </div>
                        </div>

                        <div className={clsx('bg-white', 'p-8', 'rounded-2xl', 'text-center', 'hover:shadow-lg', 'transition-all', 'duration-300')}>
                            <div className="space-y-4">
                                <div className={clsx('bg-purple-100', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto')}>
                                    <Zap className="text-purple-600" size={32} />
                                </div>
                                <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>AI Matching</h3>
                                <p className="text-gray-600">
                                    Our smart algorithm connects the right skills to the right jobs in seconds.
                                </p>
                                <div className={clsx('flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'text-gray-500')}>
                                    <TrendingUp size={16} className="text-purple-500" />
                                    95% accuracy rate
                                </div>
                            </div>
                        </div>

                        <div className={clsx('bg-white', 'p-8', 'rounded-2xl', 'text-center', 'hover:shadow-lg', 'transition-all', 'duration-300')}>
                            <div className="space-y-4">
                                <div className={clsx('bg-green-100', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto')}>
                                    <Users className="text-green-600" size={32} />
                                </div>
                                <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>Verified Workers</h3>
                                <p className="text-gray-600">
                                    Every worker on our platform undergoes strict identity verification process.
                                </p>
                                <div className={clsx('flex', 'items-center', 'justify-center', 'gap-2', 'text-sm', 'text-gray-500')}>
                                    <ShieldCheck size={16} className="text-green-500" />
                                    100% verified profiles
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={clsx('py-20', 'px-6')}>
                <div className={clsx('max-w-7xl', 'mx-auto')}>
                    <div className={clsx('text-center', 'mb-16')}>
                        <div className={clsx('inline-block', 'bg-gray-100', 'text-gray-700', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium', 'mb-4')}>How It Works</div>
                        <h2 className={clsx('text-4xl', 'font-bold', 'text-gray-900', 'mb-4')}>
                            Get Started in 3 Simple Steps
                        </h2>
                    </div>
                    
                    <div className={clsx('grid', 'md:grid-cols-3', 'gap-8')}>
                        <div className={clsx('text-center', 'space-y-4')}>
                            <div className={clsx('w-12', 'h-12', 'bg-blue-600', 'text-white', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'font-bold', 'text-lg')}>
                                1
                            </div>
                            <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>Create Account</h3>
                            <p className="text-gray-600">
                                Sign up as a worker or employer in minutes. Verify your profile to get started.
                            </p>
                        </div>
                        
                        <div className={clsx('text-center', 'space-y-4')}>
                            <div className={clsx('w-12', 'h-12', 'bg-blue-600', 'text-white', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'font-bold', 'text-lg')}>
                                2
                            </div>
                            <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>Post or Find Jobs</h3>
                            <p className="text-gray-600">
                                Post your requirements or browse through available opportunities that match your skills.
                            </p>
                        </div>
                        
                        <div className={clsx('text-center', 'space-y-4')}>
                            <div className={clsx('w-12', 'h-12', 'bg-blue-600', 'text-white', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mx-auto', 'font-bold', 'text-lg')}>
                                3
                            </div>
                            <h3 className={clsx('text-xl', 'font-bold', 'text-gray-900')}>Connect & Work</h3>
                            <p className="text-gray-600">
                                Connect with the right match, complete the work, and get paid securely through escrow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={clsx('bg-linear-to-r', 'from-blue-600', 'to-purple-600', 'py-20', 'px-6', 'text-white')}>
                <div className={clsx('max-w-7xl', 'mx-auto', 'text-center')}>
                    <h2 className={clsx('text-3xl', 'font-bold', 'mb-12')}>Join Thousands of Satisfied Users</h2>
                    <div className={clsx('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-8')}>
                        <div>
                            <p className={clsx('text-4xl', 'font-bold', 'mb-2')}>10K+</p>
                            <p className="text-blue-100">Active Users</p>
                        </div>
                        <div>
                            <p className={clsx('text-4xl', 'font-bold', 'mb-2')}>5K+</p>
                            <p className="text-blue-100">Jobs Completed</p>
                        </div>
                        <div>
                            <p className={clsx('text-4xl', 'font-bold', 'mb-2')}>KES 2M+</p>
                            <p className="text-blue-100">Transactions</p>
                        </div>
                        <div>
                            <p className={clsx('text-4xl', 'font-bold', 'mb-2')}>98%</p>
                            <p className="text-blue-100">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={clsx('py-20', 'px-6', 'bg-gray-50')}>
                <div className={clsx('max-w-4xl', 'mx-auto', 'text-center')}>
                    <div className={clsx('inline-block', 'bg-gray-100', 'text-gray-700', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium', 'mb-4')}>Ready to Start?</div>
                    <h2 className={clsx('text-4xl', 'font-bold', 'text-gray-900', 'mb-4')}>
                        Join Kazi Connect Today
                    </h2>
                    <p className={clsx('text-xl', 'text-gray-600', 'mb-8')}>
                        Whether you're looking for work or need to hire, we've got you covered.
                    </p>
                    <div className={clsx('flex', 'flex-col', 'md:flex-row', 'justify-center', 'gap-4')}>
                        <Link to="/register">
                            <button className={clsx('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'font-medium', 'hover:bg-blue-700', 'transition-colors', 'flex', 'items-center', 'gap-2')}>
                                Get Started Now
                                <ArrowRight size={20} />
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className={clsx('border', 'border-gray-300', 'text-gray-700', 'px-6', 'py-3', 'rounded-lg', 'font-medium', 'hover:bg-gray-50', 'transition-colors')}>
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={clsx('bg-gray-900', 'text-gray-400', 'py-12', 'px-6')}>
                <div className={clsx('max-w-7xl', 'mx-auto', 'flex', 'flex-col', 'md:flex-row', 'justify-between', 'items-center')}>
                    <div className={clsx('flex', 'items-center', 'gap-2', 'text-white', 'text-xl', 'font-bold', 'mb-4', 'md:mb-0')}>
                        <div className={clsx('w-8', 'h-8', 'bg-blue-600', 'rounded-lg', 'flex', 'items-center', 'justify-center')}>
                            <span className={clsx('text-white', 'font-bold')}>K</span>
                        </div>
                        KAZI CONNECT
                    </div>
                    <p> 2025 Kazi Connect. All rights reserved.</p>
                    <div className={clsx('space-x-6', 'mt-4', 'md:mt-0')}>
                        <a href="#" className={clsx('hover:text-white', 'transition-colors')}>Terms</a>
                        <a href="#" className={clsx('hover:text-white', 'transition-colors')}>Privacy</a>
                        <a href="#" className={clsx('hover:text-white', 'transition-colors')}>Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}