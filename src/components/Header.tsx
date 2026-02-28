import { Shield, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';

type NavItem = { path: string; labelKey: string };

const PUBLIC_NAV: NavItem[] = [
  { path: '/portals',      labelKey: 'nav.portals' },
  { path: '/about',        labelKey: 'nav.about' },
  { path: '/how-it-works', labelKey: 'nav.howItWorks' },
  { path: '/faq',          labelKey: 'nav.faq' },
];

const PRIVATE_NAV: NavItem[] = [
  { path: '/dashboard', labelKey: 'nav.dashboard' },
  { path: '/services',  labelKey: 'nav.services' },
  { path: '/portals',   labelKey: 'nav.portals' },
  { path: '/tracking',  labelKey: 'nav.tracking' },
];

export function Header() {
  const { t, tRaw, language } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAuthenticated ? PRIVATE_NAV : PUBLIC_NAV;
  const mobileNavId = 'mobile-menu';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[rgb(var(--color-border))]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Bangladesh flag accent stripe */}
      <div
        className="h-1 bg-linear-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-accent))] to-[rgb(var(--color-secondary))]"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            aria-label={tRaw('পরিচয় হোমপেজ', 'Porichoy Homepage')}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 rounded-xl bg-linear-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] flex items-center justify-center group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[rgb(var(--color-primary))] font-bangla">পরিচয়</span>
              <span className="text-[10px] text-[rgb(var(--color-text-light))] -mt-1">National Digital ID</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label={tRaw('প্রধান নেভিগেশন', 'Main navigation')}
            className="hidden md:flex items-center gap-6"
          >
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isCurrentPage(item.path) ? 'page' : undefined}
                className={`text-sm transition-colors ${language === 'bn' ? 'font-bangla' : ''} ${
                  isCurrentPage(item.path)
                    ? 'text-[rgb(var(--color-primary))] font-medium'
                    : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => void logout()}
                className={`text-sm transition-colors hover:text-[rgb(var(--color-primary))] text-[rgb(var(--color-text-secondary))] focus:outline-none focus:underline ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t('nav.logout')}
              </button>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg bg-[rgb(var(--color-primary))] text-white text-sm hover:bg-[rgb(var(--color-primary-hover))] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))] ${language === 'bn' ? 'font-bangla' : ''}`}
              >
                {t('nav.login')}
              </Link>
            )}
            <LanguageToggle />
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileNavId}
              aria-label={mobileMenuOpen
                ? tRaw('মেনু বন্ধ করুন', 'Close menu')
                : tRaw('মেনু খুলুন', 'Open menu')}
              className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg))] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id={mobileNavId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[rgb(var(--color-border))] bg-white overflow-hidden"
          >
            <nav
              aria-label={tRaw('মোবাইল নেভিগেশন', 'Mobile navigation')}
              className="px-4 py-3 space-y-2"
            >
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isCurrentPage(item.path) ? 'page' : undefined}
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors ${language === 'bn' ? 'font-bangla' : ''} ${
                    isCurrentPage(item.path)
                      ? 'bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-primary))] font-medium'
                      : 'hover:bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))]'
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => void logout()}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors hover:bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-secondary))] focus:outline-none ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] ${language === 'bn' ? 'font-bangla' : ''}`}
                >
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
