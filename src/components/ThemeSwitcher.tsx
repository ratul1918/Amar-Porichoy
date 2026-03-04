import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'light' as const,
      icon: Sun,
      labelBn: 'হালকা',
      labelEn: 'Light',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'dark' as const,
      icon: Moon,
      labelBn: 'গাঢ়',
      labelEn: 'Dark',
      color: 'from-slate-700 to-slate-900'
    },
    {
      id: 'modern' as const,
      icon: Palette,
      labelBn: 'আধুনিক',
      labelEn: 'Modern',
      color: 'from-indigo-500 to-pink-500'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgb(var(--color-accent-light))] transition-colors"
        aria-label={t('থিম পরিবর্তন করুন', 'Change theme')}
      >
        <currentTheme.icon className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
        <span className={`hidden sm:inline text-sm font-medium text-[rgb(var(--color-text))] ${language === 'bn' ? 'font-bangla' : ''}`}>
          {t(currentTheme.labelBn, currentTheme.labelEn)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-surface))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden z-50"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <div className={`px-3 py-2 border-b border-[rgb(var(--color-border))] ${language === 'bn' ? 'font-bangla' : ''}`}>
                <p className="text-xs font-medium text-[rgb(var(--color-text-light))]">
                  {t('থিম নির্বাচন করুন', 'Select Theme')}
                </p>
              </div>
              <div className="p-2">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isActive = theme === themeOption.id;
                  
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        setTheme(themeOption.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-primary))]'
                          : 'hover:bg-[rgb(var(--color-accent-light))] text-[rgb(var(--color-text))]'
                      } ${language === 'bn' ? 'font-bangla' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeOption.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">
                        {t(themeOption.labelBn, themeOption.labelEn)}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 rounded-full bg-[rgb(var(--color-primary))]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
