'use client';

import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowRight, Table, Paperclip, FileText, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { CombinedEmailPayload } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

interface EmailPreviewInspectorProps {
  payload: CombinedEmailPayload;
  onSendEmail: () => void;
  isSending: boolean;
  onBackToEdit: () => void;
}

export const EmailPreviewInspector: React.FC<EmailPreviewInspectorProps> = ({
  payload,
  onSendEmail,
  isSending,
  onBackToEdit
}) => {
  const { lang, speakText, stopSpeaking, isSpeaking } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'matrix'>('preview');

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(payload.bodyMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListenReport = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const issuesText = payload.detectedIssues
        .map((i) => `${i.issueNameHindi || i.issueName} (${payload.location.address})`)
        .join('. ');
      speakText(`आधिकारिक ईमेल शिकायत रिपोर्ट तैयार है। दर्ज समस्या: ${issuesText}। शिकायत अधिकारियों के पास भेजने के लिए ईमेल भेजें बटन दबाएं।`);
    }
  };

  return (
    <div className="glass-card rounded-3xl shadow-xl overflow-hidden space-y-0 backdrop-blur-xl border border-white/70">
      {/* Top Banner: Report Summary */}
      <div className="p-5 sm:p-6 border-b border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-500/10 via-slate-50/50 to-indigo-500/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="glass-badge px-3 py-1 rounded-full text-emerald-900 text-xs font-extrabold shadow-2xs">
              {lang === 'hi' ? TRANSLATIONS.draftBadge.hi : TRANSLATIONS.draftBadge.en}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {payload.departmentMatrix.length} {lang === 'hi' ? TRANSLATIONS.deptAddressed.hi : TRANSLATIONS.deptAddressed.en}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{payload.subject}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleListenReport}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse shadow-md'
                : 'glass-input hover:bg-white text-sky-800'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
            <span>{isSpeaking ? 'आवाज रोकें' : '🔊 आवाज सुनें (हिंदी)'}</span>
          </button>

          <button
            type="button"
            onClick={onBackToEdit}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/90 hover:bg-white text-slate-800 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'hi' ? TRANSLATIONS.editPhotos.hi : TRANSLATIONS.editPhotos.en}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyRaw}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/90 hover:bg-white text-slate-800 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>
              {copied
                ? (lang === 'hi' ? TRANSLATIONS.copiedText.hi : TRANSLATIONS.copiedText.en)
                : (lang === 'hi' ? TRANSLATIONS.copyText.hi : TRANSLATIONS.copyText.en)}
            </span>
          </button>
        </div>
      </div>

      {/* Recipient Routing */}
      <div className="p-5 border-b border-slate-200/70 bg-white/80 space-y-2 text-xs">
        <div className="flex items-start space-x-2">
          <span className="font-extrabold text-slate-600 w-12 shrink-0 pt-0.5">TO (प्राप्तकर्ता):</span>
          <div className="flex flex-wrap gap-1.5">
            {payload.toEmails.map((email, idx) => (
              <span key={idx} className="glass-badge text-sky-950 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold shadow-2xs">
                {email}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <span className="font-extrabold text-slate-600 w-12 shrink-0 pt-0.5">CC (प्रतिलिपि):</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
            {payload.ccEmails.map((email, idx) => (
              <span key={idx} className="bg-slate-100/80 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium">
                {email}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/70 bg-slate-100/50 px-4 pt-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'preview' ? 'border-sky-600 text-sky-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'hi' ? TRANSLATIONS.tabEmailContent.hi : TRANSLATIONS.tabEmailContent.en}</span>
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'matrix' ? 'border-sky-600 text-sky-900' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>
            {lang === 'hi' ? TRANSLATIONS.tabDeptMatrix.hi : TRANSLATIONS.tabDeptMatrix.en} ({payload.departmentMatrix.length})
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-slate-50/50 backdrop-blur-md">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Rendered Email Body */}
            <div
              className="bg-white/95 border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-800 text-xs sm:text-sm font-sans leading-relaxed space-y-4 shadow-sm"
              dangerouslySetInnerHTML={{ __html: payload.bodyHtml }}
            />

            {/* Attached Watermarked Photographs */}
            {payload.watermarkedImages && payload.watermarkedImages.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800">
                  <Paperclip className="w-4 h-4 text-sky-600" />
                  <span>
                    {lang === 'hi' ? TRANSLATIONS.evidenceAttached.hi : TRANSLATIONS.evidenceAttached.en} ({payload.watermarkedImages.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {payload.watermarkedImages.map((img, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-2.5 space-y-2 shadow-xs">
                      <img src={img.dataUrl} alt={img.caption} className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                      <p className="text-[11px] text-slate-700 font-bold truncate px-1">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800">
              {lang === 'hi' ? 'विभाग एवं कार्रवाई सूची' : 'Department & Action Matrix'}
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-extrabold">
                  <tr>
                    <th className="p-3">Department / विभाग</th>
                    <th className="p-3">Issue / समस्या</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Required Action / कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payload.departmentMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-extrabold text-slate-900">{row.department}</td>
                      <td className="p-3 font-bold text-slate-800 whitespace-pre-line">{row.issue}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-md font-extrabold text-[10px] ${
                            row.severity === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-pre-line leading-relaxed font-medium">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Send Email Action Footer */}
      <div className="p-6 bg-white/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <p className="font-extrabold text-slate-900 text-sm">
            {lang === 'hi' ? TRANSLATIONS.readyToSend.hi : TRANSLATIONS.readyToSend.en}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {lang === 'hi' ? TRANSLATIONS.readyToSendSub.hi : TRANSLATIONS.readyToSendSub.en}
          </p>
        </div>

        <button
          type="button"
          onClick={onSendEmail}
          disabled={isSending}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-btn-primary text-white font-extrabold text-sm sm:text-base shadow-lg flex items-center justify-center space-x-2 transition cursor-pointer hover:scale-[1.01]"
        >
          <Mail className="w-5 h-5 text-emerald-100" />
          <span>
            {isSending
              ? (lang === 'hi' ? TRANSLATIONS.sendingEmailBtn.hi : TRANSLATIONS.sendingEmailBtn.en)
              : (lang === 'hi' ? TRANSLATIONS.sendEmailBtn.hi : TRANSLATIONS.sendEmailBtn.en)}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
