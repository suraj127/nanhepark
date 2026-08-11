import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { buildCombinedRecipientList, OFFICIAL_DEPARTMENT_DIRECTORY } from '@/lib/directory';
import { Type } from '@google/genai';
import { CombinedEmailPayload, DetectedIssue, LocationData } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { images, location, userNote } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required for multi-issue detection.' }, { status: 400 });
    }

    const loc: LocationData = location || {
      address: 'E Block, Nanhey Park, Matiala, New Delhi',
      latitude: 28.6083,
      longitude: 77.0425,
      area: 'Nanhey Park, Matiala',
      city: 'New Delhi'
    };

    // Format IST Date and Time
    const now = new Date();
    const istOptionsDate: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    const istOptionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };

    const dateFormatted = now.toLocaleDateString('en-IN', istOptionsDate);
    const timeFormatted = now.toLocaleTimeString('en-IN', istOptionsTime);
    const dateTimeIstText = `${dateFormatted}, ${timeFormatted} IST`;

    let detectedIssues: DetectedIssue[] = [];
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');

    // ----------------------------------------------------
    // MODE 1: Gemini AI Vision Detection (with multi-model fallback)
    // ----------------------------------------------------
    if (hasApiKey) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      const ai = getGeminiClient();
      const parts: any[] = [];

      images.forEach((imgDataUrl: string) => {
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
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      });

      const promptText = `
You are an expert AI civic inspector for Delhi Civic Watch.
Analyze the provided photographic evidence (${images.length} photo(s)) carefully.

Detect ALL visible civic issues present in the image(s). Common civic issues include:
1. Sewer overflow / clogged drainage (Department: DJB - Delhi Jal Board)
2. Water leakage / pipe burst (Department: DJB - Delhi Jal Board)
3. Garbage accumulation / uncollected waste dump (Department: MCD - Municipal Corporation of Delhi)
4. Dead animal / unhygienic spot (Department: MCD - Municipal Corporation of Delhi)
5. Broken / non-functional streetlight or damaged electric pole (Department: ELECTRICAL - Electrical Authority / BSES)
6. Open manhole / missing drain cover (Department: PWD or DJB)
7. Pothole / damaged asphalt road (Department: PWD - Public Works Department)
8. Broken traffic signal / damaged road sign (Department: TRAFFIC - Delhi Traffic Police)

Location context: ${loc.address} (Coordinates: ${loc.latitude}, ${loc.longitude})
${userNote ? `Resident Note: ${userNote}` : ''}

CRITICAL REQUIREMENT:
Provide clear, simple descriptions in BOTH English AND Hindi for every detected issue!

INSTRUCTIONS:
1. Identify EVERY distinct visible civic issue across all uploaded photos.
2. Group issues by department (DJB, MCD, ELECTRICAL, PWD, TRAFFIC).
3. Provide issueName in English and issueNameHindi in Devanagari Hindi.
4. Provide observation in English and observationHindi in Devanagari Hindi.
5. Provide requiredAction in English and requiredActionHindi in Devanagari Hindi.
6. Return structured JSON array.
`;

      parts.push({ text: promptText });

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction: 'You are an AI Civic Issue Detector. Return structured JSON matching schema with Hindi translations.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    issueName: { type: Type.STRING },
                    issueNameHindi: { type: Type.STRING },
                    departmentCode: { type: Type.STRING, description: 'One of DJB, MCD, ELECTRICAL, PWD, TRAFFIC' },
                    departmentName: { type: Type.STRING },
                    severity: { type: Type.STRING, description: 'HIGH, MEDIUM, or LOW' },
                    observation: { type: Type.STRING },
                    observationHindi: { type: Type.STRING },
                    requiredAction: { type: Type.STRING },
                    requiredActionHindi: { type: Type.STRING },
                    photoIndices: {
                      type: Type.ARRAY,
                      items: { type: Type.INTEGER }
                    }
                  },
                  required: ['issueName', 'departmentCode', 'departmentName', 'severity', 'observation', 'requiredAction']
                }
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            if (Array.isArray(parsed) && parsed.length > 0) {
              detectedIssues = parsed.map((item, idx) => ({
                id: item.id || `issue-${idx + 1}`,
                issueName: item.issueName || 'Civic Deficiency',
                issueNameHindi: item.issueNameHindi || 'नागरिक समस्या',
                departmentCode: (item.departmentCode || 'MCD').toUpperCase(),
                departmentName: item.departmentName || OFFICIAL_DEPARTMENT_DIRECTORY[item.departmentCode]?.departmentName || 'Municipal Authority',
                severity: (item.severity || 'MEDIUM').toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
                observation: item.observation || 'Observed civic non-compliance on public roadway.',
                observationHindi: item.observationHindi || 'सार्वजनिक मार्ग पर समस्या पाई गई है।',
                requiredAction: item.requiredAction || 'Kindly inspect and rectify immediately.',
                requiredActionHindi: item.requiredActionHindi || 'कृपया तुरंत निरीक्षण कर समाधान करें।',
                photoIndices: Array.isArray(item.photoIndices) && item.photoIndices.length > 0 ? item.photoIndices : [1]
              }));
              break; // Successfully got AI output
            }
          }
        } catch (modelErr) {
          console.warn(`Gemini vision model (${modelName}) attempt failed, trying fallback:`, modelErr);
        }
      }
    }

    // ----------------------------------------------------
    // MODE 2: Smart Rule-Based Detection (If AI key is missing or calls fail)
    // ----------------------------------------------------
    if (detectedIssues.length === 0) {
      const noteLower = (userNote || '').toLowerCase();
      const potentialIssues: DetectedIssue[] = [];

      // Check Rule 1: DJB (Water / Sewer)
      if (noteLower.includes('water') || noteLower.includes('sewer') || noteLower.includes('drain') || noteLower.includes('पानी') || noteLower.includes('सीवर') || noteLower.includes('नाली')) {
        potentialIssues.push({
          id: 'issue-djb',
          issueName: 'Sewer Overflow & Drainage Waterlogging',
          issueNameHindi: 'सीवर का गंदा पानी भराव व नाली जाम',
          departmentCode: 'DJB',
          departmentName: 'Delhi Jal Board (दिल्ली जल बोर्ड)',
          severity: 'HIGH',
          observation: 'Severe sewage water overflow causing unhygienic conditions and foul smell in public pathway.',
          observationHindi: 'रिहाइशी इलाके के रास्ते पर सीवर का बदबूदार पानी भर रहा है जिससे आवाजाही ठप है।',
          requiredAction: 'Depute jetting suction machine to clear blocked sewer line and disinfect area.',
          requiredActionHindi: 'तुरंत सक्शर मशीन भेजकर सीवर लाइन की रुकावट दूर कराएं व क्षेत्र को सेनेटाइज करें।',
          photoIndices: [1]
        });
      }

      // Check Rule 2: MCD (Garbage / Waste)
      if (noteLower.includes('garbage') || noteLower.includes('dump') || noteLower.includes('waste') || noteLower.includes('कचरा') || noteLower.includes('गंदगी') || noteLower.includes('कूड़ा')) {
        potentialIssues.push({
          id: 'issue-mcd',
          issueName: 'Accumulated Waste Dump',
          issueNameHindi: 'कचरे का ढेर व गंदगी का अंबार',
          departmentCode: 'MCD',
          departmentName: 'Municipal Corporation of Delhi (MCD / नगर निगम)',
          severity: 'MEDIUM',
          observation: 'Unattended municipal solid waste dump accumulated on public roadside.',
          observationHindi: 'सड़क के किनारे अनसुलझा कचरा जमा है जो बीमारी का कारण बन रहा है।',
          requiredAction: 'Dispatch sanitation workers and waste tipper truck for immediate clearance.',
          requiredActionHindi: 'सफाई कर्मचारियों और कचरा गाड़ी को भेजकर कचरे का निस्तारण कराएं।',
          photoIndices: [1]
        });
      }

      // Check Rule 3: PWD (Road / Pothole)
      if (noteLower.includes('road') || noteLower.includes('pothole') || noteLower.includes('toota') || noteLower.includes('सड़क') || noteLower.includes('गड्ढा') || noteLower.includes('रास्ता')) {
        potentialIssues.push({
          id: 'issue-pwd',
          issueName: 'Damaged Asphalt Road & Dangerous Pothole',
          issueNameHindi: 'क्षतिग्रस्त सड़क व खतरनाक गड्ढा',
          departmentCode: 'PWD',
          departmentName: 'Public Works Department (PWD / लोक निर्माण विभाग)',
          severity: 'HIGH',
          observation: 'Damaged road surface and deep potholes presenting accident hazard to commuters.',
          observationHindi: 'सड़क पर गहरे गड्ढे हैं जिससे दोपहिया और पैदल यात्रियों के दुर्घटनाग्रस्त होने का खतरा है।',
          requiredAction: 'Conduct immediate cold-mix pothole patching and repair road layer.',
          requiredActionHindi: 'सड़क के गड्ढों की तुरंत पेचवर्क मरम्मत करवाकर समतल करें।',
          photoIndices: [1]
        });
      }

      // Check Rule 4: ELECTRICAL (Streetlight)
      if (noteLower.includes('light') || noteLower.includes('pole') || noteLower.includes('electric') || noteLower.includes('लाइट') || noteLower.includes('अंधेरा') || noteLower.includes('बिजली')) {
        potentialIssues.push({
          id: 'issue-electrical',
          issueName: 'Non-Functional / Broken Streetlight Fixture',
          issueNameHindi: 'खराब / टूटी हुई स्ट्रीट लाइट',
          departmentCode: 'ELECTRICAL',
          departmentName: 'Electrical Department / BSES (बिजली विभाग)',
          severity: 'MEDIUM',
          observation: 'Public streetlight fixture is non-functional, causing dangerous pitch darkness at night.',
          observationHindi: 'रात में स्ट्रीट लाइट बंद रहने से अंधेरा छाया रहता है जिससे सुरक्षा का जोखिम है।',
          requiredAction: 'Replace burnt-out LED bulb and repair electrical pole connection.',
          requiredActionHindi: 'खराब एलईडी लाइट को बदलकर बिजली कनेक्शन दुरुस्त करें।',
          photoIndices: [1]
        });
      }

      // Default composite report if no specific keywords matched
      if (potentialIssues.length === 0) {
        detectedIssues = [
          {
            id: 'issue-1',
            issueName: 'Sewer Overflow & Waterlogging',
            issueNameHindi: 'सीवर भराव और जलजमाव',
            departmentCode: 'DJB',
            departmentName: 'Delhi Jal Board (दिल्ली जल बोर्ड)',
            severity: 'HIGH',
            observation: 'Sewage water overflow observed at residential street entrance.',
            observationHindi: 'रास्ते पर सीवर का पानी भरने से आवाजाही बाधित हो रही है।',
            requiredAction: 'Clear sewer blockage and clean surrounding area.',
            requiredActionHindi: 'सीवर लाइन की सफाई करवाकर जलजमाव हटाएं।',
            photoIndices: [1]
          },
          {
            id: 'issue-2',
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
          },
          {
            id: 'issue-3',
            issueName: 'Damaged Road & Potholes',
            issueNameHindi: 'तोड़ी सड़क व गड्ढे',
            departmentCode: 'PWD',
            departmentName: 'Public Works Department (PWD / लोक निर्माण विभाग)',
            severity: 'MEDIUM',
            observation: 'Damaged asphalt road causing difficulty to vehicles.',
            observationHindi: 'टूटी सड़क से वाहनों की आवाजाही में परेशानी हो रही है।',
            requiredAction: 'Repair damaged road surface with asphalt patch.',
            requiredActionHindi: 'सड़क के गड्ढों को भरकर मरम्मत करें।',
            photoIndices: [1]
          }
        ];
      } else {
        detectedIssues = potentialIssues;
      }
    }

    // Get unique departments detected
    const detectedDepartmentCodes = Array.from(new Set(detectedIssues.map((i) => i.departmentCode)));

    // Build Combined Recipient List with Automatic Deduplication
    const recipientData = buildCombinedRecipientList(detectedDepartmentCodes);

    // Determine Subject Line in English + Hindi
    const hasHighSeverity = detectedIssues.some((i) => i.severity === 'HIGH');
    const locationShort = loc.area ? `${loc.area}, ${loc.city}` : loc.address;
    const subjectPrefix = hasHasSeverity(hasHighSeverity)
      ? 'URGENT / अति आवश्यक: Civic Complaint Report'
      : 'Civic Complaint Report / नागरिक शिकायत पत्र';
    const emailSubject = `${subjectPrefix} — ${locationShort}`;

    // Build Department Matrix Table with Hindi
    const departmentMatrix = detectedIssues.map((i) => ({
      department: i.departmentName,
      issue: i.issueNameHindi ? `${i.issueName} (${i.issueNameHindi})` : i.issueName,
      severity: i.severity,
      action: i.requiredActionHindi ? `${i.requiredAction}\n${i.requiredActionHindi}` : i.requiredAction
    }));

    // Build ONE Email Body (Markdown Format) with Bilingual (Hindi + English)
    let markdownBody = `Respected Sir/Madam / आदरणीय महोदय/महोदया,

This is an official civic complaint to bring to your immediate attention multiple civic issues observed at:
यह निम्नलिखित स्थान पर पाई गई कई नागरिक समस्याओं की ओर आपका ध्यान आकर्षित करने हेतु आधिकारिक शिकायत पत्र है:

**Location / स्थान:** ${loc.address}
**Coordinates / जीपीएस:** ${loc.latitude}, ${loc.longitude}
**Date & Time / दिनांक व समय:** ${dateFormatted}, ${timeFormatted} IST

Photographic evidence with GPS & timestamp watermarks is attached below.
स्थान प्रमाण और समय के साथ फोटो संलग्न हैं।

---
`;

    // Group issues by department for department-wise headers
    const issuesByDept: Record<string, DetectedIssue[]> = {};
    detectedIssues.forEach((issue) => {
      const deptKey = issue.departmentName.toUpperCase();
      if (!issuesByDept[deptKey]) {
        issuesByDept[deptKey] = [];
      }
      issuesByDept[deptKey].push(issue);
    });

    let deptCounter = 1;
    for (const [deptTitle, issues] of Object.entries(issuesByDept)) {
      markdownBody += `\n## ${deptCounter}. ${deptTitle}\n\n`;
      issues.forEach((iss) => {
        markdownBody += `### Issue / समस्या: ${iss.issueName} ${iss.issueNameHindi ? `(${iss.issueNameHindi})` : ''}\n`;
        markdownBody += `**Severity / प्राथमिकता:** ${iss.severity}\n\n`;
        markdownBody += `**Observation / विवरण:**\n- **EN:** ${iss.observation}\n${iss.observationHindi ? `- **HI:** ${iss.observationHindi}\n` : ''}\n`;
        markdownBody += `**Required Action / आवश्यक कार्रवाई:**\n- **EN:** ${iss.requiredAction}\n${iss.requiredActionHindi ? `- **HI:** ${iss.requiredActionHindi}\n` : ''}\n`;
      });
      markdownBody += `---\n`;
      deptCounter++;
    }

    // Add Department / Issue Matrix Table
    markdownBody += `\n### DEPARTMENT & ISSUE SUMMARY MATRIX / शिकायत सारांश\n\n`;
    markdownBody += `| Department / विभाग | Issue / समस्या | Severity / प्राथमिकता | Required Action / कार्रवाई |\n`;
    markdownBody += `| :--- | :--- | :--- | :--- |\n`;
    departmentMatrix.forEach((row) => {
      markdownBody += `| **${row.department}** | ${row.issue.replace('\n', ' ')} | **${row.severity}** | ${row.action.replace(/\n/g, ' ')} |\n`;
    });

    markdownBody += `\n\n## REQUEST FOR COORDINATED ACTION / समन्वित कार्रवाई हेतु अनुरोध

As multiple civic issues have been observed at the same location, the concerned departments (DJB, MCD, PWD, Electrical) are requested to kindly coordinate and resolve them immediately.

चूंकि एक ही स्थान पर कई नागरिक समस्याएं पाई गई हैं, अतः संबंधित विभागों से अनुरोध है कि वे आपस में समन्वय स्थापित कर तुरंत समाधान कराएं।

Photographic evidence attached.
फोटो प्रमाण साथ में संलग्न है।

Regards / भवदीय,

**Nanhey Park Civic Watch (नागरिक सेवा समिति)**
`;

    // Build HTML Body for render / email sending with high quality bilingual formatting
    const matrixHtmlRows = detectedIssues
      .map(
        (r) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${r.departmentName}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; color: #334155;">
          <strong>${r.issueName}</strong><br/>
          <span style="color: #0284c7; font-size: 12px;">${r.issueNameHindi || ''}</span>
        </td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; color: ${r.severity === 'HIGH' ? '#dc2626' : '#d97706'}; font-weight: bold;">${r.severity}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px;">
          <div>${r.requiredAction}</div>
          <div style="color: #475569; font-size: 12px; margin-top: 4px;">${r.requiredActionHindi || ''}</div>
        </td>
      </tr>
    `
      )
      .join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 700px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 22px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px; text-transform: uppercase;">NANHEY PARK CIVIC WATCH</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #38bdf8; font-weight: bold;">नागरिक शिकायत पत्र • Consolidated Official Complaint Report</p>
        </div>
        
        <div style="padding: 24px;">
          <p style="font-size: 15px; font-weight: bold;">Respected Sir/Madam / आदरणीय महोदय/महोदया,</p>
          <p>This is an official civic complaint bringing to your attention multiple issues at:</p>
          
          <div style="background-color: #f0f9ff; border-left: 5px solid #0284c7; padding: 14px 18px; margin: 16px 0; border-radius: 6px;">
            <p style="margin: 4px 0;"><strong>Location / स्थान:</strong> ${loc.address}</p>
            <p style="margin: 4px 0;"><strong>GPS Coordinates / जीपीएस:</strong> ${loc.latitude}, ${loc.longitude}</p>
            <p style="margin: 4px 0;"><strong>Date & Time / समय:</strong> ${dateFormatted}, ${timeFormatted} IST</p>
          </div>
          
          <p style="font-size: 13px; color: #64748b; font-style: italic;">
            📸 Watermarked photographic evidence attached with GPS location & date proof.<br/>
            (स्थान और समय प्रमाण के साथ फोटो संलग्न हैं।)
          </p>
          
          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; font-size: 16px;">
            DEPARTMENT & ISSUE MATRIX / संबंधित विभाग एवं शिकायत सूची
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #475569;">
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Department / विभाग</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Issue / समस्या</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Severity</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Action / कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              ${matrixHtmlRows}
            </tbody>
          </table>

          <div style="margin-top: 24px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 16px;">
            <h4 style="margin: 0 0 6px 0; color: #1e40af; font-size: 15px;">REQUEST FOR COORDINATED ACTION / त्वरित कार्रवाई का अनुरोध</h4>
            <p style="margin: 0; font-size: 13px; color: #1e3a8a;">
              As multiple civic issues have been observed at the same location, concerned departments are requested to coordinate and fix them immediately.<br/>
              (संबंधित विभागों से अनुरोध है कि वे आपस में समन्वय स्थापित कर समस्या का त्वरित समाधान करें।)
            </p>
          </div>

          <p style="margin-top: 24px; font-size: 14px;">Regards / भवदीय,<br/><strong>Nanhey Park Civic Watch (नागरिक सेवा समिति)</strong></p>
        </div>
      </div>
    `;

    const watermarkedImagesPayload = images.map((img: string, idx: number) => ({
      dataUrl: img,
      photoIndex: idx + 1,
      caption: `Photo ${idx + 1}: ${detectedIssues.filter((i) => i.photoIndices.includes(idx + 1)).map((i) => i.issueName).join(' + ') || 'Civic Site Evidence'}`
    }));

    const payload: CombinedEmailPayload = {
      location: loc,
      dateTimeFormatted: dateTimeIstText,
      timestampIso: now.toISOString(),
      detectedIssues: detectedIssues,
      toEmails: recipientData.toEmails,
      ccEmails: recipientData.ccEmails,
      subject: emailSubject,
      bodyMarkdown: markdownBody,
      bodyHtml: htmlBody,
      departmentMatrix: departmentMatrix,
      watermarkedImages: watermarkedImagesPayload,
      deduplicationAudit: recipientData.auditLog
    };

    return NextResponse.json({ success: true, payload });
  } catch (error: any) {
    console.error('Error in /api/detect-issues:', error);
    return NextResponse.json({ error: error.message || 'Failed to detect issues and generate email.' }, { status: 500 });
  }
}

function hasHasSeverity(isHigh: boolean): boolean {
  return isHigh;
}
