import { CombinedEmailPayload, DetectedIssue, LocationData } from './types';
import { buildCombinedRecipientList, OFFICIAL_DEPARTMENT_DIRECTORY } from './directory';

/**
 * Client-Side Emergency Report Generator.
 * Used as a zero-downtime fallback if Vercel serverless functions hit payload limits or network errors.
 */
export function generateClientReportPayload(
  images: string[],
  location: LocationData,
  userNote: string,
  residentName: string
): CombinedEmailPayload {
  const loc = location || {
    address: 'E Block, Nanhey Park, Matiala, New Delhi',
    latitude: 28.6083,
    longitude: 77.0425,
    area: 'Nanhey Park, Matiala',
    city: 'New Delhi'
  };

  const senderName = residentName && residentName.trim() !== '' ? residentName.trim() : 'सचेत नागरिक (Concerned Resident)';

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  const dateTimeIstText = `${dateFormatted}, ${timeFormatted} IST`;

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

  const detectedIssues: DetectedIssue[] = [];

  if (isRoad) detectedIssues.push(dsiidcRoadIssue);
  if (isWater) detectedIssues.push(djbWaterIssue);
  if (isGarbage) detectedIssues.push(mcdGarbageIssue);
  if (isLight) detectedIssues.push(electricalLightIssue);

  if (!isRoad) detectedIssues.push({ ...dsiidcRoadIssue, severity: 'MEDIUM' });
  if (!isWater) detectedIssues.push({ ...djbWaterIssue, severity: 'MEDIUM' });
  if (!isGarbage) detectedIssues.push({ ...mcdGarbageIssue, severity: 'MEDIUM' });

  const detectedDepartmentCodes = Array.from(new Set(detectedIssues.map((i) => i.departmentCode)));
  const recipientData = buildCombinedRecipientList(detectedDepartmentCodes);

  const primaryIssue = detectedIssues[0];
  const locationShort = loc.area ? `${loc.area}, ${loc.city}` : loc.address;
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

  const watermarkedImagesPayload = images.map((img: string, idx: number) => ({
    dataUrl: img,
    photoIndex: idx + 1,
    caption: `Photo ${idx + 1}: ${detectedIssues.filter((i) => i.photoIndices.includes(idx + 1)).map((i) => i.issueName).join(' + ') || 'Civic Site Evidence'}`
  }));

  return {
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
}
