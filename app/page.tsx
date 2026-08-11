'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { IssueDetectionModal } from '@/components/IssueDetectionModal';
import { EmailPreviewInspector } from '@/components/EmailPreviewInspector';
import { SuccessScreen } from '@/components/SuccessScreen';
import { DirectoryModal } from '@/components/DirectoryModal';
import { CombinedEmailPayload, LocationData } from '@/lib/types';
import { applyWatermarkToImage } from '@/lib/watermark';
import { formatErrorMessage } from '@/lib/error-utils';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { lang } = useLanguage();

  // Application State
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationData>({
    address: 'E Block, Nanhey Park, Matiala, New Delhi',
    latitude: 28.6083,
    longitude: 77.0425,
    area: 'Nanhey Park, Matiala',
    city: 'New Delhi'
  });
  const [userNote, setUserNote] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionStep, setDetectionStep] = useState(1);
  const [payload, setPayload] = useState<CombinedEmailPayload | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ dispatchId: string; gmailWebLink: string } | null>(null);

  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit & Run Multi-Issue Analysis
  const handleAnalyzeAndGenerateEmail = async () => {
    if (selectedImages.length === 0) return;

    setErrorMessage(null);
    setIsProcessing(true);
    setDetectionStep(1); // Watermarking

    try {
      // Step 1: Watermarking images
      const now = new Date();
      const istDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
      const istTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
      const istDateTimeStr = `${istDate}, ${istTime} IST`;

      const watermarkedList: string[] = [];
      for (const img of selectedImages) {
        try {
          const wm = await applyWatermarkToImage(
            img,
            location.address,
            `${location.latitude}, ${location.longitude}`,
            istDateTimeStr
          );
          watermarkedList.push(wm);
        } catch {
          watermarkedList.push(img);
        }
      }

      // Step 2: Call Gemini Vision API / Smart Rules
      setDetectionStep(2);
      const res = await fetch('/api/detect-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: watermarkedList,
          location,
          userNote
        })
      });

      setDetectionStep(3); // Dept mapping & deduplication
      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));

      if (!res.ok || !data.payload) {
        throw new Error(formatErrorMessage(data.error, 'Failed to generate email report.'));
      }

      setDetectionStep(4); // Payload generated
      setTimeout(() => {
        setPayload(data.payload);
        setIsProcessing(false);
      }, 400);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(formatErrorMessage(err, 'An error occurred while compiling your report. Please try again.'));
      setIsProcessing(false);
    }
  };

  // Dispatch Email
  const handleSendEmail = async () => {
    if (!payload) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
      });

      const data = await res.json().catch(() => ({ error: 'Failed to parse response' }));
      if (!res.ok) {
        throw new Error(formatErrorMessage(data.error, 'Failed to send email.'));
      }

      setDispatchResult({
        dispatchId: data.dispatchId || `DISPATCH-${Date.now().toString().slice(-6)}`,
        gmailWebLink: data.links?.gmailWebLink || ''
      });
      setIsSending(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Dispatch error:', err);
      setErrorMessage(formatErrorMessage(err, 'Error sending official email.'));
      setIsSending(false);
    }
  };

  // Reset to new report
  const handleReset = () => {
    setSelectedImages([]);
    setPayload(null);
    setIsSuccess(false);
    setDispatchResult(null);
    setErrorMessage(null);
    setUserNote('');
  };

  return (
    <div className="min-h-screen vibrant-bg text-slate-900 flex flex-col font-sans selection:bg-sky-600 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Glass Header */}
      <Header onOpenDirectory={() => setIsDirectoryOpen(true)} onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="glass-card bg-rose-50/90 border-rose-200 text-rose-800 p-4 sm:p-5 rounded-3xl text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="font-bold underline text-rose-950 cursor-pointer hover:opacity-80">
              {lang === 'hi' ? 'हटाएं' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Main View Switcher */}
        {isSuccess && payload && dispatchResult ? (
          <SuccessScreen
            payload={payload}
            dispatchId={dispatchResult.dispatchId}
            gmailWebLink={dispatchResult.gmailWebLink}
            onNewReport={handleReset}
          />
        ) : payload ? (
          <EmailPreviewInspector
            payload={payload}
            onSendEmail={handleSendEmail}
            isSending={isSending}
            onBackToEdit={() => setPayload(null)}
          />
        ) : (
          <ImageUploader
            selectedImages={selectedImages}
            onImagesChange={setSelectedImages}
            location={location}
            onLocationChange={setLocation}
            userNote={userNote}
            onUserNoteChange={setUserNote}
            onSubmitReport={handleAnalyzeAndGenerateEmail}
            isProcessing={isProcessing}
          />
        )}
      </main>

      {/* Glass Footer */}
      <footer className="glass-header py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>Nanhey Park Civic Watch • नागरिक सेवा पोर्टल</span>
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Multi-Department Email Reporting System • Dual Language (English + हिंदी)
          </p>
        </div>
      </footer>

      {/* Processing Modal */}
      <IssueDetectionModal isOpen={isProcessing} step={detectionStep} statusMessage="Processing report..." />

      {/* Official Directory Modal */}
      <DirectoryModal isOpen={isDirectoryOpen} onClose={() => setIsDirectoryOpen(false)} />
    </div>
  );
}
