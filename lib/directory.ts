import { DepartmentContact, EscalationContact } from './types';

export const OFFICIAL_DEPARTMENT_DIRECTORY: Record<string, DepartmentContact> = {
  DSIIDC: {
    departmentCode: 'DSIIDC',
    departmentName: 'Delhi State Industrial & Infrastructure Development Corp. (DSIIDC Roads)',
    primaryEmails: [
      'cmd@dsiidc.org',
      'md@dsiidc.org',
      'ce1@dsiidc.org',
      'ce2@dsiidc.org',
      'se.infra@dsiidc.org'
    ],
    secondaryEmails: [
      'ed@dsiidc.org',
      'eepwdm412@gmail.com',
      'eemaint1-ngz@mcd.nic.in'
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
      'Superintending Engineer DSIIDC Roads',
      'Minister of Industries & Infrastructure'
    ]
  },
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
      'sdmdwarka.delhi@gov.in'
    ],
    ministerialEmails: [
      'lgdelhi@nic.in'
    ],
    officerTitles: ['Chief Engineer DDA Dwarka', 'Superintending Engineer DDA', 'Executive Engineer DDA WD5']
  },
  REVENUE: {
    departmentCode: 'REVENUE',
    departmentName: 'District Revenue Administration (South West Delhi)',
    primaryEmails: [
      'dmsw@nic.in',
      'sdmdwarka.delhi@gov.in',
      'sdmnajafgarh.delhi@gov.in'
    ],
    secondaryEmails: [
      'acp-traffic-swd@delhipolice.gov.in'
    ],
    grievanceEmails: [
      'dmsw@nic.in'
    ],
    ministerialEmails: [
      'secservices@nic.in'
    ],
    officerTitles: ['District Magistrate South West', 'SDM Dwarka', 'SDM Najafgarh']
  },
  DPCC: {
    departmentCode: 'DPCC',
    departmentName: 'Delhi Pollution Control Committee (DPCC & Forest)',
    primaryEmails: [
      'chdpcc@nic.in',
      'msdpcc@nic.in',
      'skgoyal.dpcc@nic.in',
      'amitchaurdhary.dpcc@nic.in'
    ],
    secondaryEmails: [
      'dcfwest.gnctd@gov.in',
      'dcfhq.gnctd@gov.in'
    ],
    grievanceEmails: [
      'msdpcc@nic.in'
    ],
    ministerialEmails: [
      'cmdelhi@nic.in'
    ],
    officerTitles: ['Chairman DPCC', 'Member Secretary DPCC', 'DCF Forest West Delhi']
  },
  HEALTH: {
    departmentCode: 'HEALTH',
    departmentName: 'Directorate of Health Services & Food Safety',
    primaryEmails: [
      'cdmosw.delhi@gov.in',
      'dghs@delhi.gov.in',
      'pshealth@nic.in'
    ],
    secondaryEmails: [
      'acsw.food@delhi.gov.in',
      'dirfoodsafety.delhi@gov.in'
    ],
    grievanceEmails: [
      'dghs@delhi.gov.in'
    ],
    ministerialEmails: [
      'pshealth@nic.in'
    ],
    officerTitles: ['CDMO South West', 'DG Health Services', 'Director Food Safety']
  }
};

/**
 * High Priority Nodal & Escalation Contacts guaranteed on CC
 */
export const COMMON_ESCALATION_CONTACTS: EscalationContact[] = [
  {
    name: 'Honble Lt. Governor Delhi (LG Office)',
    designation: 'Lt. Governor of Delhi',
    email: 'lgdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Secretary to Honble Lt. Governor',
    designation: 'Secretary to LG',
    email: 'secretarytolg@gmail.com',
    isEscalation: true
  },
  {
    name: 'Chief Minister Office Delhi (CM Office)',
    designation: 'Chief Minister of Delhi',
    email: 'cmdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'CM Office Official Cell',
    designation: 'CM Secretariat Delhi',
    email: 'cm.office@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'Deputy Chief Minister Office',
    designation: 'Deputy Chief Minister Delhi',
    email: 'deputycm.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Deputy CM Secretariat',
    designation: 'Deputy CM Secretariat',
    email: 'deputycm.office@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'Chief Secretary Delhi',
    designation: 'Chief Secretary GNCTD',
    email: 'csdelhi@nic.in',
    isEscalation: true
  },
  {
    name: 'Minister of Urban Development',
    designation: 'Cabinet Minister UD Delhi',
    email: 'min-ud.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Minister of Public Works Department',
    designation: 'Cabinet Minister PWD Delhi',
    email: 'min-pwd.delhi@gov.in',
    isEscalation: true
  },
  {
    name: 'Minister of Water & Sewerage',
    designation: 'Cabinet Minister Water Delhi',
    email: 'min-water.delhi@gov.in',
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
    name: 'MP Office West Delhi Email 2',
    designation: 'MP West Delhi Nodal',
    email: 'mpwestdelhi@gmail.com',
    isEscalation: true
  },
  {
    name: 'Member of Legislative Assembly (Matiala MLA)',
    designation: 'MLA Matiala Assembly Constituency',
    email: 'mlamatiala-dla@delhi.gov.in',
    isEscalation: true
  },
  {
    name: 'MLA Matiala Office Email 2',
    designation: 'MLA Matiala Nodal',
    email: 'mla.matiala@gmail.com',
    isEscalation: true
  },
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
 * Ensures the FIRST department in departmentCodes gets TO status.
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

  // Ensure active departments always include DSIIDC or primary municipal if empty
  const activeCodes = Array.from(new Set([...departmentCodes]));
  if (activeCodes.length === 0) {
    activeCodes.push('DSIIDC');
  }

  const primaryDeptCode = activeCodes[0];
  const primaryDept = OFFICIAL_DEPARTMENT_DIRECTORY[primaryDeptCode] || OFFICIAL_DEPARTMENT_DIRECTORY['DSIIDC'];
  
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
