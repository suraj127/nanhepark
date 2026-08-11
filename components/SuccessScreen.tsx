'use client';

import React from 'react';
import { CheckCircle, Mail, ExternalLink, RefreshCw, Building2, MapPin, Volume2, VolumeX, Download, Info, Paperclip } from 'lucide-react';
import { CombinedEmailPayload } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

interface SuccessScreenProps {
  payload: CombinedEmailPayload;
  dispatchId: string;
  gmailWebLink: string;
  onNewReport: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  payload,
  dispatchId,
  gmailWebLink,
  onNewReport
}) => {
  const { lang, speakText, stopSpeaking, isSpeaking } = useLanguage();

  const handleListenSuccess = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText("बधाई हो! आपकी शिकायत रिपोर्ट तैयार है। जीमेल खोलें बटन दबाएं। जीमेल में वाटरमार्क फोटो जोड़ने के लिए नीचे फोटो डाउनलोड करें दबाएं और जीमेल में अटैच पिन दबाकर जोड़ें।");
    }
  };

  const handleDownloadPhoto = (dataUrl: string, index: number) => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Civic_Evidence_Photo_${index + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {lang === 'hi' ? TRANSLATIONS.successTitle.hi : TRANSLATIONS.successTitle.en}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {lang === 'hi' ? TRANSLATIONS.successSub.hi : TRANSLATIONS.successSub.en}
          </p>
        </div>

        {/* Audio Assistance */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleListenSuccess}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-sky-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
            <span>{isSpeaking ? 'Stop Audio' : (lang === 'hi' ? '🔊 संदेश सुनें (हिंदी)' : '🔊 Listen Voice Message')}</span>
          </button>
        </div>

        {/* Quick Launch Link */}
        {gmailWebLink && (
          <div className="pt-2">
            <a
              href={gmailWebLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-md transition cursor-pointer hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5 text-sky-400" />
              <span>{lang === 'hi' ? TRANSLATIONS.openGmailBtn.hi : TRANSLATIONS.openGmailBtn.en}</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        )}

        {/* Photo Attachment Guidance Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left text-xs text-amber-900 space-y-1">
          <p className="font-extrabold flex items-center gap-1 text-amber-950">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lang === 'hi' ? 'जीमेल में फोटो कैसे अटैच करें:' : 'How to attach photos in Gmail:'}</span>
          </p>
          <p className="leading-relaxed text-amber-900 font-medium pl-5">
            {lang === 'hi'
              ? 'इंटरनेट सुरक्षा नियमों के कारण कोई भी वेबसाइट फोन की फोटो ईमेल में सीधे अपने आप नहीं डाल सकती। ऊपर बटन दबाकर जीमेल खोलें ➔ नीचे दिए "फोटो डाउनलोड करें" बटन दबाएं ➔ जीमेल में अटैच पिन (📎) दबाकर फोटो जोड़ें।'
              : 'Web browsers do not allow auto-attaching local files. Open Gmail above, click "Download Photo" below, then tap the attachment pin (📎) in Gmail to attach your photo.'}
          </p>
        </div>

        {/* Download Watermarked Photos Section */}
        {payload.watermarkedImages && payload.watermarkedImages.length > 0 && (
          <div className="pt-2 text-left space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800">
              <Paperclip className="w-4 h-4 text-sky-600" />
              <span>{lang === 'hi' ? 'जीमेल में अटैच करने हेतु वाटरमार्क फोटो:' : 'Watermarked Evidence Photos for Attachment:'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {payload.watermarkedImages.map((img, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2 text-center">
                  {img.dataUrl ? (
                    <img src={img.dataUrl} alt={img.caption} className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                  ) : (
                    <div className="w-full h-28 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-500 font-bold">
                      Photo #{idx + 1}
                    </div>
                  )}
                  {img.dataUrl && (
                    <button
                      type="button"
                      onClick={() => handleDownloadPhoto(img.dataUrl, idx)}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-900 border border-sky-200 text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lang === 'hi' ? `फोटो #${idx + 1} डाउनलोड करें` : `Download Photo #${idx + 1}`}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Audit Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              {lang === 'hi' ? TRANSLATIONS.addressedDeptsTitle.hi : TRANSLATIONS.addressedDeptsTitle.en}
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Ref: {dispatchId}
          </span>
        </div>

        {/* Location & Time */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1">
          <p className="text-slate-900 font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{payload.location.address}</span>
          </p>
          <p className="text-slate-500 font-mono text-[11px] pl-6">
            GPS: {payload.location.latitude}, {payload.location.longitude} • {payload.dateTimeFormatted}
          </p>
        </div>

        {/* Department / Issue Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-3">Department / विभाग</th>
                <th className="p-3">Issue / समस्या</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Action / कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payload.departmentMatrix.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-slate-900">{item.department}</td>
                  <td className="p-3 font-semibold text-slate-800 whitespace-pre-line">{item.issue}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 whitespace-pre-line leading-relaxed">{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recipient list */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
          <p className="text-slate-800 font-bold">
            Official Email Nodal Contacts ({payload.toEmails.length + payload.ccEmails.length}):
          </p>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {payload.toEmails.map((email, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold">
                TO: {email}
              </span>
            ))}
            {payload.ccEmails.map((email, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                CC: {email}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onNewReport}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center space-x-2 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span>{lang === 'hi' ? TRANSLATIONS.createAnotherBtn.hi : TRANSLATIONS.createAnotherBtn.en}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
