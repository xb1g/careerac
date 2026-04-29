import fs from 'fs';
import path from 'path';

const outDir = 'public/logos-jony-ive';
fs.mkdirSync(outDir, { recursive: true });

const svgs = [
  // 1. The Superellipse & Absolute Minimalism (Silver/White)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#F5F5F7" />
    <g transform="translate(50, 60)" fill="none" stroke="#1D1D1F" stroke-width="2.5" stroke-linecap="round">
      <path d="M -25, 10 Q 0, -25 25, 10" />
      <path d="M -15, -15 A 20 20 0 0 1 15, -15" />
      <path d="M -25, -28 A 35 35 0 0 1 25, -28" />
    </g>
  </svg>`,

  // 2. The Dark Mode Glow (Deep Black, subtle blue tint)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#000000" />
    <g transform="translate(50, 55)" fill="none" stroke-linecap="round">
      <path d="M -30, 15 C -10, -20 10, -20 30, 15" stroke="#333333" stroke-width="3" />
      <path d="M -12, -10 A 18 18 0 0 1 12, -10" stroke="#0A84FF" stroke-width="3" />
      <path d="M -22, -22 A 32 32 0 0 1 22, -22" stroke="#5E5CE6" stroke-width="3" />
    </g>
  </svg>`,

  // 3. Frosted Glass Intersection
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E2E2E5" />
        <stop offset="100%" stop-color="#C7C7CC" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22.5" fill="url(#grad3)" />
    <circle cx="35" cy="65" r="25" fill="#FFFFFF" fill-opacity="0.4" />
    <circle cx="65" cy="65" r="25" fill="#FFFFFF" fill-opacity="0.4" />
    <g transform="translate(50, 45)" fill="none" stroke="#8E8E93" stroke-width="2">
      <path d="M -15, 0 A 15 15 0 0 1 15, 0" />
      <path d="M -25, -12 A 28 28 0 0 1 25, -12" />
    </g>
  </svg>`,

  // 4. One Continuous Thread
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#FFFFFF" />
    <path d="M 25, 70 C 25, 40 75, 40 75, 70 C 75, 20 25, 20 25, -10" stroke="#007AFF" stroke-width="4" stroke-linecap="round" fill="none" transform="translate(0, 15) scale(1, 0.8)" />
    <circle cx="75" cy="40" r="3" fill="#007AFF" />
  </svg>`,

  // 5. Perfect Circles (Golden Ratio approximation)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#1C1C1E" />
    <g fill="none" stroke="#E5E5EA" stroke-width="1.5">
      <circle cx="50" cy="65" r="20" opacity="0.3" />
      <circle cx="50" cy="45" r="32" opacity="0.5" />
      <circle cx="50" cy="25" r="52" opacity="0.1" />
      <path d="M 30, 65 A 20 20 0 0 1 70, 65" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
      <path d="M 18, 45 A 32 32 0 0 1 82, 45" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    </g>
  </svg>`,

  // 6. Subtractive Negative Space
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#0A84FF" />
    <g fill="#FFFFFF">
      <path d="M 15, 70 Q 50, 20 85, 70 L 90, 70 Q 50, 10 10, 70 Z" />
      <path d="M 35, 40 A 25 25 0 0 1 65, 40 L 70, 40 A 30 30 0 0 0 30, 40 Z" />
    </g>
    <circle cx="50" cy="30" r="4" fill="#FFFFFF" />
  </svg>`,

  // 7. Pure Geometry - The Dot and Two Arcs
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#F2F2F7" />
    <g transform="translate(50, 50)" fill="none" stroke="#1C1C1E" stroke-width="3.5" stroke-linecap="round">
      <path d="M -20, 15 Q 0, -10 20, 15" />
      <path d="M -20, -5 Q 0, -30 20, -5" stroke="#8E8E93" />
      <circle cx="0" cy="25" r="3.5" fill="#1C1C1E" stroke="none" />
    </g>
  </svg>`,

  // 8. Titanium Mesh Gradient
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D1D1D6" />
        <stop offset="50%" stop-color="#AEAEB2" />
        <stop offset="100%" stop-color="#8E8E93" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22.5" fill="url(#titanium)" />
    <g transform="translate(50, 55)" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.8" stroke-linecap="round">
      <path d="M -30, 15 C -15, -15 15, -15 30, 15" />
      <path d="M -15, -5 A 25 25 0 0 1 15, -5" />
      <path d="M -25, -18 A 38 38 0 0 1 25, -18" />
    </g>
  </svg>`,

  // 9. Offset Concentric Shift
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22.5" fill="#000000" />
    <g fill="none" stroke-width="1.5" stroke-linecap="round">
      <path d="M 20, 60 A 35 35 0 0 1 80, 60" stroke="#32D74B" />
      <path d="M 30, 50 A 25 25 0 0 1 70, 50" stroke="#FFD60A" />
      <path d="M 40, 40 A 15 15 0 0 1 60, 40" stroke="#FF9F0A" />
      <path d="M 10, 80 Q 50, 30 90, 80" stroke="#FF453A" stroke-width="2" />
    </g>
  </svg>`,

  // 10. The Absolute Void (White on White with Shadow)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <filter id="shadow10" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.1" />
      </filter>
    </defs>
    <rect width="100" height="100" rx="22.5" fill="#FFFFFF" />
    <g transform="translate(50, 60)" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" filter="url(#shadow10)">
      <path d="M -25, 5 Q 0, -25 25, 5" />
      <path d="M -15, -15 A 25 25 0 0 1 15, -15" />
      <circle cx="0" cy="-35" r="4" fill="#FFFFFF" />
    </g>
  </svg>`
];

svgs.forEach((svg, i) => {
  const filePath = path.join(outDir, `logo-jony-${i + 1}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${filePath}`);
});
