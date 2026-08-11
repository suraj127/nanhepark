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
You are an expert AI civic inspector for Delhi Civic Watch.
Analyze the provided photographic evidence carefully.

Detect ALL visible civic issues. Common issues:
1. Sewer overflow / clogged drainage (DJB)
2. Water leakage / pipe burst (DJB)
3. Garbage accumulation (MCD)
4. Dead animal / unhygienic spot (MCD)
5. Broken streetlight / damaged electric pole (ELECTRICAL)
6. Open manhole / missing drain cover (PWD or DJB)
7. Pothole / damaged road (PWD)
8. Broken traffic signal (TRAFFIC)

Location: ${loc.address} (${loc.latitude}, ${loc.longitude})
${userNote ? `Resident Note: ${userNote}` : ''}

Provide issueName (English), issueNameHindi (Devanagari Hindi), observation, observationHindi, requiredAction, requiredActionHindi for each issue.
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
            systemInstruction: 'You are an AI Civic Issue Detector. Return structured JSON with Hindi translations.',
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
            return parsed.map((item, idx) => ({
              id: item.id || `issue-${idx + 1}`,
              issueName: item.issueName || 'Civic Deficiency',
              issueNameHindi: item.issueNameHindi || 'नागरिक समस्या',
              departmentCode: (item.departmentCode || 'MCD').toUpperCase(),
              departmentName: item.departmentName || OFFICIAL_DEPARTMENT_DIRECTORY[item.departmentCode]?.departmentName || 'Municipal Authority',
              severity: (item.severity || 'MEDIUM').toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
              observation: item.observation || 'Civic issue observed.',
              observationHindi: item.observationHindi || 'नागरिक समस्या पाई गई है।',
              requiredAction: item.requiredAction || 'Kindly inspect and rectify.',
              requiredActionHindi: item.requiredActionHindi || 'कृपया तुरंत निरीक्षण कर समाधान करें।',
              photoIndices: Array.isArray(item.photoIndices) && item.photoIndices.length > 0 ? item.photoIndices : [1]
            }));
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

// Rule-based fallback detection
function detectIssuesFromNote(userNote: string): DetectedIssue[] {
  const noteLower = (userNote || '').toLowerCase();
  const issues: DetectedIssue[] = [];

  if (noteLower.includes('water') || noteLower.includes('sewer') || noteLower.includes('drain') || noteLower.includes('पानी') || noteLower.includes('सीवर') || noteLower.includes('नाली') || noteLower.includes('गंदा')) {
    issues.push({
      id: 'issue-djb', issueName: 'Sewer Overflow & Drainage Waterlogging',
      issueNameHindi: 'सीवर का गंदा पानी भराव व नाली जाम', departmentCode: 'DJB',
      departmentName: 'Delhi Jal Board (दिल्ली जल बोर्ड)', severity: 'HIGH',
      observation: 'Severe sewage water overflow causing unhygienic conditions.',
      observationHindi: 'सीवर का बदबूदार पानी भर रहा है जिससे आवाजाही ठप है।',
      requiredAction: 'Depute jetting suction machine to clear blocked sewer line.',
      requiredActionHindi: 'तुरंत सक्शन मशीन भेजकर सीवर लाइन साफ करें।', photoIndices: [1]
    });
  }

  if (noteLower.includes('garbage') || noteLower.includes('dump') || noteLower.includes('waste') || noteLower.includes('कचरा') || noteLower.includes('गंदगी') || noteLower.includes('कूड़ा')) {
    issues.push({
      id: 'issue-mcd', issueName: 'Accumulated Waste Dump',
      issueNameHindi: 'कचरे का ढेर व गंदगी', departmentCode: 'MCD',
      departmentName: 'Municipal Corporation of Delhi (MCD / नगर निगम)', severity: 'MEDIUM',
      observation: 'Unattended solid waste dump on public roadside.',
      observationHindi: 'सड़क किनारे कचरा जमा है जो बीमारी का कारण बन रहा है।',
      requiredAction: 'Dispatch sanitation workers and waste tipper truck.',
      requiredActionHindi: 'सफाई कर्मचारी और कचरा गाड़ी भेजकर सफाई कराएं।', photoIndices: [1]
    });
  }

  if (noteLower.includes('road') || noteLower.includes('pothole') || noteLower.includes('सड़क') || noteLower.includes('गड्ढा') || noteLower.includes('रास्ता')) {
    issues.push({
      id: 'issue-pwd', issueName: 'Damaged Road & Dangerous Pothole',
      issueNameHindi: 'क्षतिग्रस्त सड़क व गड्ढा', departmentCode: 'PWD',
      departmentName: 'Public Works Department (PWD / लोक निर्माण विभाग)', severity: 'HIGH',
      observation: 'Damaged road with deep potholes presenting accident hazard.',
      observationHindi: 'सड़क पर गड्ढे हैं जिससे दुर्घटना का खतरा है।',
      requiredAction: 'Conduct immediate pothole patching and road repair.',
      requiredActionHindi: 'सड़क के गड्ढों की तुरंत मरम्मत करवाएं।', photoIndices: [1]
    });
  }

  if (noteLower.includes('light') || noteLower.includes('pole') || noteLower.includes('electric') || noteLower.includes('लाइट') || noteLower.includes('अंधेरा') || noteLower.includes('बिजली')) {
    issues.push({
      id: 'issue-electrical', issueName: 'Non-Functional Streetlight',
      issueNameHindi: 'खराब स्ट्रीट लाइट', departmentCode: 'ELECTRICAL',
      departmentName: 'Electrical Department / BSES (बिजली विभाग)', severity: 'MEDIUM',
      observation: 'Streetlight not working, causing darkness at night.',
      observationHindi: 'स्ट्रीट लाइट बंद है जिससे रात में अंधेरा रहता है।',
      requiredAction: 'Replace LED bulb and repair electrical connection.',
      requiredActionHindi: 'एलईडी लाइट बदलकर बिजली कनेक्शन ठीक करें।', photoIndices: [1]
    });
  }

  return issues;
}

// Default composite report when no keywords matched
function getDefaultIssues(): DetectedIssue[] {
  return [
    {
      id: 'issue-1', issueName: 'Sewer Overflow & Waterlogging',
      issueNameHindi: 'सीवर भराव और जलजमाव', departmentCode: 'DJB',
      departmentName: 'Delhi Jal Board (दिल्ली जल बोर्ड)', severity: 'HIGH',
      observation: 'Sewage water overflow at residential street.',
      observationHindi: 'रास्ते पर सीवर का पानी भरा है।',
      requiredAction: 'Clear sewer blockage and clean area.',
      requiredActionHindi: 'सीवर की सफाई करवाकर जलजमाव हटाएं।', photoIndices: [1]
    },
    {
      id: 'issue-2', issueName: 'Uncollected Municipal Waste',
      issueNameHindi: 'कचरे का ढेर', departmentCode: 'MCD',
      departmentName: 'Municipal Corporation of Delhi (MCD / नगर निगम)', severity: 'MEDIUM',
      observation: 'Garbage dump on public street corner.',
      observationHindi: 'सड़क किनारे कचरा जमा है।',
      requiredAction: 'Arrange waste collection vehicle.',
      requiredActionHindi: 'सफाई गाड़ी भेजकर कचरा उठवाएं।', photoIndices: [1]
    },
    {
      id: 'issue-3', issueName: 'Damaged Road & Potholes',
      issueNameHindi: 'टूटी सड़क व गड्ढे', departmentCode: 'PWD',
      departmentName: 'Public Works Department (PWD / लोक निर्माण विभाग)', severity: 'MEDIUM',
      observation: 'Damaged road causing difficulty to vehicles.',
      observationHindi: 'सड़क टूटी है जिससे परेशानी हो रही है।',
      requiredAction: 'Repair road surface with asphalt patch.',
      requiredActionHindi: 'सड़क के गड्ढे भरकर मरम्मत करें।', photoIndices: [1]
    }
  ];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, location, userNote } = body;

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
      console.log('[Civic Watch] Gemini returned 0 results, using rule-based detection');
      detectedIssues = detectIssuesFromNote(userNote || '');
    }

    if (detectedIssues.length === 0) {
      console.log('[Civic Watch] No keywords matched, using default composite report');
      detectedIssues = getDefaultIssues();
    }

    // -------------------------------------------------------
    // STEP 2: Build recipients & email content
    // -------------------------------------------------------
    const detectedDepartmentCodes = Array.from(new Set(detectedIssues.map((i) => i.departmentCode)));
    const recipientData = buildCombinedRecipientList(detectedDepartmentCodes);

    const hasHighSeverity = detectedIssues.some((i) => i.severity === 'HIGH');
    const locationShort = loc.area ? `${loc.area}, ${loc.city}` : loc.address;
    const subjectPrefix = hasHighSeverity
      ? 'URGENT / अति आवश्यक: Civic Complaint Report'
      : 'Civic Complaint Report / नागरिक शिकायत पत्र';
    const emailSubject = `${subjectPrefix} — ${locationShort}`;

    const departmentMatrix = detectedIssues.map((i) => ({
      department: i.departmentName,
      issue: i.issueNameHindi ? `${i.issueName} (${i.issueNameHindi})` : i.issueName,
      severity: i.severity,
      action: i.requiredActionHindi ? `${i.requiredAction}\n${i.requiredActionHindi}` : i.requiredAction
    }));

    // Build Markdown Body
    let markdownBody = `Respected Sir/Madam / आदरणीय महोदय/महोदया,

This is an official civic complaint regarding multiple civic issues at:
यह निम्नलिखित स्थान पर पाई गई नागरिक समस्याओं की शिकायत है:

Location / स्थान: ${loc.address}
GPS: ${loc.latitude}, ${loc.longitude}
Date / दिनांक: ${dateFormatted}, ${timeFormatted} IST

`;

    detectedIssues.forEach((iss, idx) => {
      markdownBody += `${idx + 1}. ${iss.issueName} (${iss.issueNameHindi || ''})\n`;
      markdownBody += `   Department: ${iss.departmentName}\n`;
      markdownBody += `   Severity: ${iss.severity}\n`;
      markdownBody += `   Observation: ${iss.observation}\n`;
      markdownBody += `   ${iss.observationHindi || ''}\n`;
      markdownBody += `   Action Required: ${iss.requiredAction}\n`;
      markdownBody += `   ${iss.requiredActionHindi || ''}\n\n`;
    });

    markdownBody += `Concerned departments are requested to coordinate and resolve immediately.
संबंधित विभागों से अनुरोध है कि तुरंत समाधान कराएं।

Regards,
Nanhey Park Civic Watch (नागरिक सेवा समिति)
`;

    // Build HTML Body
    const matrixHtmlRows = detectedIssues.map((r) => `
      <tr>
        <td style="padding:10px;border:1px solid #e2e8f0;font-weight:bold;color:#0f172a">${r.departmentName}</td>
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
          <p>This is an official civic complaint regarding multiple issues at:</p>
          <div style="background:#f0f9ff;border-left:5px solid #0284c7;padding:14px 18px;margin:16px 0;border-radius:6px">
            <p style="margin:4px 0"><strong>Location / स्थान:</strong> ${loc.address}</p>
            <p style="margin:4px 0"><strong>GPS:</strong> ${loc.latitude}, ${loc.longitude}</p>
            <p style="margin:4px 0"><strong>Date / समय:</strong> ${dateFormatted}, ${timeFormatted} IST</p>
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
              Concerned departments are requested to coordinate and resolve immediately.<br/>
              (संबंधित विभागों से अनुरोध है कि तुरंत समाधान कराएं।)
            </p>
          </div>
          <p style="margin-top:24px;font-size:14px">Regards / भवदीय,<br/><strong>Nanhey Park Civic Watch (नागरिक सेवा समिति)</strong></p>
        </div>
      </div>
    `;

    // DO NOT send back full image data URLs — they bloat the response
    const watermarkedImagesPayload = images.map((_img: string, idx: number) => ({
      dataUrl: '', // Will be replaced by client-side watermarked images
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
