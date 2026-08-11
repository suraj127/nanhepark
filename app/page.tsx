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
  const [residentName, setResidentName] = useState('');
  const [userNote, setUserNote] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionStep, setDetectionStep] = useState(1);
  const [payload, setPayload] = useState<CombinedEmailPayload | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ dispatchId: string; gmailWebLink: string } | null>(null);

  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mobile & Memory Safe Image Compression (Scales photos to max 1024px, 0.6 JPEG quality)
  const compressImage = (dataUrl: string, maxWidth: number = 1024, quality: number = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(dataUrl), 2000);

      try {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timer);
          try {
            const canvas = document.createElement('canvas');
            let scale = 1;
            if (img.width > maxWidth || img.height > maxWidth) {
              scale = Math.min(maxWidth / img.width, maxWidth / img.height);
            }
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(dataUrl); return; }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch {
            resolve(dataUrl);
          }
        };
        img.onerror = () => { clearTimeout(timer); resolve(dataUrl); };
        img.src = dataUrl;
      } catch {
        clearTimeout(timer);
        resolve(dataUrl);
      }
    });
  };

  // Submit & Run Multi-Issue Analysis
  const handleAnalyzeAndGenerateEmail = async () => {
    if (selectedImages.length === 0) return;

    setErrorMessage(null);
    setIsProcessing(true);
    setDetectionStep(1); // Watermarking

    try {
      // Step 1: Watermarking images for display & proof
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

      // Step 2: Compress images for API transmission (fast & small for mobile networks)
      setDetectionStep(2);
      const compressedImages: string[] = [];
      for (const img of selectedImages) {
        try {
          const compressed = await compressImage(img, 900, 0.55);
          compressedImages.push(compressed);
        } catch {
          compressedImages.push(img);
        }
      }

      // Step 3: Call detect-issues API with compressed images and residentName
      const res = await fetch('/api/detect-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: compressedImages,
          location,
          userNote,
          residentName
        })
      });

      setDetectionStep(3); // Dept mapping & deduplication
      const data = await res.json().catch(() => ({ error: 'सर्वर से अमान्य प्रतिक्रिया (Invalid response from server)' }));

      if (!res.ok || !data.payload) {
        throw new Error(formatErrorMessage(data.error, 'ईमेल रिपोर्ट बनाने में त्रुटि हुई। कृपया दोबारा प्रयास करें।'));
      }

      // Replace API's compressed images with watermarked display images
      if (data.payload.watermarkedImages && watermarkedList.length > 0) {
        data.payload.watermarkedImages = watermarkedList.map((wm: string, idx: number) => ({
          dataUrl: wm,
          photoIndex: idx + 1,
          caption: data.payload.watermarkedImages[idx]?.caption || `Photo ${idx + 1}: Civic Evidence`
        }));
      }

      setDetectionStep(4); // Payload generated
      setTimeout(() => {
        setPayload(data.payload);
        setIsProcessing(false);
      }, 400);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(formatErrorMessage(err, 'रिपोर्ट बनाते समय त्रुटि हुई। कृपया दोबारा प्रयास करें।'));
      setIsProcessing(false);
    }
  };

  // Dispatch Email (Works 100% on Mobile iOS & Android + Desktop)
  const handleSendEmail = async () => {
    if (!payload) return;

    setIsSending(true);
    try {
      const toJoined = payload.toEmails.join(',');
      const ccJoined = payload.ccEmails.join(',');
      const subjectEncoded = encodeURIComponent(payload.subject);
      const bodyEncoded = encodeURIComponent(payload.bodyMarkdown);

      const mailtoLink = `mailto:${toJoined}?cc=${ccJoined}&subject=${subjectEncoded}&body=${bodyEncoded}`;
      const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(toJoined)}&cc=${encodeURIComponent(ccJoined)}&su=${subjectEncoded}&body=${bodyEncoded}`;

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // Direct mobile protocol launch for Gmail / iOS Mail App (bypasses popup blockers)
        window.location.href = mailtoLink;
      } else {
        // Desktop window open fallback
        const win = window.open(gmailWebLink, '_blank');
        if (!win) {
          window.location.href = mailtoLink;
        }
      }

      const dispatchId = `CIVIC-DISPATCH-${Date.now().toString(36).toUpperCase()}`;
      
      setDispatchResult({
        dispatchId,
        gmailWebLink
      });
      setIsSending(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Dispatch error:', err);
      setErrorMessage(formatErrorMessage(err, 'ईमेल भेजने में त्रुटि। कृपया दोबारा प्रयास करें।'));
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
    setResidentName('');
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
            residentName={residentName}
            onResidentNameChange={setResidentName}
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
            एकीकृत विभागीय ईमेल शिकायत प्रणाली • 100% Mobile & Resident Friendly
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
