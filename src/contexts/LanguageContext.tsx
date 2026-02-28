/**
 * Language Context
 *
 * Provides bilingual support (Bangla / English) for the entire application.
 *
 * Two translation APIs are exposed:
 *   1. `t(key)` — preferred, type-safe, uses centralized translation map.
 *   2. `tRaw(bn, en)` — legacy/inline, kept for backward compatibility during migration.
 *
 * Language preference is persisted in localStorage so it survives page reload.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  Language,
  TranslationKey,
  resolveTranslation,
} from '../i18n/translations';

const LANG_STORAGE_KEY = 'porichoy_lang';
const DEFAULT_LANG: Language = 'bn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  /**
   * Preferred API: translate by key with optional interpolations.
   * @example t('nav.dashboard')  →  "ড্যাশবোর্ড"
   * @example t('login.attempts.warning', { remaining: 3 })
   */
  t: (key: TranslationKey, interpolations?: Record<string, string | number>) => string;
  /**
   * Legacy API: directly provide both language strings.
   * Use during migration until all components use `t(key)`.
   * @example tRaw('ড্যাশবোর্ড', 'Dashboard')
   */
  tRaw: (bn: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'bn' || stored === 'en') return stored;
  } catch {
    // localStorage may be unavailable (private mode)
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next: Language = prev === 'bn' ? 'en' : 'bn';
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {/* ignore */}
      return next;
    });
  }, []);

  // Update <html lang> attribute for screen readers and SEO
  useEffect(() => {
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, interpolations?: Record<string, string | number>) =>
      resolveTranslation(language, key, interpolations),
    [language]
  );

  const tRaw = useCallback(
    (bn: string, en: string) => (language === 'bn' ? bn : en),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, tRaw }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language, TranslationKey };
