'use client';

import React, { useState } from 'react';
import { X, Building2, Search, ShieldCheck } from 'lucide-react';
import { OFFICIAL_DEPARTMENT_DIRECTORY, COMMON_ESCALATION_CONTACTS } from '@/lib/directory';
import { useLanguage } from '@/lib/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const departments = Object.values(OFFICIAL_DEPARTMENT_DIRECTORY);

  const filteredDepts = departments.filter(
    (d) =>
      d.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.primaryEmails.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.grievanceEmails.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === 'hi' ? TRANSLATIONS.directoryTitle.hi : TRANSLATIONS.directoryTitle.en}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? TRANSLATIONS.directorySub.hi : TRANSLATIONS.directorySub.en}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? TRANSLATIONS.searchPlaceholder.hi : TRANSLATIONS.searchPlaceholder.en}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Directory List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/30">
          {/* Escalation Contacts */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>{lang === 'hi' ? TRANSLATIONS.escalationTitle.hi : TRANSLATIONS.escalationTitle.en}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {COMMON_ESCALATION_CONTACTS.map((esc, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">{esc.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{esc.designation}</p>
                  <p className="font-mono text-[11px] text-sky-700 font-bold mt-1">{esc.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Department Directory List */}
          <div className="space-y-3">
            {filteredDepts.map((dept) => (
              <div key={dept.departmentCode} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900">{dept.departmentName}</span>
                  <span className="bg-slate-100 text-slate-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md">
                    {dept.departmentCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      {lang === 'hi' ? TRANSLATIONS.primaryEmails.hi : TRANSLATIONS.primaryEmails.en}
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {dept.primaryEmails.map((e, idx) => (
                        <div key={idx} className="bg-slate-50 px-2.5 py-1 rounded-md text-slate-900 border border-slate-200 font-semibold">
                          {e}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      {lang === 'hi' ? TRANSLATIONS.grievanceEmails.hi : TRANSLATIONS.grievanceEmails.en}
                    </span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {dept.grievanceEmails.map((e, idx) => (
                        <div key={idx} className="bg-slate-50 px-2.5 py-1 rounded-md text-slate-700 border border-slate-200">
                          {e}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 font-medium">
                  Officer Roles: {dept.officerTitles.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
