
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  selectedLang: string;
  handleLanguageChange: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    const root = window.document.documentElement;
    if (selectedLang === 'bn') {
      root.style.setProperty('--font-family-body', "'Noto Sans Bengali', sans-serif");
    } else {
      root.style.setProperty('--font-family-body', "'Lato', sans-serif");
    }
  }, [selectedLang]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
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
