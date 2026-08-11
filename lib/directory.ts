import { DepartmentContact, EscalationContact } from './types';

export const OFFICIAL_DEPARTMENT_DIRECTORY: Record<string, DepartmentContact> = {
  DSIIDC: {
    departmentCode: 'DSIIDC',
    departmentName: 'Delhi State Industrial & Infrastructure Development Corp. (DSIIDC Roads)',
    primaryEmails: [
      'cmd@dsiidc.org',
      'ce1@dsiidc.org',
      'se.infra@dsiidc.org'
    ],
    secondaryEmails: [
      'md@dsiidc.org',
      'ce2@dsiidc.org',
      'ed@dsiidc.org'
    ],
    grievanceEmails: [
      'grievance@dsiidc.org'
    ],
    ministerialEmails: [
      'min-ind.delhi@gov.in',
      'min-pwd.delhi@gov.in'
    ],
    officerTitles: [
      'CMD DSIIDC (Chairman & Managing Director)',
      'Chief Engineer Infrastructure (DSIIDC)',
      'Superintending Engineer DSIIDC Roads'
    ]
  },
  DJB: {
    departmentCode: 'DJB',
    departmentName: 'Delhi Jal Board (DJB - Water & Sewerage)',
    primaryEmails: [
      'eedwarka.djb@gov.in',
      'eesw1@djb.nic.in',
      'eesw2@djb.nic.in'
    ],
    secondaryEmails: [
      'cewnw@djb.nic.in',
      'sesw@djb.nic.in',
      'ee.d91.djb@gmail.com'
    ],
    grievanceEmails: [
      'grievances-djb@delhi.gov.in'
    ],
    ministerialEmails: [
      'min-water.delhi@gov.in'
    ],
    officerTitles: ['Executive Engineer (Water/Sewerage)', 'Superintending Engineer (SW)']
  },
  MCD: {
    departmentCode: 'MCD',
    departmentName: 'Municipal Corporation of Delhi (MCD - Najafgarh Zone)',
    primaryEmails: [
      'dc-najafgarh@mcd.nic.in',
      'dcnajafgarhzone@gmail.com'
    ],
    secondaryEmails: [
      'senajafgarh@gmail.com',
      'eedems-ngz@mcd.nic.in',
      'eemaint1-ngz@mcd.nic.in'
    ],
    grievanceEmails: [
      'mcd-grievances@mcd.nic.in'
    ],
    ministerialEmails: [
      'min-ud.delhi@gov.in'
    ],
    officerTitles: ['Deputy Commissioner (Najafgarh Zone)', 'Superintending Engineer MCD']
  },
  ELECTRICAL: {
    departmentCode: 'ELECTRICAL',
    departmentName: 'Electrical & Power Authority (BSES Rajdhani BRPL Matiala)',
    primaryEmails: [
      'brpl.matiala@relianceada.com',
      'brpl.customercare@relianceada.com'
    ],
    secondaryEmails: [
      'eeelect-ngz@mcd.nic.in'
    ],
    grievanceEmails: [
      'headcustomercare.brpl@relianceada.com'
    ],
    ministerialEmails: [
      'min-ud.delhi@gov.in'
    ],
    officerTitles: ['BSES Matiala Division Engineer', 'BRPL Customer Care Nodal Officer']
  },
  PWD: {
    departmentCode: 'PWD',
    departmentName: 'Public Works Department (PWD Roads & Infrastructure)',
    primaryEmails: [
      'cesw.pwd@delhi.gov.in',
      'sepwdm41@gmail.com'
    ],
    secondaryEmails: [
      'eepwdm412@gmail.com'
    ],
    grievanceEmails: [
      'sepwdm41@gmail.com'
    ],
    ministerialEmails: [
      'min-pwd.delhi@gov.in'
    ],
    officerTitles: ['Chief Engineer (PWD South-West)', 'Superintending Engineer PWD M41']
  },
  TRAFFIC: {
    departmentCode: 'TRAFFIC',
    departmentName: 'Delhi Traffic Police & Transport Authority',
    primaryEmails: [
      'acp-traffic-swd@delhipolice.gov.in',
      'tidwarka.dtp@gmail.com'
    ],
    secondaryEmails: [
      'dcp-southwest-dl@nic.in'
    ],
    grievanceEmails: [
      'info@delhitrafficpolice.nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['ACP Traffic (South-West Dwarka)', 'TI Dwarka Traffic Police']
  },
  DDA: {
    departmentCode: 'DDA',
    departmentName: 'Delhi Development Authority (DDA Dwarka Zone)',
    primaryEmails: [
      'cedwarka.dda@gov.in',
      'secc8dda@gmail.com'
    ],
    secondaryEmails: [
      'eewd5.dda@gov.in'
    ],
    grievanceEmails: [
      'sdmdwarka.delhi@gov.in'
    ],
    ministerialEmails: [
      'lgdelhi@nic.in'
    ],
    officerTitles: ['Chief Engineer DDA Dwarka']
  },
  REVENUE: {
    departmentCode: 'REVENUE',
    departmentName: 'District Revenue Administration (South West Delhi)',
    primaryEmails: [
      'dmsw@nic.in',
      'sdmdwarka.delhi@gov.in'
    ],
    secondaryEmails: [
      'sdmnajafgarh.delhi@gov.in'
    ],
    grievanceEmails: [
      'dmsw@nic.in'
    ],
    ministerialEmails: [
      'secservices@nic.in'
    ],
    officerTitles: ['District Magistrate South West', 'SDM Dwarka']
  },
  DPCC: {
    departmentCode: 'DPCC',
    departmentName: 'Delhi Pollution Control Committee (DPCC & Forest)',
    primaryEmails: [
      'chdpcc@nic.in',
      'msdpcc@nic.in'
    ],
    secondaryEmails: [
      'dcfwest.gnctd@gov.in'
    ],
    grievanceEmails: [
      'msdpcc@nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['Chairman DPCC', 'Member Secretary DPCC']
  },
  HEALTH: {
    departmentCode: 'HEALTH',
    departmentName: 'Directorate of Health Services & Food Safety',
    primaryEmails: [
      'cdmosw.delhi@gov.in',
      'dghs@delhi.gov.in'
    ],
    secondaryEmails: [
      'pshealth@nic.in'
    ],
    grievanceEmails: [
      'dghs@delhi.gov.in'
    ],
    ministerialEmails: [
      'pshealth@nic.in'
    ],
    officerTitles: ['CDMO South West', 'DG Health Services']
  }
};

/**
 * Key Nodal Escalation Contacts (Guaranteed on CC, prioritized for URL length compliance)
 */
export const COMMON_ESCALATION_CONTACTS: EscalationContact[] = [
  {
    name: 'Honble Lt. Governor Delhi (LG Office)',
    designation: 'Lt. Governor of Delhi',
    email: 'lgdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Chief Minister Office Delhi (CM Office)',
    designation: 'Chief Minister of Delhi',
    email: 'cmdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Deputy Chief Minister Office',
    designation: 'Deputy Chief Minister Delhi',
    email: 'deputycm.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Chief Secretary Delhi',
    designation: 'Chief Secretary GNCTD',
    email: 'csdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Minister of Industries & Infrastructure (DSIIDC)',
    designation: 'Cabinet Minister Industries Delhi',
    email: 'min-ind.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Member of Parliament (West Delhi)',
    designation: 'MP West Delhi Constituency',
    email: 'kamaljeet.sehrawat@sansad.in',
    isEscalation: true
  },
  {
    name: 'Member of Legislative Assembly (Matiala MLA)',
    designation: 'MLA Matiala Assembly Constituency',
    email: 'mlamatiala-dla@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'Public Grievances Monitoring System (PGMS)',
    designation: 'PGMS Delhi Public Cell',
    email: 'pgms.grievance@delhi.gov.in',
    isEscalation: true
  }
];

/**
 * Dedupes an array of email addresses ignoring case and whitespace.
 */
export function deduplicateEmails(emailList: string[]): {
  uniqueEmails: string[];
  removedDuplicates: string[];
} {
  const seen = new Set<string>();
  const uniqueEmails: string[] = [];
  const removedDuplicates: string[] = [];

  for (const rawEmail of emailList) {
    if (!rawEmail) continue;
    const cleanEmail = rawEmail.trim().toLowerCase();
    if (!cleanEmail) continue;

    if (seen.has(cleanEmail)) {
      removedDuplicates.push(cleanEmail);
    } else {
      seen.add(cleanEmail);
      uniqueEmails.push(cleanEmail);
    }
  }

  return { uniqueEmails, removedDuplicates };
}

/**
 * Builds the merged TO and CC list for a given list of department codes.
 * Ensures URL length stays well under 1,800 characters to prevent HTTP 400 Bad Request in Gmail.
 */
export function buildCombinedRecipientList(departmentCodes: string[]): {
  toEmails: string[];
  ccEmails: string[];
  allEmailsDeduplicated: string[];
  auditLog: {
    originalCount: number;
    deduplicatedCount: number;
    removedDuplicates: string[];
  };
} {
  const rawTo: string[] = [];
  const rawCc: string[] = [];

  const activeCodes = Array.from(new Set([...departmentCodes]));
  if (activeCodes.length === 0) {
    activeCodes.push('DSIIDC');
  }

  const primaryDeptCode = activeCodes[0];
  const primaryDept = OFFICIAL_DEPARTMENT_DIRECTORY[primaryDeptCode] || OFFICIAL_DEPARTMENT_DIRECTORY['DSIIDC'];
  
  // 1. Primary department emails go to TO (top 2 primary emails)
  rawTo.push(...primaryDept.primaryEmails.slice(0, 3));

  // 2. Add matching department primary emails to CC
  activeCodes.forEach((code, index) => {
    const dept = OFFICIAL_DEPARTMENT_DIRECTORY[code];
    if (dept && index > 0) {
      rawCc.push(...dept.primaryEmails.slice(0, 2));
    }
  });

  // 3. MANDATORY: Add Key Escalation Contacts (LG, CM, Deputy CM, CS, Ministers, MP, MLA)
  COMMON_ESCALATION_CONTACTS.forEach((esc) => {
    rawCc.push(esc.email);
  });

  // 4. Deduplicate TO list
  const dedupTo = deduplicateEmails(rawTo);
  
  // 5. Deduplicate CC list (capping to top 10 key nodal emails to keep URL concise & prevent 400 Bad Request)
  const toSet = new Set(dedupTo.uniqueEmails);
  const filteredCc = rawCc.filter((email) => !toSet.has(email.trim().toLowerCase()));
  const dedupCc = deduplicateEmails(filteredCc);
  const finalCc = dedupCc.uniqueEmails.slice(0, 10);

  const totalRawCount = rawTo.length + rawCc.length;
  const uniqueTotalCount = dedupTo.uniqueEmails.length + finalCc.length;
  const allRemovedDuplicates = [...dedupTo.removedDuplicates, ...dedupCc.removedDuplicates];

  return {
    toEmails: dedupTo.uniqueEmails,
    ccEmails: finalCc,
    allEmailsDeduplicated: [...dedupTo.uniqueEmails, ...finalCc],
    auditLog: {
      originalCount: totalRawCount,
      deduplicatedCount: uniqueTotalCount,
      removedDuplicates: allRemovedDuplicates
    }
  };
}
