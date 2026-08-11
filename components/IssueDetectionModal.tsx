'use client';

import React from 'react';
import { CheckCircle2, Loader2, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

interface IssueDetectionModalProps {
  isOpen: boolean;
  step: number; // 1: Watermarking, 2: Vision Analysis, 3: Dept Mapping, 4: Done
  statusMessage: string;
}

export const IssueDetectionModal: React.FC<IssueDetectionModalProps> = ({ isOpen, step }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  const stepsList = [
    {
      num: 1,
      titleEn: TRANSLATIONS.modalStep1Title.en,
      titleHi: TRANSLATIONS.modalStep1Title.hi,
      descEn: TRANSLATIONS.modalStep1Desc.en,
      descHi: TRANSLATIONS.modalStep1Desc.hi,
    },
    {
      num: 2,
      titleEn: TRANSLATIONS.modalStep2Title.en,
      titleHi: TRANSLATIONS.modalStep2Title.hi,
      descEn: TRANSLATIONS.modalStep2Desc.en,
      descHi: TRANSLATIONS.modalStep2Desc.hi,
    },
    {
      num: 3,
      titleEn: TRANSLATIONS.modalStep3Title.en,
      titleHi: TRANSLATIONS.modalStep3Title.hi,
      descEn: TRANSLATIONS.modalStep3Desc.en,
      descHi: TRANSLATIONS.modalStep3Desc.hi,
    },
    {
      num: 4,
      titleEn: TRANSLATIONS.modalStep4Title.en,
      titleHi: TRANSLATIONS.modalStep4Title.hi,
      descEn: TRANSLATIONS.modalStep4Desc.en,
      descHi: TRANSLATIONS.modalStep4Desc.hi,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200 border border-white/80">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Official Logo" className="h-16 w-auto object-contain mb-3 drop-shadow-md" />
          <Loader2 className="w-7 h-7 animate-spin text-sky-600 mb-1" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            {lang === 'hi'
              ? TRANSLATIONS.modalTitle.hi
              : lang === 'en'
              ? TRANSLATIONS.modalTitle.en
              : 'Preparing Email Report / ईमेल रिपोर्ट तैयार हो रही है'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {lang === 'hi' ? TRANSLATIONS.modalSubtitle.hi : TRANSLATIONS.modalSubtitle.en}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          {stepsList.map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex items-start space-x-3">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 text-[11px] font-bold text-slate-400 flex items-center justify-center">
                      {s.num}
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDone ? 'text-slate-900' : isCurrent ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                    {lang === 'hi' ? s.titleHi : lang === 'en' ? s.titleEn : `${s.titleEn} / ${s.titleHi}`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {lang === 'hi' ? s.descHi : s.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-semibold">
          <Shield className="w-4 h-4 text-sky-600" />
          <span>Nanhey Park Civic Watch • Official Dispatch</span>
        </div>
      </div>
    </div>
  );
};
