/**
 * useSessionGuard — Inactivity + absolute session timeout
 *
 * Government requirement: sessions must expire after 15 minutes of inactivity.
 * Absolute maximum session length: 8 hours.
 *
 * Emits 'session:warning' event 2 minutes before expiry.
 * Call logout() from AuthContext in the warning handler.
 */

import { useEffect, useRef, useCallback } from 'react';
import { resetInactivityTimer, isAbsoluteSessionExpired } from '../lib/security';

const INACTIVITY_MS     = 15 * 60 * 1000;  // 15 minutes
const WARNING_BEFORE_MS =  2 * 60 * 1000;  // show warning 2 mins before
const CHECK_INTERVAL_MS =     30 * 1000;   // check every 30 seconds

interface UseSessionGuardOptions {
  isAuthenticated: boolean;
  onExpire: () => void;
  onWarning: () => void;
  onActive: () => void;
}

export function useSessionGuard({
  isAuthenticated,
  onExpire,
  onWarning,
  onActive,
}: UseSessionGuardOptions): void {
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current  = false;
    onActive();
    if (isAuthenticated) resetInactivityTimer(onExpire);
  }, [isAuthenticated, onExpire, onActive]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Attach activity listeners
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

    // Periodic check for inactivity & absolute session
    intervalRef.current = setInterval(() => {
      const idle = Date.now() - lastActivityRef.current;

      if (isAbsoluteSessionExpired()) {
        onExpire();
        return;
      }

      if (idle >= INACTIVITY_MS) {
        onExpire();
        return;
      }

      if (idle >= INACTIVITY_MS - WARNING_BEFORE_MS && !warningShownRef.current) {
        warningShownRef.current = true;
        onWarning();
      }
    }, CHECK_INTERVAL_MS);

    resetInactivityTimer(onExpire);

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, handleActivity, onExpire, onWarning]);
}
