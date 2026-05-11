import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex bg-black/40 border border-white/10 rounded-full p-1 relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <button
        onClick={() => toggleLanguage('en')}
        className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors ${i18n.language === 'en' ? 'text-background' : 'text-gray-400 hover:text-white'}`}
      >
        EN
        {i18n.language === 'en' && (
          <motion.div
            layoutId="lang-active"
            className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => toggleLanguage('id')}
        className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors ${i18n.language === 'id' ? 'text-background' : 'text-gray-400 hover:text-white'}`}
      >
        ID
        {i18n.language === 'id' && (
          <motion.div
            layoutId="lang-active"
            className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
