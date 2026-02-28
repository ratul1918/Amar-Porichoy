import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { Shield, Menu, X, LogOut, Settings, Users, FileText, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function AdminLayout(): React.ReactElement {
  const { t, language } = useLanguage();
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: Shield, labelKey: 'admin.dashboard' },
    { path: '/admin/users', icon: Users, labelKey: 'admin.users' },
    { path: '/admin/applications', icon: FileText, labelKey: 'admin.applications' },
    { path: '/admin/audit', icon: Clock, labelKey: 'admin.audit' },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
  }, [sidebarOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const isCurrentPage = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    // Navigation handled by auth state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-[rgb(var(--color-primary))]">Porichoy Admin</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span>{user?.nameEn || 'Administrator'}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <>
              {/* Mobile overlay */}
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
              )}

              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-64 bg-white border-r border-gray-200 overflow-y-auto lg:translate-x-0 absolute lg:relative lg:z-0 z-40 h-full"
              >
                <nav className="p-4 space-y-2">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isCurrentPage(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          active
                            ? 'bg-[rgb(var(--color-primary))] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.labelKey}
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
