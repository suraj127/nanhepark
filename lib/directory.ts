import { DepartmentContact, EscalationContact } from './types';

export const OFFICIAL_DEPARTMENT_DIRECTORY: Record<string, DepartmentContact> = {
  DJB: {
    departmentCode: 'DJB',
    departmentName: 'Delhi Jal Board (DJB - Water & Sewerage)',
    primaryEmails: [
      'eew3@djb.nic.in',
      'eesw1@djb.nic.in',
      'eesw2@djb.nic.in',
      'eesw3@djb.nic.in',
      'eedwarka.djb@gov.in',
      'ee.d91.djb@gmail.com'
    ],
    secondaryEmails: [
      'cewnw@djb.nic.in',
      'ces@djb.nic.in',
      'sesw@djb.nic.in',
      'sew@djb.nic.in',
      'sedpssw@djb.nic.in',
      'eewtpd@djb.nic.in',
      'eeemw@djb.nic.in',
      'eeemsw@djb.nic.in',
      'eecpsw@djb.nic.in',
      'jtdirsouth@djb.nic.in',
      'jtdirwest@djb.nic.in',
      'aosouthwest@djb.nic.in',
      'aowest@djb.nic.in',
      'aopdssw@djb.nic.in',
      'aopdwe@djb.nic.in',
      'kdisp@djb.nic.in',
      'nadisp@djb.nic.in',
      'eewest3.djb@gmail.com',
      'eem26.djb@gov.in'
    ],
    grievanceEmails: [
      'grievances-djb@delhi.gov.in',
      'memberwater.djb@nic.in',
      'membersewer.djb@nic.in'
    ],
    ministerialEmails: [
      'min-water.delhi@gov.in'
    ],
    officerTitles: ['Executive Engineer (Water/Sewerage)', 'Superintending Engineer (SW)', 'Member Water / Sewer', 'Grievance Cell DJB']
  },
  MCD: {
    departmentCode: 'MCD',
    departmentName: 'Municipal Corporation of Delhi (MCD - Najafgarh Zone)',
    primaryEmails: [
      'dc-najafgarh@mcd.nic.in',
      'dcnajafgarhzone@gmail.com',
      'addlcomm-najafgarh@mcd.nic.in'
    ],
    secondaryEmails: [
      'senajafgarh@gmail.com',
      'senajafgarh2@mcd.nic.in',
      'eemaint1-ngz@mcd.nic.in',
      'eemaint2-ngz@mcd.nic.in',
      'demss-ngz@mcd.nic.in',
      'eedems-ngz@mcd.nic.in',
      'eebuilding1-ngz@mcd.nic.in',
      'eeelect-ngz@mcd.nic.in',
      'dhonajafgarhzone@gmail.com'
    ],
    grievanceEmails: [
      'mcd-grievances@mcd.nic.in',
      'controlroom-ngz@mcd.nic.in'
    ],
    ministerialEmails: [
      'min-ud.delhi@gov.in'
    ],
    officerTitles: ['Deputy Commissioner (Najafgarh Zone)', 'Superintending Engineer', 'Executive Engineer DEMS', 'MCD Control Room']
  },
  ELECTRICAL: {
    departmentCode: 'ELECTRICAL',
    departmentName: 'Electrical & Power Authority (BSES Rajdhani BRPL Matiala)',
    primaryEmails: [
      'brpl.matiala@relianceada.com',
      'brpl.customercare@relianceada.com'
    ],
    secondaryEmails: [
      'eeelect-ngz@mcd.nic.in',
      'eeemsw@djb.nic.in'
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
      'sepwdm41@gmail.com',
      'eepwdm412@gmail.com'
    ],
    secondaryEmails: [
      'ce2ifc.delhi@gov.in',
      'secircle3.ifc@gmail.com',
      'eeccd5ifc@gmail.com'
    ],
    grievanceEmails: [
      'sepwdm41@gmail.com'
    ],
    ministerialEmails: [
      'min-pwd.delhi@gov.in'
    ],
    officerTitles: ['Chief Engineer (PWD South-West)', 'Superintending Engineer PWD M41', 'Executive Engineer PWD M412']
  },
  TRAFFIC: {
    departmentCode: 'TRAFFIC',
    departmentName: 'Delhi Traffic Police & Transport Authority',
    primaryEmails: [
      'acp-traffic-swd@delhipolice.gov.in',
      'tidwarka.dtp@gmail.com',
      'info@delhitrafficpolice.nic.in'
    ],
    secondaryEmails: [
      'dcp-southwest-dl@nic.in',
      'dcptwr-dtp@delhipolice.gov.in',
      'dcptsr-dtp@delhipolice.gov.in',
      'psbindapur-dl@nic.in',
      'psuttamnagar-dl@nic.in',
      'mlojkp.trans@delhi.gov.in',
      'pstrans@nic.in'
    ],
    grievanceEmails: [
      'info@delhitrafficpolice.nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['ACP Traffic (South-West Dwarka)', 'TI Dwarka Traffic Police', 'DCP Traffic Operations']
  },
  DDA: {
    departmentCode: 'DDA',
    departmentName: 'Delhi Development Authority (DDA Dwarka Zone)',
    primaryEmails: [
      'cedwarka.dda@gov.in',
      'secc8dda@gmail.com',
      'eewd5.dda@gov.in'
    ],
    secondaryEmails: [
      'sdmdwarka.delhi@gov.in'
    ],
    grievanceEmails: [
      'secc8dda@gmail.com'
    ],
    ministerialEmails: [
      'min-ud.delhi@gov.in'
    ],
    officerTitles: ['Chief Engineer (DDA Dwarka)', 'Superintending Engineer DDA CC8', 'Executive Engineer WD5']
  },
  REVENUE: {
    departmentCode: 'REVENUE',
    departmentName: 'Revenue Department (District Magistrate & SDM South-West)',
    primaryEmails: [
      'dmsw@nic.in',
      'sdmdwarka.delhi@gov.in',
      'sdmnajafgarh.delhi@gov.in'
    ],
    secondaryEmails: [
      'secservices@nic.in',
      'jsservices@hub.nic.in'
    ],
    grievanceEmails: [
      'dmsw@nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['District Magistrate (South-West Delhi)', 'SDM Dwarka', 'SDM Najafgarh']
  },
  ENVIRONMENT: {
    departmentCode: 'ENVIRONMENT',
    departmentName: 'Delhi Pollution Control Committee (DPCC) & Forest Dept',
    primaryEmails: [
      'skgoyal.dpcc@nic.in',
      'amitchaurdhary.dpcc@nic.in',
      'chdpcc@nic.in',
      'msdpcc@nic.in'
    ],
    secondaryEmails: [
      'dcfwest.gnctd@gov.in',
      'dcfhq.gnctd@gov.in'
    ],
    grievanceEmails: [
      'chdpcc@nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['Chairman DPCC', 'Member Secretary DPCC', 'Deputy Conservator of Forests']
  },
  HEALTH_FOOD: {
    departmentCode: 'HEALTH_FOOD',
    departmentName: 'Health, Food Safety & Social Welfare Department',
    primaryEmails: [
      'cdmosw.delhi@gov.in',
      'dghs@delhi.gov.in',
      'pshealth@nic.in'
    ],
    secondaryEmails: [
      'acsw.food@delhi.gov.in',
      'dirfoodsafety.delhi@gov.in',
      'dswo-sw.delhi@gov.in',
      'ddewestb@gmail.com',
      'ddeswa@gmail.com'
    ],
    grievanceEmails: [
      'dghs@delhi.gov.in'
    ],
    ministerialEmails: [
      'pshealth@nic.in'
    ],
    officerTitles: ['Chief District Medical Officer (SW)', 'Director General Health Services', 'Director Food Safety']
  }
};

export const COMMON_ESCALATION_CONTACTS: EscalationContact[] = [
  // 1. LG OFFICE (Lieutenant Governor)
  {
    name: 'Lieutenant Governor Office (LG Secretariat Raj Niwas)',
    designation: 'Honorable Lieutenant Governor of Delhi',
    email: 'lgdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Secretary to LG Delhi',
    designation: 'Principal Secretary to LG Office',
    email: 'secretarytolg@gmail.com',
    isEscalation: true
  },

  // 2. CM OFFICE (Chief Minister)
  {
    name: 'Chief Minister Office (CMO Delhi)',
    designation: 'Honorable Chief Minister of Delhi',
    email: 'cmdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'CM Office Public Secretariat',
    designation: 'Chief Minister Office Delhi',
    email: 'cm.office@delhi.gov.in',
    isEscalation: true
  },

  // 3. DEPUTY CM OFFICE (Deputy Chief Minister)
  {
    name: 'Deputy Chief Minister Office',
    designation: 'Deputy Chief Minister Secretariat',
    email: 'deputycm.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Deputy CM Public Secretariat',
    designation: 'Deputy Chief Minister Office',
    email: 'deputycm.office@delhi.gov.in',
    isEscalation: true
  },

  // 4. CHIEF SECRETARY & PRINCIPAL SECRETARIES
  {
    name: 'Chief Secretary Office (CS Delhi)',
    designation: 'Chief Secretary, Govt of NCT of Delhi',
    email: 'csdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Principal Secretary (Urban Development)',
    designation: 'Department of Urban Development GNCTD',
    email: 'psud@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'Principal Secretary (PWD)',
    designation: 'Department of Public Works GNCTD',
    email: 'pspwd@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'Principal Secretary (Home)',
    designation: 'Department of Home GNCTD',
    email: 'secyhome@nic.in',
    isEscalation: true
  },

  // 5. CONCERNED CABINET MINISTERS
  {
    name: 'Minister for Urban Development',
    designation: 'Cabinet Minister Urban Development & MCD',
    email: 'min-ud.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Minister for Public Works (PWD)',
    designation: 'Cabinet Minister PWD & Roads',
    email: 'min-pwd.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Minister for Water & Jal Board',
    designation: 'Cabinet Minister Water & DJB',
    email: 'min-water.delhi@gov.in',
    isEscalation: true
  },

  // 6. PUBLIC ELECTED REPRESENTATIVES (MP & MLA)
  {
    name: 'Member of Parliament (MP West Delhi)',
    designation: 'Kamaljeet Sehrawat (MP West Delhi Constituency)',
    email: 'kamaljeet.sehrawat@sansad.in',
    isEscalation: true
  },
  {
    name: 'MP West Delhi Office',
    designation: 'MP West Delhi Public Cell',
    email: 'mpwestdelhi@gmail.com',
    isEscalation: true
  },
  {
    name: 'MLA Matiala Office',
    designation: 'MLA Matiala Assembly Constituency',
    email: 'mlamatiala-dla@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'MLA Matiala Secondary',
    designation: 'MLA Matiala Public Cell',
    email: 'mla.matiala@gmail.com',
    isEscalation: true
  },

  // 7. POLICE COMMISSIONER & PUBLIC GRIEVANCE CELLS
  {
    name: 'Commissioner of Police Delhi (CP Delhi)',
    designation: 'Commissioner of Police Delhi',
    email: 'cp.delhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Public Grievances Monitoring System (PGMS)',
    designation: 'PGMS Delhi Public Cell',
    email: 'pgms.grievance@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'CPGRAMS Central Public Grievances',
    designation: 'Central Public Grievance Portal',
    email: 'cpgrams@nic.in',
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
 * GUARANTEES that EVERY email report ALWAYS includes:
 * 1. LG Office (lgdelhi@nic.in, secretarytolg@gmail.com)
 * 2. CM Office (cmdelhi@nic.in, cm.office@delhi.gov.in)
 * 3. Deputy CM Office (deputycm.delhi@gov.in, deputycm.office@delhi.gov.in)
 * 4. Chief Secretary (csdelhi@nic.in)
 * 5. Concerned Cabinet Ministers (min-ud, min-pwd, min-water)
 * 6. Concerned Department Nodal Emails (MCD, DJB, PWD, BSES, etc.)
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

  // Ensure active departments always include primary municipal & DJB & PWD
  const activeCodes = Array.from(new Set([...departmentCodes, 'MCD']));

  const primaryDeptCode = activeCodes[0] || 'MCD';
  const primaryDept = OFFICIAL_DEPARTMENT_DIRECTORY[primaryDeptCode] || OFFICIAL_DEPARTMENT_DIRECTORY['MCD'];
  
  // 1. Primary department emails go to TO
  rawTo.push(...primaryDept.primaryEmails);

  // 2. Add all matching departments officials, secondary & grievance emails to CC
  activeCodes.forEach((code, index) => {
    const dept = OFFICIAL_DEPARTMENT_DIRECTORY[code];
    if (dept) {
      if (index > 0) {
        rawCc.push(...dept.primaryEmails);
      }
      rawCc.push(...dept.secondaryEmails);
      rawCc.push(...dept.grievanceEmails);
      rawCc.push(...dept.ministerialEmails);
    }
  });

  // 3. MANDATORY: ALWAYS add LG, CM, Deputy CM, Chief Secretary, Cabinet Ministers, MP, MLA to CC for EVERY report
  COMMON_ESCALATION_CONTACTS.forEach((esc) => {
    rawCc.push(esc.email);
  });

  // 4. Deduplicate TO list
  const dedupTo = deduplicateEmails(rawTo);
  
  // 5. Deduplicate CC list, removing any emails already in TO
  const toSet = new Set(dedupTo.uniqueEmails);
  const filteredCc = rawCc.filter((email) => !toSet.has(email.trim().toLowerCase()));
  const dedupCc = deduplicateEmails(filteredCc);

  const totalRawCount = rawTo.length + rawCc.length;
  const uniqueTotalCount = dedupTo.uniqueEmails.length + dedupCc.uniqueEmails.length;
  const allRemovedDuplicates = [...dedupTo.removedDuplicates, ...dedupCc.removedDuplicates];

  return {
    toEmails: dedupTo.uniqueEmails,
    ccEmails: dedupCc.uniqueEmails,
    allEmailsDeduplicated: [...dedupTo.uniqueEmails, ...dedupCc.uniqueEmails],
    auditLog: {
      originalCount: totalRawCount,
      deduplicatedCount: uniqueTotalCount,
      removedDuplicates: allRemovedDuplicates
    }
  };
}
