export type LanguageMode = 'bilingual' | 'hi' | 'en';

export interface TranslationDictionary {
  headerTitle: { en: string; hi: string };
  headerSubtitle: { en: string; hi: string };
  officialDirectory: { en: string; hi: string };
  topBannerText: { en: string; hi: string };
  
  // Steps
  step1Title: { en: string; hi: string };
  step1Desc: { en: string; hi: string };
  takePhoto: { en: string; hi: string };
  browseFiles: { en: string; hi: string };
  loadSample: { en: string; hi: string };
  addMorePhotos: { en: string; hi: string };
  selectedPhotos: { en: string; hi: string };
  
  // Common issue quick badges
  quickCategoryTitle: { en: string; hi: string };
  catWater: { en: string; hi: string };
  catGarbage: { en: string; hi: string };
  catRoad: { en: string; hi: string };
  catLight: { en: string; hi: string };

  step2Title: { en: string; hi: string };
  step2Desc: { en: string; hi: string };
  detectGps: { en: string; hi: string };
  detectingGps: { en: string; hi: string };
  addressPlaceholder: { en: string; hi: string };

  step3Title: { en: string; hi: string };
  step3Desc: { en: string; hi: string };
  voiceButton: { en: string; hi: string };
  voiceListening: { en: string; hi: string };
  voiceNotSupported: { en: string; hi: string };
  userNotePlaceholder: { en: string; hi: string };

  submitButton: { en: string; hi: string };
  submittingButton: { en: string; hi: string };
  listenAudio: { en: string; hi: string };

  // Modal
  modalTitle: { en: string; hi: string };
  modalSubtitle: { en: string; hi: string };
  modalStep1Title: { en: string; hi: string };
  modalStep1Desc: { en: string; hi: string };
  modalStep2Title: { en: string; hi: string };
  modalStep2Desc: { en: string; hi: string };
  modalStep3Title: { en: string; hi: string };
  modalStep3Desc: { en: string; hi: string };
  modalStep4Title: { en: string; hi: string };
  modalStep4Desc: { en: string; hi: string };

  // Preview Inspector
  draftBadge: { en: string; hi: string };
  deptAddressed: { en: string; hi: string };
  editPhotos: { en: string; hi: string };
  copyText: { en: string; hi: string };
  copiedText: { en: string; hi: string };
  tabEmailContent: { en: string; hi: string };
  tabDeptMatrix: { en: string; hi: string };
  evidenceAttached: { en: string; hi: string };
  sendEmailBtn: { en: string; hi: string };
  sendingEmailBtn: { en: string; hi: string };
  readyToSend: { en: string; hi: string };
  readyToSendSub: { en: string; hi: string };

  // Success
  successTitle: { en: string; hi: string };
  successSub: { en: string; hi: string };
  openGmailBtn: { en: string; hi: string };
  addressedDeptsTitle: { en: string; hi: string };
  createAnotherBtn: { en: string; hi: string };

  // Directory
  directoryTitle: { en: string; hi: string };
  directorySub: { en: string; hi: string };
  searchPlaceholder: { en: string; hi: string };
  escalationTitle: { en: string; hi: string };
  primaryEmails: { en: string; hi: string };
  grievanceEmails: { en: string; hi: string };
}

export const TRANSLATIONS: TranslationDictionary = {
  headerTitle: {
    en: "Nanhey Park Civic Watch",
    hi: "नन्हे पार्क नागरिक सेवा पोर्टल"
  },
  headerSubtitle: {
    en: "Matiala, New Delhi • Official Complaint System",
    hi: "मटियाला, नई दिल्ली • आधिकारिक शिकायत प्रणाली"
  },
  officialDirectory: {
    en: "Official Directory",
    hi: "अधिकारी डायरेक्टरी"
  },
  topBannerText: {
    en: "Upload civic photos. System automatically compiles 1 official email to MCD, DJB & PWD authorities.",
    hi: "फोटो अपलोड करें। हमारा AI सिस्टम अपने आप MCD, DJB, PWD विभागों के अधिकारियों को 1 ईमेल शिकायत बना कर भेजेगा।"
  },
  step1Title: {
    en: "1. Take or Upload Photos",
    hi: "1. समस्या की फोटो अपलोड करें"
  },
  step1Desc: {
    en: "Click photo or select from gallery (Road, Water, Garbage, Lighting)",
    hi: "सड़क, पानी, कचरा या लाइट की फोटो खींचे या गैलरी से चुनें"
  },
  takePhoto: {
    en: "Take Photo",
    hi: "फोटो खींचें"
  },
  browseFiles: {
    en: "Browse Gallery",
    hi: "गैलरी से चुनें"
  },
  loadSample: {
    en: "Load Sample Photo",
    hi: "सैंपल फोटो लोड करें"
  },
  addMorePhotos: {
    en: "Add More Photos",
    hi: "और फोटो जोड़ें"
  },
  selectedPhotos: {
    en: "Selected Photos",
    hi: "चुनी गई फोटो"
  },

  quickCategoryTitle: {
    en: "Common Complaint Types:",
    hi: "मुख्य शिकायत प्रकार:"
  },
  catWater: {
    en: "🌊 Water Overflow / Drainage",
    hi: "🌊 गंदा पानी / सीवर भराव"
  },
  catGarbage: {
    en: "🗑️ Garbage Dump",
    hi: "🗑️ कचरे का ढेर"
  },
  catRoad: {
    en: "🛣️ Broken Road / Pothole",
    hi: "🛣️ तोड़ी सड़क / गड्ढा"
  },
  catLight: {
    en: "💡 Street Light Broken",
    hi: "💡 स्ट्रीट लाइट खराब"
  },

  step2Title: {
    en: "2. Incident Location",
    hi: "2. शिकायत की जगह (लोकेशन)"
  },
  step2Desc: {
    en: "Address and GPS coordinates for authorities",
    hi: "अधिकारियों के लिए पता और जीपीएस लोकेशन"
  },
  detectGps: {
    en: "Auto-Detect GPS",
    hi: "अपने आप लोकेशन पता करें"
  },
  detectingGps: {
    en: "Detecting Location...",
    hi: "लोकेशन ढूंढी जा रही है..."
  },
  addressPlaceholder: {
    en: "Landmark / Street / Block",
    hi: "गली / मकान नंबर / लैंडमार्क लिखें"
  },

  step3Title: {
    en: "3. Speak or Write Problem",
    hi: "3. बोलकर या लिखकर समस्या बताएं (ऐच्छिक)"
  },
  step3Desc: {
    en: "You can speak in Hindi or English using mic button, or type notes.",
    hi: "माइक बटन दबाकर हिंदी या इंग्लिश में बोलें या टाइप करें।"
  },
  voiceButton: {
    en: "🎙️ Speak Problem (Voice Note)",
    hi: "🎙️ बोलकर बताएं (आवाज से लिखें)"
  },
  voiceListening: {
    en: "🔴 Listening... Speak now in Hindi or English",
    hi: "🔴 सुन रहे हैं... अब बोलिए (हिंदी या इंग्लिश)"
  },
  voiceNotSupported: {
    en: "Voice input not supported on this browser. Please type.",
    hi: "आपके ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है। कृपया लिखकर बताएं।"
  },
  userNotePlaceholder: {
    en: "e.g. Waterlogging here since 3 days, smells bad, please clean quickly...",
    hi: "जैसे: 3 दिन से पानी भरा है, बदबू आ रही है, जल्दी सफाई कराएं..."
  },

  submitButton: {
    en: "🚀 Generate Official Email Report",
    hi: "🚀 ईमेल शिकायत रिपोर्ट तैयार करें"
  },
  submittingButton: {
    en: "Generating Official Email Report...",
    hi: "ईमेल शिकायत रिपोर्ट तैयार हो रही है..."
  },
  listenAudio: {
    en: "🔊 Audio Guide",
    hi: "🔊 आवाज सुनें (Audio)"
  },

  modalTitle: {
    en: "Preparing Email Report",
    hi: "ईमेल रिपोर्ट तैयार की जा रही है"
  },
  modalSubtitle: {
    en: "Please wait while evidence photos are analyzed.",
    hi: "कृपया प्रतीक्षा करें, आपकी फोटो की जांच हो रही है।"
  },
  modalStep1Title: {
    en: "1. Applying GPS & Timestamp Watermark",
    hi: "1. फोटो पर समय और जीपीएस लोकेशन अंकित की जा रही है"
  },
  modalStep1Desc: {
    en: "Adds legal location proof onto photos",
    hi: "फोटो पर पक्का सबूत दर्ज किया जा रहा है"
  },
  modalStep2Title: {
    en: "2. Analyzing Civic Issues with AI",
    hi: "2. AI द्वारा समस्या की पहचान की जा रही है"
  },
  modalStep2Desc: {
    en: "Checking DJB, MCD, PWD and Electrical defects",
    hi: "जल बोर्ड, नगर निगम, सड़क व बिजली विभाग की जांच"
  },
  modalStep3Title: {
    en: "3. Matching Official Nodal Emails",
    hi: "3. संबंधित सरकारी विभागों के ईमेल जोड़े जा रहे हैं"
  },
  modalStep3Desc: {
    en: "Delhi government nodal authority database search",
    hi: "दिल्ली सरकार के नोडल अधिकारियों के पते"
  },
  modalStep4Title: {
    en: "4. Building Official Draft",
    hi: "4. अंतिम ईमेल ड्राफ्ट तैयार किया जा रहा है"
  },
  modalStep4Desc: {
    en: "Consolidating report with attached evidence photos",
    hi: "फोटो और पते के साथ अंतिम ड्राफ्ट तैयार"
  },

  draftBadge: {
    en: "Official Email Draft Ready",
    hi: "सरकारी ईमेल शिकायत तैयार है"
  },
  deptAddressed: {
    en: "municipal department(s) addressed",
    hi: "सरकारी विभाग जोड़े गए"
  },
  editPhotos: {
    en: "Edit Photos / Back",
    hi: "वापस जाएं / फोटो बदलें"
  },
  copyText: {
    en: "Copy Text",
    hi: "टेक्स्ट कॉपी करें"
  },
  copiedText: {
    en: "Copied!",
    hi: "कॉपी हो गया!"
  },
  tabEmailContent: {
    en: "Email Text (हिंदी व इंग्लिश)",
    hi: "ईमेल सामग्री"
  },
  tabDeptMatrix: {
    en: "Department List",
    hi: "विभाग सूची"
  },
  evidenceAttached: {
    en: "Attached Watermarked Evidence Photos",
    hi: "संलग्न जीपीएस वाटरमार्क फोटो"
  },
  sendEmailBtn: {
    en: "✉️ Send Email Now (Gmail / Email App)",
    hi: "✉️ अभी सरकारी ईमेल भेजें (Gmail द्वारा)"
  },
  sendingEmailBtn: {
    en: "Sending Email...",
    hi: "ईमेल भेजा जा रहा है..."
  },
  readyToSend: {
    en: "Ready to Dispatch Complaint",
    hi: "शिकायत भेजने के लिए तैयार है"
  },
  readyToSendSub: {
    en: "Clicking will open Gmail / Mail App with pre-filled authorities & attachments.",
    hi: "बटन दबाते ही Gmail खुल जाएगा जिसमें अधिकारियों का पता और फोटो पहले से भरी होंगी।"
  },

  successTitle: {
    en: "🎉 Complaint Dispatched Successfully!",
    hi: "🎉 आपकी शिकायत सफलता से भेज दी गई है!"
  },
  successSub: {
    en: "Your civic report with proof photos has been compiled and routed to municipal officers.",
    hi: "आपकी शिकायत और सबूत फोटो अधिकारियों के पास भेज दी गई है।"
  },
  openGmailBtn: {
    en: "✉️ Open Sent Email in Gmail App",
    hi: "✉️ जीमेल ऐप में शिकायत देखें"
  },
  addressedDeptsTitle: {
    en: "Addressed Departments & Location Proof",
    hi: "संबंधित विभाग एवं स्थान प्रमाण"
  },
  createAnotherBtn: {
    en: "🔄 Create Another Complaint Report",
    hi: "🔄 दूसरी शिकायत दर्ज करें"
  },

  directoryTitle: {
    en: "Delhi Civic Authorities Directory",
    hi: "दिल्ली सरकारी विभाग डायरेक्टरी"
  },
  directorySub: {
    en: "Official contact emails for Delhi civic departments (DJB, MCD, PWD, BSES)",
    hi: "दिल्ली सरकार के प्रमुख विभागों के आधिकारिक ईमेल पते"
  },
  searchPlaceholder: {
    en: "Search department (DJB, MCD, BSES, PWD...)",
    hi: "विभाग खोजें (MCD, DJB, BSES, PWD...)"
  },
  escalationTitle: {
    en: "Ministerial & Escalation Nodal Officers",
    hi: "मंत्री एवं उच्च अधिकारी ईमेल"
  },
  primaryEmails: {
    en: "Primary Email Officers:",
    hi: "मुख्य अधिकारी ईमेल:"
  },
  grievanceEmails: {
    en: "Grievance & Public Cell Emails:",
    hi: "शिकायत निवारण ईमेल:"
  }
};

export function getText(key: keyof TranslationDictionary, lang: LanguageMode): string {
  const item = TRANSLATIONS[key];
  if (!item) return '';

  if (lang === 'en') {
    return item.en;
  }
  if (lang === 'hi') {
    return item.hi;
  }
  // 'bilingual' (default) -> Easy English + Hindi subtitle
  return `${item.en} / ${item.hi}`;
}

export function getDualText(key: keyof TranslationDictionary, lang: LanguageMode): { primary: string; secondary?: string } {
  const item = TRANSLATIONS[key];
  if (!item) return { primary: '' };

  if (lang === 'en') {
    return { primary: item.en };
  }
  if (lang === 'hi') {
    return { primary: item.hi };
  }
  return { primary: item.en, secondary: item.hi };
}
