import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all group"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <Globe className="w-4 h-4 text-[rgb(var(--color-primary))] group-hover:text-white transition-colors" />
      <span className="text-sm font-semibold text-[rgb(var(--color-primary))] group-hover:text-white transition-colors font-bangla">
        {language === 'bn' ? 'বাংলা' : 'English'}
      </span>
    </motion.button>
  );
}