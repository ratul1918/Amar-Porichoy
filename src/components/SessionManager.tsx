/**
 * SessionManager — Inactivity timeout warning dialog.
 *
 * When a user is 13 minutes idle (2 minutes before the 15-minute cutoff),
 * this component renders a modal warning with options to:
 *   1. Extend session (resets the inactivity clock)
 *   2. Log out immediately
 *
 * WCAG 2.1 SC 2.2.1 — Timing Adjustable: users can extend the session.
 * WCAG 2.1 SC 2.2.6 — Timeouts: users are warned before session expires.
 */

import React, { useState, useCallback } from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSessionGuard } from '../hooks/useSessionGuard';
import { startSessionClock } from '../lib/security';

export function SessionManager(): React.ReactElement | null {
  const { isAuthenticated, logout } = useAuth();
  const { t }  = useLanguage();
  const [showWarning, setShowWarning] = useState(false);

  const handleExpire = useCallback(async () => {
    setShowWarning(false);
    await logout();
  }, [logout]);

  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, []);

  const handleActive = useCallback(() => {
    setShowWarning(false);
  }, []);

  const handleExtend = useCallback(() => {
    startSessionClock();
    setShowWarning(false);
  }, []);

  useSessionGuard({
    isAuthenticated,
    onExpire: handleExpire,
    onWarning: handleWarning,
    onActive: handleActive,
  });

  return (
    <AnimatePresence>
      {showWarning && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-warning-title"
            aria-describedby="session-warning-desc"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-amber-500" aria-hidden="true" />
              </div>

              {/* Text */}
              <h2
                id="session-warning-title"
                className="text-xl font-semibold text-gray-900 text-center mb-3"
              >
                {t('session.expiring.title')}
              </h2>
              <p
                id="session-warning-desc"
                className="text-gray-500 text-sm text-center mb-8"
              >
                {t('session.expiring.desc')}
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleExtend}
                  autoFocus
                  className="w-full py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-primary))]"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  {t('session.expiring.extend')}
                </button>
                <button
                  onClick={handleExpire}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  {t('session.expiring.logout')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
