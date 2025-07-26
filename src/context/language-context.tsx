
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

interface LanguageContextType {
  selectedLang: string;
  handleLanguageChange: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    // On initial load, try to get the language from localStorage
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      if (parsedPrefs.lang) {
        setSelectedLang(parsedPrefs.lang);
      }
    }
  }, []);

  const setHtmlLang = useCallback((lang: string) => {
    const root = window.document.documentElement;
    root.lang = lang;
    if (lang === 'bn') {
      root.style.setProperty('--font-family-body', "'Noto Sans Bengali', sans-serif");
    } else {
      root.style.setProperty('--font-family-body', "'Lato', sans-serif");
    }
  }, []);
  
  useEffect(() => {
    setHtmlLang(selectedLang);
  }, [selectedLang, setHtmlLang]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    // Also update localStorage if preferences exist
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs);
        parsedPrefs.lang = lang;
        localStorage.setItem('userPreferences', JSON.stringify(parsedPrefs));
    }
  };

  return (
    <LanguageContext.Provider value={{ selectedLang, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
