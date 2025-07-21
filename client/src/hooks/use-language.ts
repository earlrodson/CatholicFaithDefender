import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'english' | 'cebuano' | 'tagalog';

export const languageNames: Record<Language, string> = {
  english: 'English',
  cebuano: 'Cebuano',
  tagalog: 'Tagalog'
};

export const languageFlags: Record<Language, string> = {
  english: '🇺🇸',
  cebuano: '🇵🇭',
  tagalog: '🇵🇭'
};

const LANGUAGE_STORAGE_KEY = 'catholic-app-language';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved as Language) || 'english';
  });

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages: Object.keys(languageNames) as Language[]
  };
}

// Language Context
export const LanguageContext = createContext<{
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
  availableLanguages: Language[];
}>({
  currentLanguage: 'english',
  changeLanguage: () => {},
  availableLanguages: ['english', 'cebuano', 'tagalog']
});

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within LanguageProvider');
  }
  return context;
};