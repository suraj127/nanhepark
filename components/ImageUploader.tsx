'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, MapPin, Trash2, Plus, RefreshCw, Mic, MicOff, Volume2, AlertCircle, User } from 'lucide-react';
import { LocationData } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

interface ImageUploaderProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
  location: LocationData;
  onLocationChange: (loc: LocationData) => void;
  residentName: string;
  onResidentNameChange: (name: string) => void;
  userNote: string;
  onUserNoteChange: (note: string) => void;
  onSubmitReport: () => void;
  isProcessing: boolean;
}

// Compress raw mobile photo files down to 800px JPEG (~80KB) on client side for instant preview and zero memory crashes
const compressFileForMobile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) { resolve(''); return; }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 800;
          let scale = 1;
          const origW = img.width || 800;
          const origH = img.height || 600;

          if (origW > MAX_DIM || origH > MAX_DIM) {
            scale = Math.min(MAX_DIM / origW, MAX_DIM / origH);
          }

          canvas.width = Math.round(origW * scale);
          canvas.height = Math.round(origH * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(dataUrl); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedImages,
  onImagesChange,
  location,
  onLocationChange,
  residentName,
  onResidentNameChange,
  userNote,
  onUserNoteChange,
  onSubmitReport,
  isProcessing
}) => {
  const { lang, speakText } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceSupported(false);
      }
    }
  }, []);

  // Voice Input Toggle
  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      alert(lang === 'hi' ? TRANSLATIONS.voiceNotSupported.hi : TRANSLATIONS.voiceNotSupported.en);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onUserNoteChange(userNote ? `${userNote} ${transcript}` : transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech start error:', e);
      setIsListening(false);
    }
  };

  // File Upload Handler (Mobile & Safari Safe with auto-compression)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readPromises = fileList.map((file) => compressFileForMobile(file));

    const newImages = (await Promise.all(readPromises)).filter((url) => url !== '');
    if (newImages.length > 0) {
      onImagesChange([...selectedImages, ...newImages]);
    }
    // Clear input value so re-selecting photos works on mobile
    e.target.value = '';
  };

  // Remove Photo
  const handleRemovePhoto = (index: number) => {
    const updated = selectedImages.filter((_, idx) => idx !== index);
    onImagesChange(updated);
  };

  // Add Quick Category Chip to notes
  const handleAddCategoryChip = (categoryText: string) => {
    if (userNote.includes(categoryText)) return;
    const updated = userNote ? `${userNote}. समस्या: ${categoryText}` : `समस्या: ${categoryText}`;
    onUserNoteChange(updated);
  };

  // Detect GPS
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('आपके ब्राउज़र में जीपीएस सपोर्ट नहीं है।');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange({
          address: 'E Block, Nanhey Park, Matiala, New Delhi',
          latitude: parseFloat(pos.coords.latitude.toFixed(4)),
          longitude: parseFloat(pos.coords.longitude.toFixed(4)),
          area: 'Nanhey Park, Matiala',
          city: 'New Delhi'
        });
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('GPS error fallback:', err);
        setIsDetectingGps(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 backdrop-blur-xl border border-white/70">
      {/* Official Hero Banner with Custom Logo */}
      <div className="bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-emerald-500/15 border border-sky-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-xs">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="Nanhey Park Civic Watch Official Logo"
            className="w-24 sm:w-32 h-auto object-contain shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              SEE • CLICK • REPORT • CHANGE
            </h2>
            <p className="text-xs sm:text-sm font-bold text-sky-800">
              आपकी फोटो। अधिकारियों की कार्रवाई। — नन्हे पार्क नागरिक सेवा
            </p>
            <p className="text-xs text-slate-600 font-medium">
              ई ब्लॉक, मटियाला, नई दिल्ली • एकीकृत शिकायत प्रणाली
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: PHOTO UPLOAD */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-xs">1</span>
              <span>
                {lang === 'hi'
                  ? TRANSLATIONS.step1Title.hi
                  : TRANSLATIONS.step1Title.en}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 pl-9 font-medium">
              {lang === 'hi' ? TRANSLATIONS.step1Desc.hi : TRANSLATIONS.step1Desc.en}
            </p>
          </div>

          <button
            type="button"
            onClick={() => speakText("स्टेप 1: सड़क, पानी, कचरा या खराब लाइट की फोटो खींचें या गैलरी से अपलोड करें।")}
            className="self-start sm:self-center text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-bold cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'आवाज में निर्देश सुनें' : 'Listen Instructions'}</span>
          </button>
        </div>

        {/* Quick Category Suggestions */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700">
            {lang === 'hi' ? TRANSLATIONS.quickCategoryTitle.hi : TRANSLATIONS.quickCategoryTitle.en}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'water', text: lang === 'hi' ? TRANSLATIONS.catWater.hi : TRANSLATIONS.catWater.en },
              { id: 'garbage', text: lang === 'hi' ? TRANSLATIONS.catGarbage.hi : TRANSLATIONS.catGarbage.en },
              { id: 'road', text: lang === 'hi' ? TRANSLATIONS.catRoad.hi : TRANSLATIONS.catRoad.en },
              { id: 'light', text: lang === 'hi' ? TRANSLATIONS.catLight.hi : TRANSLATIONS.catLight.en },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleAddCategoryChip(cat.text)}
                className="px-3.5 py-1.5 rounded-full glass-badge text-slate-800 hover:text-sky-900 hover:border-sky-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105 min-h-[38px]"
              >
                <span className="text-sky-600 font-extrabold">+</span>
                <span>{cat.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Box / Thumbnails (Mobile-First HTML Label Triggers) */}
        {selectedImages.length === 0 ? (
          <div className="border-3 border-dashed border-sky-200/80 hover:border-sky-500 rounded-3xl p-6 sm:p-10 text-center bg-sky-50/30 backdrop-blur-md transition-all space-y-4 shadow-inner">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'hi' ? 'फोटो अपलोड करें या कैमरा चालू करें' : 'Add Photo Evidence'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 font-medium">
                {lang === 'hi'
                  ? 'फोटो पर जीपीएस लोकेशन और समय अपने आप लग जाएगा।'
                  : 'Automatic GPS & timestamp watermarks will be applied for official proof.'}
              </p>
            </div>

            {/* Native Mobile HTML Labels directly tied to inputs for 100% reliable mobile touch trigger */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <label
                htmlFor="mobile-camera-input"
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition shadow-md cursor-pointer hover:scale-[1.02] min-h-[46px] select-none active:bg-slate-950"
              >
                <Camera className="w-4 h-4 text-sky-400" />
                <span>{lang === 'hi' ? TRANSLATIONS.takePhoto.hi : TRANSLATIONS.takePhoto.en}</span>
              </label>

              <label
                htmlFor="mobile-gallery-input"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm flex items-center space-x-2 transition shadow-sm cursor-pointer hover:scale-[1.02] min-h-[46px] select-none active:bg-slate-100"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>{lang === 'hi' ? TRANSLATIONS.browseFiles.hi : TRANSLATIONS.browseFiles.en}</span>
              </label>
            </div>

            {/* Hidden Input Elements */}
            <input
              id="mobile-gallery-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleFileSelect}
            />
            <input
              id="mobile-camera-input"
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                {lang === 'hi' ? TRANSLATIONS.selectedPhotos.hi : TRANSLATIONS.selectedPhotos.en} ({selectedImages.length})
              </span>
              <label
                htmlFor="mobile-add-more-input"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-2xs min-h-[40px] select-none"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>{lang === 'hi' ? TRANSLATIONS.addMorePhotos.hi : TRANSLATIONS.addMorePhotos.en}</span>
              </label>
              <input
                id="mobile-add-more-input"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileSelect}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 aspect-video flex items-center justify-center shadow-sm group"
                >
                  <img src={imgUrl} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  <span className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                    Photo #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: LOCATION */}
      <div className="space-y-4 pt-4 border-t border-slate-200/70">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-xs">2</span>
            <MapPin className="w-5 h-5 text-sky-600" />
            <span>
              {lang === 'hi'
                ? TRANSLATIONS.step2Title.hi
                : TRANSLATIONS.step2Title.en}
            </span>
          </h2>
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="px-3.5 py-2 rounded-xl glass-badge hover:bg-sky-100 text-sky-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingGps
                ? (lang === 'hi' ? TRANSLATIONS.detectingGps.hi : TRANSLATIONS.detectingGps.en)
                : (lang === 'hi' ? TRANSLATIONS.detectGps.hi : TRANSLATIONS.detectGps.en)}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
              {lang === 'hi' ? 'पता / लैंडमार्क' : 'Address / Landmark'}
            </label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => onLocationChange({ ...location, address: e.target.value })}
              className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none transition min-h-[44px]"
              placeholder={lang === 'hi' ? TRANSLATIONS.addressPlaceholder.hi : TRANSLATIONS.addressPlaceholder.en}
            />
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Lat (अक्षांश)
              </label>
              <input
                type="number"
                step="0.0001"
                value={location.latitude}
                onChange={(e) => onLocationChange({ ...location, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-2xl px-3 py-3 text-xs font-mono font-bold text-slate-900 min-h-[44px]"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Lng (रेखांश)
              </label>
              <input
                type="number"
                step="0.0001"
                value={location.longitude}
                onChange={(e) => onLocationChange({ ...location, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full glass-input rounded-2xl px-3 py-3 text-xs font-mono font-bold text-slate-900 min-h-[44px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: RESIDENT NAME & WRITE/SPEAK NOTE */}
      <div className="space-y-4 pt-4 border-t border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-xs">3</span>
            <span>
              {lang === 'hi'
                ? '3. नाम व समस्या का विवरण'
                : '3. Resident Name & Problem Details'}
            </span>
          </h2>

          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-md cursor-pointer min-h-[44px] ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-200" />}
            <span>
              {isListening
                ? (lang === 'hi' ? TRANSLATIONS.voiceListening.hi : TRANSLATIONS.voiceListening.en)
                : (lang === 'hi' ? TRANSLATIONS.voiceButton.hi : TRANSLATIONS.voiceButton.en)}
            </span>
          </button>
        </div>

        {/* Resident Name Input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{lang === 'hi' ? 'आपका नाम (शिकायतकर्ता का नाम / Name):' : 'Your Name (Complainant Name):'}</span>
          </label>
          <input
            type="text"
            value={residentName}
            onChange={(e) => onResidentNameChange(e.target.value)}
            placeholder={lang === 'hi' ? 'अपना नाम लिखें (जैसे: सुरज कुमार / निवासी नन्हे पार्क)' : 'Enter your full name (e.g. Suraj Kumar)'}
            className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none transition min-h-[44px]"
          />
        </div>

        {/* User Note Textarea */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
            {lang === 'hi' ? 'समस्या का विवरण (बोलकर या लिखकर बताएं):' : 'Problem Details (Speak or Type):'}
          </label>
          <textarea
            rows={3}
            value={userNote}
            onChange={(e) => onUserNoteChange(e.target.value)}
            placeholder={lang === 'hi' ? TRANSLATIONS.userNotePlaceholder.hi : TRANSLATIONS.userNotePlaceholder.en}
            className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none transition leading-relaxed font-medium"
          />
        </div>
      </div>

      {/* FINAL SUBMIT BUTTON */}
      <div className="pt-4 border-t border-slate-200/70">
        <button
          type="button"
          disabled={selectedImages.length === 0 || isProcessing}
          onClick={onSubmitReport}
          className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base transition-all shadow-xl flex items-center justify-center space-x-2 min-h-[50px] ${
            selectedImages.length === 0 || isProcessing
              ? 'bg-slate-200/80 text-slate-400 cursor-not-allowed border border-slate-300/40'
              : 'glass-btn-primary text-white cursor-pointer hover:scale-[1.01]'
          }`}
        >
          <span>
            {isProcessing
              ? (lang === 'hi' ? TRANSLATIONS.submittingButton.hi : TRANSLATIONS.submittingButton.en)
              : (lang === 'hi' ? TRANSLATIONS.submitButton.hi : TRANSLATIONS.submitButton.en)}
          </span>
        </button>

        {selectedImages.length === 0 && (
          <p className="text-center text-xs text-amber-700 mt-2 font-bold flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>
              {lang === 'hi' ? 'आगे बढ़ने के लिए कम से कम 1 फोटो अपलोड करें' : 'Please upload at least 1 photo to generate official email.'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
