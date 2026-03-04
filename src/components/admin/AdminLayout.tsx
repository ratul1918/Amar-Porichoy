import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { 
  LayoutDashboard, Users, FileText, Settings, Bell, Shield, 
  BarChart3, Menu, X, Search, LogOut, ChevronDown, Globe,
  CheckCircle2, Clock, AlertTriangle, Briefcase, Lock, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminLayout() {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      labelBn: 'ড্যাশবোর্ড',
      labelEn: 'Dashboard'
    },
    {
      path: '/admin/applications',
      icon: FileText,
      labelBn: 'আবেদনসমূহ',
      labelEn: 'Applications'
    },
    {
      path: '/admin/citizens',
      icon: Users,
      labelBn: 'নাগরিক',
      labelEn: 'Citizens'
    },
    {
      path: '/admin/services',
      icon: Briefcase,
      labelBn: 'সেবা ব্যবস্থাপনা',
      labelEn: 'Services'
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      labelBn: 'বিশ্লেষণ',
      labelEn: 'Analytics'
    },
    {
      path: '/admin/security',
      icon: Shield,
      labelBn: 'নিরাপত্তা',
      labelEn: 'Security'
    },
    {
      path: '/admin/access',
      icon: Lock,
      labelBn: 'অ্যাক্সেস ব্যবস্থাপনা',
      labelEn: 'Access Management'
    },
    {
      path: '/admin/settings',
      icon: Settings,
      labelBn: 'সেটিংস',
      labelEn: 'Settings'
    }
  ];

  const notifications = [
    { type: 'pending', count: 45 },
    { type: 'alert', count: 3 }
  ];

  const totalNotifications = notifications.reduce((sum, n) => sum + n.count, 0);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))]">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 z-40 w-70 h-screen bg-[rgb(var(--color-sidebar-bg))] border-r border-[rgb(var(--color-sidebar-border))] lg:block"
          >
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-sidebar-border))]" >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-[rgb(var(--color-sidebar-text))] font-semibold ${language === 'bn' ? 'font-bangla' : ''}`}>
                    {t('পরিচয়', 'Porichoy')}
                  </h2>
                  <p className="text-xs text-[rgb(var(--color-sidebar-text-muted))]">
                    {t('অ্যাডমিন প্যানেল', 'Admin Panel')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[rgb(var(--color-sidebar-text-muted))] hover:text-[rgb(var(--color-sidebar-text))]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-[rgb(var(--color-sidebar-text-muted))] hover:bg-[rgb(var(--color-sidebar-hover))] hover:text-[rgb(var(--color-sidebar-text))]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className={language === 'bn' ? 'font-bangla' : ''}>
                      {t(item.labelBn, item.labelEn)}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* System Status */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgb(var(--color-sidebar-border))]" >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-sidebar-hover))]" >
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                <div className="flex-1">
                  <p className="text-xs text-[rgb(var(--color-sidebar-text-muted))]" >
                    {t('সিস্টেম স্ট্যাটাস', 'System Status')}
                  </p>
                  <p className="text-sm text-[rgb(var(--color-sidebar-text))] font-medium" >
                    {t('সচল', 'Operational')}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-70">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Menu + Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[rgb(var(--color-accent-light))]"
              >
                <Menu className="w-5 h-5 text-[rgb(var(--color-text))]" />
              </button>

              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-light))]" />
                  <input
                    type="text"
                    placeholder={t('অনুসন্ধান করুন...', 'Search...')}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${language === 'bn' ? 'font-bangla' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Right: Notifications + Language + Theme + Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-[rgb(var(--color-accent-light))]" >
                <Bell className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgb(var(--color-accent-light))]"
              >
                <Globe className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                <span className="text-sm font-medium text-[rgb(var(--color-text))]" >
                  {language === 'bn' ? 'EN' : 'বাং'}
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgb(var(--color-accent-light))]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-medium text-[rgb(var(--color-text))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                      {language === 'bn' ? user?.nameBn : user?.name}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-light))]" >
                      {t('অ্যাডমিন', 'Admin')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[rgb(var(--color-text-light))]" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-surface))] rounded-lg border border-[rgb(var(--color-border))] shadow-lg overflow-hidden"
                    >
                      <Link
                        to="/admin/settings"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-accent-light))] ${language === 'bn' ? 'font-bangla' : ''}`}
                      >
                        <Settings className="w-4 h-4" />
                        {t('সেটিংস', 'Settings')}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          window.location.href = '/login';
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgb(var(--color-accent-light))] text-red-600 border-t border-[rgb(var(--color-border))] ${language === 'bn' ? 'font-bangla' : ''}`}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('লগআউট', 'Logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
    </div>
  );
}