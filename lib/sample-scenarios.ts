import { SampleScenario } from './types';

// Helper to generate clear SVG data URLs for sample civic photos
function createSampleSvgPhoto(title: string, subtitle: string, bgColor: string, accentColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="${bgColor}"/>
    <!-- Ground / Road representation -->
    <rect y="380" width="800" height="220" fill="#1e293b"/>
    <line x1="0" y1="480" x2="800" y2="480" stroke="#f59e0b" stroke-dasharray="20,20" stroke-width="4"/>
    
    <!-- Graphic Illustration -->
    <g transform="translate(100, 120)">
      <!-- Symbol circle -->
      <circle cx="300" cy="140" r="100" fill="${accentColor}" opacity="0.2"/>
      <circle cx="300" cy="140" r="80" stroke="${accentColor}" stroke-width="6" fill="none"/>
      
      <!-- Issue visual icon graphic -->
      <path d="M 280 100 L 320 100 L 320 180 L 280 180 Z" fill="${accentColor}"/>
      <circle cx="300" cy="205" r="8" fill="${accentColor}"/>
    </g>
    
    <!-- Text Labels -->
    <text x="400" y="440" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="400" y="475" font-family="system-ui, sans-serif" font-size="18" fill="#cbd5e1" text-anchor="middle">${subtitle}</text>
    
    <rect x="20" y="20" width="220" height="36" rx="6" fill="#0f172a" opacity="0.8"/>
    <text x="35" y="44" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">E BLOCK, NANHEY PARK</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const SAMPLE_CIVIC_SCENARIOS: SampleScenario[] = [
  {
    id: 'nanhey-park-triple-issue',
    title: 'Nanhey Park Triple Issue (DJB + MCD + Electrical)',
    description: 'Photo capturing sewer overflow, accumulated garbage dump, and broken non-functional streetlight at E Block Matiala.',
    location: {
      address: 'E Block, Nanhey Park, Matiala, New Delhi',
      latitude: 28.6083,
      longitude: 77.0425,
      area: 'Nanhey Park, Matiala',
      city: 'New Delhi'
    },
    imageUrls: [
      createSampleSvgPhoto('Sewer Overflow + Garbage Dump', 'E Block Roadway, Nanhey Park', '#0f172a', '#ef4444'),
      createSampleSvgPhoto('Broken Streetlight & Pole', 'Opposite Plot 42, Nanhey Park', '#1e1b4b', '#f59e0b')
    ],
    expectedIssues: ['Sewer Overflow (DJB)', 'Garbage Accumulation (MCD)', 'Broken Streetlight (Electrical Authority)']
  },
  {
    id: 'matiala-drainage-manhole',
    title: 'Drain Overflow & Open Manhole (DJB + PWD)',
    description: 'Damaged drain structure, overflowing sewage water, and uncovered hazardous manhole on main road.',
    location: {
      address: 'Main Road, Near Subcity Gate, Matiala, New Delhi',
      latitude: 28.6112,
      longitude: 77.0401,
      area: 'Matiala Subcity',
      city: 'New Delhi'
    },
    imageUrls: [
      createSampleSvgPhoto('Overflowing Drain & Open Manhole', 'Main Sector Road, Matiala', '#111827', '#06b6d4')
    ],
    expectedIssues: ['Sewer & Water Line Leak (DJB)', 'Open Manhole & Road Hazard (PWD)']
  }
];
