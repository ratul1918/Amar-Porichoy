import { Shield, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { LanguageToggle } from './LanguageToggle';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function Header() {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;

  const publicNavItems = [
    { path: '/about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About' },
    { path: '/how-it-works', labelBn: 'কীভাবে কাজ করে', labelEn: 'How It Works' },
    { path: '/faq', labelBn: 'সাধারণ জিজ্ঞাসা', labelEn: 'FAQ' },
  ];

  const loggedInNavItems = [
    { path: user?.role === 'admin' ? '/admin' : '/dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard' },
    { path: '/services', labelBn: 'সেবাসমূহ', labelEn: 'Services' },
    { path: '/tracking', labelBn: 'আবেদন ট্র্যাকিং', labelEn: 'Track Application' },
  ];

  const navItems = isLoggedIn ? loggedInNavItems : publicNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full m-0 p-0 bg-[rgb(var(--color-surface))]/95 backdrop-blur-md border-[rgb(var(--color-border))]" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 m-0 p-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[rgb(var(--color-text))] font-bangla">
                পরিচয়
              </span>
              <span className="text-[10px] text-[rgb(var(--color-text-light))] -mt-1">
                National Digital ID
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors font-bangla ${location.pathname === item.path
                  ? 'text-[rgb(var(--color-primary))]'
                  : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]'
                  }`}
              >
                {t(item.labelBn, item.labelEn)}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-sm transition-colors font-bangla text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]"
              >
                {t('লগআউট', 'Logout')}
              </button>
            )}
            <LanguageToggle />
            <ThemeSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg))] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors font-bangla ${location.pathname === item.path
                    ? 'bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-primary))]'
                    : 'hover:bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))]'
                    }`}
                >
                  {t(item.labelBn, item.labelEn)}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors font-bangla hover:bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))]"
                >
                  {t('লগআউট', 'Logout')}
                </button>
              )}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm transition-colors font-bangla bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))]"
                >
                  {t('লগইন / নিবন্ধন', 'Login / Register')}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bangladesh Flag Color Accent */}
      <div className="h-1 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-accent))] to-[rgb(var(--color-secondary))]"></div>
    </header>
  );
}