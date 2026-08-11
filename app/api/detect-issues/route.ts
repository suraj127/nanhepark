import { NextRequest, NextResponse } from 'next/server';
import { buildCombinedRecipientList, OFFICIAL_DEPARTMENT_DIRECTORY } from '@/lib/directory';
import { CombinedEmailPayload, DetectedIssue, LocationData } from '@/lib/types';

// Next.js App Router segment config
export const maxDuration = 60;

// Helper: Race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

// Helper: Try Gemini AI vision analysis with timeout
async function tryGeminiVision(images: string[], loc: LocationData, userNote: string): Promise<DetectedIssue[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') return [];

    // Dynamic import to avoid crashes if package has issues
    const { GoogleGenAI } = await import('@google/genai');
    const { Type } = await import('@google/genai');
    
    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];

    // Only send first 3 images to keep payload small
    const imagesToSend = images.slice(0, 3);

    for (const imgDataUrl of imagesToSend) {
      let mimeType = 'image/jpeg';
      let base64Data = imgDataUrl;

      if (imgDataUrl.startsWith('data:')) {
        const matches = imgDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          base64Data = imgDataUrl.split(',')[1] || imgDataUrl;
        }
      }

      parts.push({
        inlineData: { mimeType, data: base64Data }
      });
    }

    const promptText = `
You are an expert AI civic inspector for Delhi Civic Watch (Nanhey Park / Matiala Area).
Analyze the provided photographic evidence carefully.

NOTE: Roads in this area come under DSIIDC (Delhi State Industrial and Infrastructure Development Corporation), NOT PWD.

Detect ALL visible civic issues:
1. Damaged road / pothole (Department: DSIIDC - Delhi State Industrial & Infrastructure Development Corporation)
2. Sewer overflow / clogged drainage (Department: DJB - Delhi Jal Board)
3. Water leakage / pipe burst (Department: DJB - Delhi Jal Board)
4. Garbage accumulation (Department: MCD - Municipal Corporation of Delhi)
5. Broken streetlight / damaged electric pole (Department: ELECTRICAL - BSES BRPL)
6. Open manhole / missing drain cover (Department: DSIIDC or DJB)

Location: ${loc.address} (${loc.latitude}, ${loc.longitude})
${userNote ? `Resident Focus Note: ${userNote}` : ''}

Provide issueName (English), issueNameHindi (Devanagari Hindi), departmentCode ('DSIIDC', 'DJB', 'MCD', 'ELECTRICAL'), observation, observationHindi, requiredAction, requiredActionHindi for each issue.
Return JSON array.
`;

    parts.push({ text: promptText });

    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Civic Watch] Trying Gemini model: ${modelName}`);
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config: {
            systemInstruction: 'You are an AI Civic Issue Detector. Return structured JSON with Hindi translations. Use DSIIDC for road issues.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  issueName: { type: Type.STRING },
                  issueNameHindi: { type: Type.STRING },
                  departmentCode: { type: Type.STRING },
                  departmentName: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  observation: { type: Type.STRING },
                  observationHindi: { type: Type.STRING },
                  requiredAction: { type: Type.STRING },
                  requiredActionHindi: { type: Type.STRING },
                  photoIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } }
                },
                required: ['issueName', 'departmentCode', 'severity', 'observation', 'requiredAction']
              }
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log(`[Civic Watch] Gemini ${modelName} detected ${parsed.length} issues`);
            return parsed.map((item, idx) => {
              let deptCode = (item.departmentCode || 'MCD').toUpperCase();
              if (deptCode === 'PWD' || item.issueName?.toLowerCase().includes('road') || item.issueName?.toLowerCase().includes('pothole')) {
                deptCode = 'DSIIDC';
              }
              return {
                id: item.id || `issue-${idx + 1}`,
                issueName: item.issueName || 'Civic Deficiency',
                issueNameHindi: item.issueNameHindi || 'नागरिक समस्या',
                departmentCode: deptCode,
                departmentName: OFFICIAL_DEPARTMENT_DIRECTORY[deptCode]?.departmentName || item.departmentName || 'Municipal Authority',
                severity: (item.severity || 'MEDIUM').toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
                observation: item.observation || 'Civic issue observed.',
                observationHindi: item.observationHindi || 'नागरिक समस्या पाई गई है।',
                requiredAction: item.requiredAction || 'Kindly inspect and rectify.',
                requiredActionHindi: item.requiredActionHindi || 'कृपया तुरंत निरीक्षण कर समाधान करें।',
                photoIndices: Array.isArray(item.photoIndices) && item.photoIndices.length > 0 ? item.photoIndices : [1]
              };
            });
          }
        }
      } catch (modelErr: any) {
        console.warn(`[Civic Watch] Gemini ${modelName} failed:`, modelErr?.message || modelErr);
      }
    }
  } catch (outerErr: any) {
    console.warn('[Civic Watch] Gemini Vision outer error:', outerErr?.message || outerErr);
  }
  return [];
}

// Rule-based fallback detection with DSIIDC for Roads and Focus Sorting
function detectIssuesFromNote(userNote: string): DetectedIssue[] {
  const noteLower = (userNote || '').toLowerCase();

  const dsiidcRoadIssue: DetectedIssue = {
    id: 'issue-dsiidc',
    issueName: 'DSIIDC Damaged Road & Dangerous Pothole',
    issueNameHindi: 'DSIIDC टूटी सड़क व खतरनाक गड्ढा (मटियाला)',
    departmentCode: 'DSIIDC',
    departmentName: 'Delhi State Industrial & Infrastructure Development Corp. (DSIIDC Roads)',
    severity: 'HIGH',
    observation: 'Damaged asphalt road surface and deep potholes presenting serious accident hazards to commuters in Matiala industrial/residential area.',
    observationHindi: 'सड़क पर गहरे गड्ढे हैं जिससे दोपहिया वाहनों और पैदल यात्रियों के दुर्घटनाग्रस्त होने का भारी जोखिम है (DSIIDC क्षेत्र)।',
    requiredAction: 'Depute DSIIDC road maintenance team for immediate cold-mix pothole patching and asphalt resurfacing.',
    requiredActionHindi: 'DSIIDC सड़क मरम्मत टीम को तुरंत भेजकर गड्ढों की पेचवर्क मरम्मत करवाएं व सड़क समतल करें।',
    photoIndices: [1]
  };

  const djbWaterIssue: DetectedIssue = {
    id: 'issue-djb',
    issueName: 'Sewer Overflow & Drainage Waterlogging',
    issueNameHindi: 'सीवर का गंदा पानी भराव व नाली जाम',
    departmentCode: 'DJB',
    departmentName: 'Delhi Jal Board (DJB - Water & Sewerage)',
    severity: 'HIGH',
    observation: 'Severe sewage water overflow causing unhygienic conditions and foul smell in public pathway.',
    observationHindi: 'सीवर का बदबूदार पानी सड़क पर भर रहा है जिससे संक्रामक बीमारियों और आवाजाही ठप होने का खतरा है।',
    requiredAction: 'Depute jetting suction machine to clear blocked sewer line and disinfect public street.',
    requiredActionHindi: 'तुरंत सक्शन मशीन भेजकर सीवर लाइन की रुकावट दूर कराएं व क्षेत्र को सेनेटाइज करें।',
    photoIndices: [1]
  };

  const mcdGarbageIssue: DetectedIssue = {
    id: 'issue-mcd',
    issueName: 'Accumulated Waste Dump',
    issueNameHindi: 'कचरे का ढेर व गंदगी का अंबार',
    departmentCode: 'MCD',
    departmentName: 'Municipal Corporation of Delhi (MCD - Najafgarh Zone)',
    severity: 'HIGH',
    observation: 'Unattended solid waste dump accumulated on public roadside.',
    observationHindi: 'सड़क किनारे अनसुलझा कचरा पड़ा है जिससे बदबू व बीमारियां फैल रही हैं।',
    requiredAction: 'Dispatch sanitation workers and waste tipper truck for immediate clearance.',
    requiredActionHindi: 'सफाई कर्मचारियों और कचरा गाड़ी को भेजकर कचरे का निस्तारण कराएं।',
    photoIndices: [1]
  };

  const electricalLightIssue: DetectedIssue = {
    id: 'issue-electrical',
    issueName: 'Non-Functional Streetlight',
    issueNameHindi: 'खराब / टूटी हुई स्ट्रीट लाइट',
    departmentCode: 'ELECTRICAL',
    departmentName: 'Electrical Department / BSES Rajdhani (बिजली विभाग)',
    severity: 'HIGH',
    observation: 'Public streetlight fixture is non-functional, causing dangerous darkness at night.',
    observationHindi: 'रात में स्ट्रीट लाइट बंद रहने से अंधेरा रहता है जिससे असामाजिक गतिविधियों और सुरक्षा का जोखिम है।',
    requiredAction: 'Replace burnt-out LED bulb and repair electrical connection.',
    requiredActionHindi: 'खराब एलईडी लाइट को बदलकर बिजली कनेक्शन दुरुस्त करें।',
    photoIndices: [1]
  };

  const isRoad = noteLower.includes('road') || noteLower.includes('pothole') || noteLower.includes('dsiidc') || noteLower.includes('सड़क') || noteLower.includes('गड्ढा') || noteLower.includes('रास्ता');
  const isWater = noteLower.includes('water') || noteLower.includes('sewer') || noteLower.includes('drain') || noteLower.includes('पानी') || noteLower.includes('सीवर') || noteLower.includes('नाली') || noteLower.includes('गंदा');
  const isGarbage = noteLower.includes('garbage') || noteLower.includes('dump') || noteLower.includes('waste') || noteLower.includes('कचरा') || noteLower.includes('गंदगी') || noteLower.includes('कूड़ा');
  const isLight = noteLower.includes('light') || noteLower.includes('pole') || noteLower.includes('electric') || noteLower.includes('लाइट') || noteLower.includes('अंधेरा') || noteLower.includes('बिजली');

  const ordered: DetectedIssue[] = [];

  if (isRoad) ordered.push(dsiidcRoadIssue);
  if (isWater) ordered.push(djbWaterIssue);
  if (isGarbage) ordered.push(mcdGarbageIssue);
  if (isLight) ordered.push(electricalLightIssue);

  if (!isRoad) ordered.push({ ...dsiidcRoadIssue, severity: 'MEDIUM' });
  if (!isWater) ordered.push({ ...djbWaterIssue, severity: 'MEDIUM' });
  if (!isGarbage) ordered.push({ ...mcdGarbageIssue, severity: 'MEDIUM' });

  return ordered;
}

function getDefaultIssues(): DetectedIssue[] {
  return [
    {
      id: 'issue-dsiidc',
      issueName: 'DSIIDC Damaged Road & Dangerous Pothole',
      issueNameHindi: 'DSIIDC टूटी सड़क व खतरनाक गड्ढा (मटियाला)',
      departmentCode: 'DSIIDC',
      departmentName: 'Delhi State Industrial & Infrastructure Development Corp. (DSIIDC Roads)',
      severity: 'HIGH',
      observation: 'Damaged asphalt road surface and deep potholes in Nanhey Park / Matiala area.',
      observationHindi: 'सड़क पर गहरे गड्ढे हैं जिससे दोपहिया वाहनों और यात्रियों के लिए भारी जोखिम है।',
      requiredAction: 'Depute DSIIDC road repair team for immediate cold-mix patching and resurfacing.',
      requiredActionHindi: 'DSIIDC सड़क मरम्मत टीम को भेजकर गड्ढों की तुरंत मरम्मत करवाएं।',
      photoIndices: [1]
    },
    {
      id: 'issue-djb',
      issueName: 'Sewer Overflow & Waterlogging',
      issueNameHindi: 'सीवर भराव और जलजमाव',
      departmentCode: 'DJB',
      departmentName: 'Delhi Jal Board (दिल्ली जल बोर्ड)',
      severity: 'MEDIUM',
      observation: 'Sewage water overflow at residential street entrance.',
      observationHindi: 'रास्ते पर सीवर का पानी भरने से आवाजाही बाधित हो रही है।',
      requiredAction: 'Clear sewer blockage and clean surrounding area.',
      requiredActionHindi: 'सीवर लाइन की सफाई करवाकर जलजमाव हटाएं।',
      photoIndices: [1]
    },
    {
      id: 'issue-mcd',
      issueName: 'Uncollected Municipal Waste',
      issueNameHindi: 'कचरे का ढेर व गंदगी',
      departmentCode: 'MCD',
      departmentName: 'Municipal Corporation of Delhi (MCD / नगर निगम)',
      severity: 'MEDIUM',
      observation: 'Garbage dump accumulated on public street corner.',
      observationHindi: 'सड़क किनारे अनसुलझा कचरा पड़ा है।',
      requiredAction: 'Arrange sanitation vehicle for waste collection.',
      requiredActionHindi: 'सफाई गाड़ी भेजकर कचरा उठवाएं।',
      photoIndices: [1]
    }
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, location, userNote, residentName } = body;

    const senderName = residentName && residentName.trim() !== '' ? residentName.trim() : 'सचेत नागरिक (Concerned Resident)';

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'कम से कम 1 फोटो जरूरी है।' }, { status: 400 });
    }

    const loc: LocationData = location || {
      address: 'E Block, Nanhey Park, Matiala, New Delhi',
      latitude: 28.6083, longitude: 77.0425,
      area: 'Nanhey Park, Matiala', city: 'New Delhi'
    };

    // Format IST Date and Time
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
    const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    const dateTimeIstText = `${dateFormatted}, ${timeFormatted} IST`;

    // -------------------------------------------------------
    // STEP 1: Try Gemini AI Vision (15s timeout), fallback to rules
    // -------------------------------------------------------
    let detectedIssues: DetectedIssue[] = [];
    
    const geminiPromise = tryGeminiVision(images, loc, userNote || '');
    detectedIssues = await withTimeout(geminiPromise, 15000, []);

    if (detectedIssues.length === 0) {
      console.log('[Civic Watch] Using focused rule-based detection for note:', userNote);
      detectedIssues = detectIssuesFromNote(userNote || '');
    }

    if (detectedIssues.length === 0) {
      console.log('[Civic Watch] Using default DSIIDC composite report');
      detectedIssues = getDefaultIssues();
    }

    // Sort detected issues so user note's focus issue is #1 HIGH severity
    const noteLower = (userNote || '').toLowerCase();
    if (noteLower.includes('road') || noteLower.includes('pothole') || noteLower.includes('dsiidc') || noteLower.includes('सड़क') || noteLower.includes('गड्ढा')) {
      detectedIssues.sort((a, b) => (a.departmentCode === 'DSIIDC' ? -1 : b.departmentCode === 'DSIIDC' ? 1 : 0));
      if (detectedIssues[0]) detectedIssues[0].severity = 'HIGH';
    } else if (noteLower.includes('water') || noteLower.includes('sewer') || noteLower.includes('पानी') || noteLower.includes('सीवर')) {
      detectedIssues.sort((a, b) => (a.departmentCode === 'DJB' ? -1 : b.departmentCode === 'DJB' ? 1 : 0));
      if (detectedIssues[0]) detectedIssues[0].severity = 'HIGH';
    } else if (noteLower.includes('garbage') || noteLower.includes('dump') || noteLower.includes('कचरा') || noteLower.includes('गंदगी')) {
      detectedIssues.sort((a, b) => (a.departmentCode === 'MCD' ? -1 : b.departmentCode === 'MCD' ? 1 : 0));
      if (detectedIssues[0]) detectedIssues[0].severity = 'HIGH';
    }

    // -------------------------------------------------------
    // STEP 2: Build recipients & email content
    // -------------------------------------------------------
    const detectedDepartmentCodes = Array.from(new Set(detectedIssues.map((i) => i.departmentCode)));
    const recipientData = buildCombinedRecipientList(detectedDepartmentCodes);

    const primaryIssue = detectedIssues[0];
    const locationShort = loc.area ? `${loc.area}, ${loc.city}` : loc.address;
    
    // Dynamic focused email subject
    const subjectPrefix = primaryIssue
      ? `URGENT / अति आवश्यक: ${primaryIssue.issueName} (${primaryIssue.departmentCode})`
      : 'URGENT / अति आवश्यक: Civic Complaint Report';
    const emailSubject = `${subjectPrefix} — ${locationShort}`;

    const departmentMatrix = detectedIssues.map((i) => ({
      department: i.departmentName,
      issue: i.issueNameHindi ? `${i.issueName} (${i.issueNameHindi})` : i.issueName,
      severity: i.severity,
      action: i.requiredActionHindi ? `${i.requiredAction}\n${i.requiredActionHindi}` : i.requiredAction
    }));

    // Build Markdown Body with Resident Name in Sign-Off
    let markdownBody = `Respected Sir/Madam / आदरणीय महोदय/महोदया,

This is an official urgent civic complaint regarding severe civic deficiencies observed at:
यह निम्नलिखित स्थान पर पाई गई गंभीर नागरिक समस्याओं की शिकायत है:

Location / स्थान: ${loc.address}
GPS Coordinates / जीपीएस: ${loc.latitude}, ${loc.longitude}
Date & Time / दिनांक व समय: ${dateFormatted}, ${timeFormatted} IST

---

PRIMARY COMPLAINT FOCUS / मुख्य शिकायत:
▶ ${primaryIssue?.issueName || 'Civic Infrastructure Deficit'}
▶ Department Responsible: ${primaryIssue?.departmentName || 'DSIIDC / MCD / DJB'}
▶ Severity: HIGH / उच्च प्राथमिकता

---

ALL DETECTED ISSUES / पाई गई सभी समस्याएं:

`;

    detectedIssues.forEach((iss, idx) => {
      markdownBody += `## ${idx + 1}. ${iss.issueName} ${iss.issueNameHindi ? `(${iss.issueNameHindi})` : ''}\n`;
      markdownBody += `   - Department / विभाग: ${iss.departmentName}\n`;
      markdownBody += `   - Severity / प्राथमिकता: ${iss.severity}\n`;
      markdownBody += `   - Observation / विवरण: ${iss.observation}\n`;
      if (iss.observationHindi) markdownBody += `     ${iss.observationHindi}\n`;
      markdownBody += `   - Required Action / आवश्यक कार्रवाई: ${iss.requiredAction}\n`;
      if (iss.requiredActionHindi) markdownBody += `     ${iss.requiredActionHindi}\n\n`;
    });

    markdownBody += `The primary concerned department (${primaryIssue?.departmentCode}) and nodal officers (LG, CM, Ministers) are requested to take immediate action and resolve the issue.

मुख्य संबंधित विभाग (${primaryIssue?.departmentCode}) व अधिकारियों से अनुरोध है कि प्राथमिकता के आधार पर तुरंत समाधान कराएं।

Regards / भवदीय,
**${senderName}**
Nanhey Park Civic Watch (नागरिक सेवा समिति)
E Block, Matiala, New Delhi
`;

    // Build HTML Body with Resident Name in Sign-Off
    const matrixHtmlRows = detectedIssues.map((r, idx) => `
      <tr style="${idx === 0 ? 'background-color: #fef2f2;' : ''}">
        <td style="padding:10px;border:1px solid #e2e8f0;font-weight:bold;color:#0f172a">
          ${r.departmentName}
          ${idx === 0 ? '<br/><span style="background:#dc2626;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;display:inline-block;margin-top:2px">PRIMARY FOCUS / मुख्य प्राथमिकता</span>' : ''}
        </td>
        <td style="padding:10px;border:1px solid #e2e8f0;color:#334155">
          <strong>${r.issueName}</strong><br/>
          <span style="color:#0284c7;font-size:12px">${r.issueNameHindi || ''}</span>
        </td>
        <td style="padding:10px;border:1px solid #e2e8f0;color:${r.severity === 'HIGH' ? '#dc2626' : '#d97706'};font-weight:bold">${r.severity}</td>
        <td style="padding:10px;border:1px solid #e2e8f0;color:#334155;font-size:13px">
          <div>${r.requiredAction}</div>
          <div style="color:#475569;font-size:12px;margin-top:4px">${r.requiredActionHindi || ''}</div>
        </td>
      </tr>
    `).join('');

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e293b;max-width:700px;margin:0 auto;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden;background:#fff">
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;padding:22px;text-align:center">
          <h2 style="margin:0;font-size:20px;letter-spacing:0.5px;text-transform:uppercase">NANHEY PARK CIVIC WATCH</h2>
          <p style="margin:4px 0 0;font-size:14px;color:#38bdf8;font-weight:bold">नागरिक शिकायत पत्र • Official Complaint Report</p>
        </div>
        <div style="padding:24px">
          <p style="font-size:15px;font-weight:bold">Respected Sir/Madam / आदरणीय महोदय/महोदया,</p>
          <p>This is an official urgent civic complaint regarding severe civic deficiencies observed at:</p>
          <div style="background:#f0f9ff;border-left:5px solid #0284c7;padding:14px 18px;margin:16px 0;border-radius:6px">
            <p style="margin:4px 0"><strong>Location / स्थान:</strong> ${loc.address}</p>
            <p style="margin:4px 0"><strong>GPS Coordinates / जीपीएस:</strong> ${loc.latitude}, ${loc.longitude}</p>
            <p style="margin:4px 0"><strong>Date & Time / समय:</strong> ${dateFormatted}, ${timeFormatted} IST</p>
          </div>

          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px;margin:16px 0">
            <h4 style="margin:0 0 4px 0;color:#991b1b;font-size:14px">🎯 PRIMARY COMPLAINT FOCUS / मुख्य प्राथमिकता की समस्या:</h4>
            <p style="margin:0;font-size:15px;font-weight:bold;color:#7f1d1d">${primaryIssue?.issueName} (${primaryIssue?.issueNameHindi || ''})</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#991b1b"><strong>Department Responsible:</strong> ${primaryIssue?.departmentName}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
            <thead>
              <tr style="background:#f1f5f9;color:#475569">
                <th style="padding:10px;border:1px solid #cbd5e1;text-align:left">Department / विभाग</th>
                <th style="padding:10px;border:1px solid #cbd5e1;text-align:left">Issue / समस्या</th>
                <th style="padding:10px;border:1px solid #cbd5e1;text-align:left">Severity</th>
                <th style="padding:10px;border:1px solid #cbd5e1;text-align:left">Action / कार्रवाई</th>
              </tr>
            </thead>
            <tbody>${matrixHtmlRows}</tbody>
          </table>

          <div style="margin-top:24px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:16px">
            <h4 style="margin:0 0 6px;color:#1e40af;font-size:15px">REQUEST FOR COORDINATED ACTION / त्वरित कार्रवाई का अनुरोध</h4>
            <p style="margin:0;font-size:13px;color:#1e3a8a">
              The primary concerned department (${primaryIssue?.departmentCode}) is requested to resolve the issue on top priority.<br/>
              (मुख्य संबंधित विभाग (${primaryIssue?.departmentCode}) से अनुरोध है कि प्राथमिकता के आधार पर तुरंत समाधान कराएं।)
            </p>
          </div>
          <p style="margin-top:24px;font-size:14px">
            Regards / भवदीय,<br/>
            <strong style="color: #0f172a; font-size: 15px;">${senderName}</strong><br/>
            <span>Nanhey Park Civic Watch (नागरिक सेवा समिति)</span>
          </p>
        </div>
      </div>
    `;

    const watermarkedImagesPayload = images.map((_img: string, idx: number) => ({
      dataUrl: '',
      photoIndex: idx + 1,
      caption: `Photo ${idx + 1}: ${detectedIssues.filter((i) => i.photoIndices.includes(idx + 1)).map((i) => i.issueName).join(' + ') || 'Civic Site Evidence'}`
    }));

    const payload: CombinedEmailPayload = {
      location: loc,
      dateTimeFormatted: dateTimeIstText,
      timestampIso: now.toISOString(),
      detectedIssues,
      toEmails: recipientData.toEmails,
      ccEmails: recipientData.ccEmails,
      subject: emailSubject,
      bodyMarkdown: markdownBody,
      bodyHtml: htmlBody,
      departmentMatrix,
      watermarkedImages: watermarkedImagesPayload,
      deduplicationAudit: recipientData.auditLog
    };

    return NextResponse.json({ success: true, payload });
  } catch (error: any) {
    console.error('[Civic Watch] FATAL ERROR in /api/detect-issues:', error);
    return NextResponse.json({ error: error?.message || 'Report generation failed. Please try again.' }, { status: 500 });
  }
}
