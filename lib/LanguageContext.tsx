'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageMode } from './translations';

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'hi',
  setLang: () => {},
  speakText: () => {},
  stopSpeaking: () => {},
  isSpeaking: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageMode>('hi');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('civic_lang_mode') as LanguageMode;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: LanguageMode) => {
    setLangState(newLang);
    localStorage.setItem('civic_lang_mode', newLang);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('आपके ब्राउज़र में आवाज प्लेबैक उपलब्ध नहीं है।');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean html tags if present
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Audio instructions always in Hindi ('hi-IN')
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95; // Slightly clear and deliberate pacing for accessibility

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, speakText, stopSpeaking, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
