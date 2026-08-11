export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  area: string;
  city: string;
}

export interface DetectedIssue {
  id: string;
  issueName: string;
  issueNameHindi?: string;
  departmentCode: string; // e.g., 'DJB', 'MCD', 'ELECTRICAL', 'PWD', 'TRAFFIC'
  departmentName: string; // e.g., 'Delhi Jal Board', 'Municipal Corporation of Delhi (MCD)'
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  observation: string;
  observationHindi?: string;
  requiredAction: string;
  requiredActionHindi?: string;
  photoIndices: number[]; // e.g. [1, 2]
}

export interface DepartmentContact {
  departmentCode: string;
  departmentName: string;
  primaryEmails: string[];
  secondaryEmails: string[];
  grievanceEmails: string[];
  ministerialEmails: string[];
  officerTitles: string[];
}

export interface EscalationContact {
  name: string;
  designation: string;
  email: string;
  isEscalation: boolean;
}

export interface CombinedEmailPayload {
  location: LocationData;
  dateTimeFormatted: string; // e.g., '11 Aug 2026, 03:09 PM IST'
  timestampIso: string;
  detectedIssues: DetectedIssue[];
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  bodyMarkdown: string;
  bodyHtml: string;
  departmentMatrix: {
    department: string;
    issue: string;
    severity: string;
    action: string;
  }[];
  watermarkedImages: {
    dataUrl: string;
    photoIndex: number;
    caption: string;
  }[];
  deduplicationAudit: {
    originalCount: number;
    deduplicatedCount: number;
    removedDuplicates: string[];
  };
}

export interface SampleScenario {
  id: string;
  title: string;
  description: string;
  location: LocationData;
  imageUrls: string[];
  expectedIssues: string[];
}
