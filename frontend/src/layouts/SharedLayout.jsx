import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui';

const roleConfig = {
  admin: {
    color: 'admin',
    bgColor: 'bg-red-900',
    borderColor: 'border-red-800',
    hoverColor: 'hover:bg-red-800',
    logoText: 'ADMIN',
    logoColor: 'text-red-500',
    headerTitle: 'System Control Dashboard',
    userBadge: 'Super Admin',
    userStatus: 'System Online',
    statusColor: 'text-green-500',
  },
  worker: {
    color: 'worker',
    bgColor: 'bg-blue-900',
    borderColor: 'border-blue-800',
    hoverColor: 'hover:bg-blue-800',
    logoText: 'Worker',
    logoColor: 'text-blue-400',
    headerTitle: 'Worker Dashboard',
    userBadge: 'Worker Account',
    userStatus: 'Active',
    statusColor: 'text-green-500',
  },
  employer: {
    color: 'employer',
    bgColor: 'bg-green-900',
    borderColor: 'border-green-800',
    hoverColor: 'hover:bg-green-800',
    logoText: 'Employer',
    logoColor: 'text-green-400',
    headerTitle: 'Employer Panel',
    userBadge: 'Verified Hiring Entity',
    userStatus: 'Active',
    statusColor: 'text-green-500',
  },
};

export default function SharedLayout({ children, navigation, role }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const config = roleConfig[role] || roleConfig.worker;

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Close mobile sidebar when switching to desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile Menu Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="mobile-menu-overlay active"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'sidebar-mobile' : ''}
        ${isSidebarOpen || !isMobile ? 'open' : ''}
        ${!isMobile ? (isSidebarOpen ? 'w-64' : 'w-20') : ''}
        ${config.bgColor} text-white flex flex-col transition-all duration-300 ease-in-out z-50
      `}>
        {/* Logo */}
        <div className={`p-6 flex items-center gap-3 text-white text-2xl font-black ${config.borderColor} border-b overflow-hidden`}>
          <div className={`w-8 h-8 ${config.logoColor} bg-white rounded-lg flex items-center justify-center font-bold text-lg shrink-0`}>
            K
          </div>
          {(!isMobile && isSidebarOpen) && (
            <span className="tracking-tighter">
              KAZI <span className={config.logoColor}>{config.logoText}</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavigation}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? `${role === 'admin' ? 'bg-red-600' : role === 'worker' ? 'bg-blue-600' : 'bg-green-600'} text-white shadow-lg` 
                    : `${config.hoverColor} hover:text-white`
                } ${(!isMobile && !isSidebarOpen) ? 'justify-center' : ''}`}
              >
                <item.icon size={22} className="shrink-0" />
                {(!isMobile && isSidebarOpen) && (
                  <>
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 ${config.borderColor} border-t space-y-2`}>
          {(!isMobile && isSidebarOpen) && (
            <div className="px-3 py-2 bg-white/10 rounded-xl mb-2">
              <p className="text-[10px] font-black uppercase text-gray-300">{config.userBadge}</p>
              <p className="text-xs text-white truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
            className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all hover:bg-red-900 hover:text-white ${
              (!isMobile && isSidebarOpen) ? 'justify-start' : 'justify-center'
            }`}
          >
            <LogOut size={22} className="shrink-0" />
            {(!isMobile && isSidebarOpen) && (
              <span className="font-medium text-sm">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors tap-target-large"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            {/* Desktop Sidebar Toggle */}
            {!isMobile && (
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            <h1 className="text-sm font-black text-gray-400 uppercase tracking-widest hidden md:block">
              {config.headerTitle}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative p-2 text-gray-400 hover:text-red-500 cursor-pointer transition-colors tap-target-large">
              <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white absolute top-1 right-1"></div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-800 capitalize">{role} User</p>
                <p className={`text-[10px] ${config.statusColor} font-bold uppercase`}>
                  {config.userStatus}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
