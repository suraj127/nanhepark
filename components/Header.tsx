'use client';

import React from 'react';
import { Building2, MapPin, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
  onOpenDirectory: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDirectory, onReset }) => {
  const { lang, setLang, speakText, stopSpeaking, isSpeaking } = useLanguage();

  const handleAudioGuide = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText("Welcome to Nanhey Park Civic Watch. Step 1: Upload photo. Step 2: Check location. Step 3: Click Generate Email button.");
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0 gap-2 sm:gap-0">
        {/* Brand with Official Logo Image */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onReset}>
          <div className="relative flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Nanhey Park Civic Watch Logo"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none gradient-text">
                Nanhey Park Civic Watch
              </h1>
              <span className="glass-badge text-sky-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                नागरिक सेवा
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>E Block, Matiala, New Delhi • Official Portal</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center space-x-2.5">
          {/* Audio Assistant */}
          <button
            type="button"
            onClick={handleAudioGuide}
            title="Listen Audio Assistance / आवाज सुनें"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse shadow-md'
                : 'glass-input hover:bg-white text-slate-700 hover:text-sky-700 shadow-2xs'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
            <span className="hidden md:inline">{isSpeaking ? 'Stop Audio' : '🔊 Listen / आवाज'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-200/60 p-1 rounded-xl border border-slate-300/60 backdrop-blur-md shadow-2xs">
            <button
              onClick={() => setLang('bilingual')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'bilingual' ? 'bg-white text-slate-900 shadow-xs scale-[1.02]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              दोनों (Dual)
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'hi' ? 'bg-white text-slate-900 shadow-xs scale-[1.02]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-white text-slate-900 shadow-xs scale-[1.02]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          {/* Official Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Directory / डायरेक्टरी</span>
          </button>
        </div>
      </div>
    </header>
  );
};
