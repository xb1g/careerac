import fs from 'fs';
import path from 'path';

const outDir = 'public/logos';
fs.mkdirSync(outDir, { recursive: true });

const svgs = [
  // 1: Classic App Icon
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="bg1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#4F46E5"/>
        <stop offset="100%" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#bg1)" />
    <g transform="translate(50, 70)" stroke="white" stroke-width="6" stroke-linecap="round" fill="none">
      <!-- Arch -->
      <path d="M -30, 10 Q 0,-30 30, 10" />
      <!-- Central dot -->
      <circle cx="0" cy="0" r="5" fill="white" stroke="none" />
      <!-- Waves -->
      <path d="M -15,-15 A 21 21 0 0 1 15,-15" />
      <path d="M -30,-30 A 42 42 0 0 1 30,-30" />
    </g>
  </svg>`,

  // 2: Gradient Wave Bridge
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="grad2" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#2563EB"/>
        <stop offset="50%" stop-color="#38BDF8"/>
        <stop offset="100%" stop-color="#F472B6"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="#F8FAFC" rx="22" />
    <g transform="translate(50, 65)" stroke="url(#grad2)" stroke-width="8" stroke-linecap="round" fill="none">
      <path d="M -35, 15 Q 0,-30 35, 15" />
      <!-- Dot -->
      <circle cx="0" cy="-5" r="4" fill="url(#grad2)" stroke="none" />
      <!-- Waves radiating from dot -->
      <path d="M -12,-20 A 18 18 0 0 1 12,-20" stroke-width="6" />
      <path d="M -24,-35 A 35 35 0 0 1 24,-35" stroke-width="6" />
    </g>
  </svg>`,

  // 3: The 'C' and 'A' Concept
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="#0F172A" />
    <g transform="translate(50, 60)" stroke-width="7" stroke-linecap="round" fill="none">
      <!-- 'A' shaped Arch -->
      <path d="M -25, 20 L 0,-25 L 25, 20" stroke="#38BDF8" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="#38BDF8" />
      <!-- 'C' shaped radiating wave (rotated) -->
      <path d="M -35,-15 A 40 40 0 0 1 35,-15" stroke="#A78BFA" />
      <path d="M -20,-30 A 25 25 0 0 1 20,-30" stroke="#A78BFA" />
    </g>
  </svg>`,

  // 4: Thick Flat Colors
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#E0E7FF" />
    <g transform="translate(50, 75)" fill="none" stroke-width="10" stroke-linecap="round">
      <path d="M -30, 0 Q 0,-40 30, 0" stroke="#4338CA" />
      <circle cx="0" cy="0" r="8" fill="#4338CA" stroke="none" />
      <path d="M -18,-20 A 25 25 0 0 1 18,-20" stroke="#6366F1" />
      <path d="M -35,-35 A 45 45 0 0 1 35,-35" stroke="#818CF8" />
    </g>
  </svg>`,

  // 5: Dots and Nodes (Transfer Network)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#ffffff" rx="22" />
    <g transform="translate(50, 70)" stroke="#1E40AF" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round" fill="none">
      <path d="M -35, 10 Q 0,-40 35, 10" />
      <path d="M -20,-20 A 28 28 0 0 1 20,-20" stroke="#3B82F6" stroke-width="5" />
      <path d="M -35,-35 A 48 48 0 0 1 35,-35" stroke="#93C5FD" stroke-width="6" />
    </g>
    <!-- Solid nodes -->
    <circle cx="15" cy="80" r="4" fill="#1E40AF" />
    <circle cx="50" cy="30" r="4" fill="#1E40AF" />
    <circle cx="85" cy="80" r="4" fill="#1E40AF" />
    <circle cx="50" cy="65" r="6" fill="#3B82F6" />
  </svg>`,

  // 6: Monoline Elegant
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="#FAF5FF" />
    <g transform="translate(50, 75)" stroke="#6B21A8" stroke-width="2" fill="none">
      <path d="M -40, 0 C -20, -50 20, -50 40, 0" />
      <path d="M -30, 0 C -15, -35 15, -35 30, 0" />
      <!-- Waves -->
      <path d="M -15,-25 A 25 25 0 0 1 15,-25" />
      <path d="M -25,-40 A 40 40 0 0 1 25,-40" />
      <path d="M -35,-55 A 55 55 0 0 1 35,-55" />
      <circle cx="0" cy="0" r="3" fill="#6B21A8" />
    </g>
  </svg>`,

  // 7: Overlapping Translucent
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="#1E293B" />
    <g transform="translate(50, 75)" fill="none">
      <!-- Arch -->
      <path d="M -40, 5 Q 0,-45 40, 5" stroke="#38BDF8" stroke-width="12" opacity="0.8" stroke-linecap="round" />
      <!-- Waves -->
      <path d="M -25,-15 A 35 35 0 0 1 25,-15" stroke="#C084FC" stroke-width="10" opacity="0.8" stroke-linecap="round" />
      <path d="M -45,-30 A 60 60 0 0 1 45,-30" stroke="#F472B6" stroke-width="10" opacity="0.8" stroke-linecap="round" />
      <circle cx="0" cy="15" r="10" fill="#E2E8F0" opacity="0.9" />
    </g>
  </svg>`,

  // 8: Ascending Bridge
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="#000000" />
    <g transform="translate(50, 80)" fill="none" stroke-linecap="square">
      <!-- Steps forming arch -->
      <path d="M -35, 0 L -25,-10" stroke="#3B82F6" stroke-width="6" />
      <path d="M -20,-15 L -10,-25" stroke="#60A5FA" stroke-width="6" />
      <path d="M -5,-30 L 5,-30" stroke="#93C5FD" stroke-width="6" />
      <path d="M 10,-25 L 20,-15" stroke="#60A5FA" stroke-width="6" />
      <path d="M 25,-10 L 35, 0" stroke="#3B82F6" stroke-width="6" />
      
      <!-- Waves from top step -->
      <path d="M -15,-45 A 20 20 0 0 1 15,-45" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" />
      <path d="M -30,-55 A 40 40 0 0 1 30,-55" stroke="#FDE68A" stroke-width="5" stroke-linecap="round" />
    </g>
  </svg>`,

  // 9: Abstract Geometric
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="bg9" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#F3F4F6"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#bg9)" />
    <g transform="translate(50, 50)" fill="none">
      <path d="M -40, 20 L 0, -20 L 40, 20" stroke="#2563EB" stroke-width="8" stroke-linejoin="miter" />
      <path d="M -20, 20 L 0, 0 L 20, 20" stroke="#3B82F6" stroke-width="8" stroke-linejoin="miter" />
      <!-- Angular Airdrop signals -->
      <path d="M -20, -10 L 0, -30 L 20, -10" stroke="#8B5CF6" stroke-width="6" stroke-linecap="square" />
      <path d="M -35, -25 L 0, -60 L 35, -25" stroke="#C4B5FD" stroke-width="6" stroke-linecap="square" />
    </g>
  </svg>`,

  // 10: Dynamic Motion (Angled forward)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="#4C1D95" />
    <g transform="translate(45, 75) skewX(-10)" stroke-linecap="round" fill="none">
      <!-- Forward moving arch -->
      <path d="M -30, 0 Q 5,-40 40, 0" stroke="#A78BFA" stroke-width="8" />
      <!-- Central person / dot -->
      <circle cx="5" cy="5" r="7" fill="#FCD34D" stroke="none" />
      <!-- Projecting waves -->
      <path d="M -10,-20 A 25 25 0 0 1 20,-20" stroke="#FDE68A" stroke-width="6" />
      <path d="M -25,-35 A 45 45 0 0 1 35,-35" stroke="#FEF3C7" stroke-width="6" />
      <path d="M -40,-50 A 65 65 0 0 1 50,-50" stroke="#FFFBEB" stroke-width="6" />
    </g>
  </svg>`
];

svgs.forEach((svg, i) => {
  const filePath = path.join(outDir, `logo-${i + 1}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${filePath}`);
});

