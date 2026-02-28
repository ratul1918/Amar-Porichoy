/**
 * Layout — Root page wrapper
 *
 * Accessibility improvements:
 * - Skip navigation link (WCAG 2.1 SC 2.4.1 — Bypass Blocks)
 * - main landmark with id="main-content" for skip link target
 * - SessionManager mounted here so it overlays any page
 *
 * Note: <Header> handles its own landmark (<header>).
 * This <main> provides the main content landmark for screen readers.
 */

import { Outlet } from 'react-router';
import { Header } from './Header';
import { SessionManager } from './SessionManager';
import { useLanguage } from '../contexts/LanguageContext';

export function Layout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>

      {/* Session timeout warning — mounted globally, shown when idle */}
      <SessionManager />
    </div>
  );
}
