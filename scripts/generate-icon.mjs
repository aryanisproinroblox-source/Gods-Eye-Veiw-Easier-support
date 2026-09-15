import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0e1726" />
      <stop offset="70%" stop-color="#070b12" />
      <stop offset="100%" stop-color="#020408" />
    </radialGradient>
    <radialGradient id="sweep" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0, 255, 170, 0.35)" />
      <stop offset="100%" stop-color="rgba(0, 255, 170, 0)" />
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffaa" />
      <stop offset="100%" stop-color="#00aaff" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rounded hexagon / circle -->
  <rect width="512" height="512" rx="100" fill="url(#bg)" stroke="#00ffaa" stroke-width="6" stroke-opacity="0.6"/>

  <!-- Radar Grid Rings -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="#00ffaa" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="6,4"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="#00ffaa" stroke-width="2" stroke-opacity="0.4"/>
  <circle cx="256" cy="256" r="110" fill="none" stroke="#00ffaa" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="4,4"/>
  <circle cx="256" cy="256" r="60" fill="none" stroke="#00aaff" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="256" cy="256" r="12" fill="#00ffaa" filter="url(#glow)"/>

  <!-- Radar Crosshairs -->
  <line x1="256" y1="36" x2="256" y2="476" stroke="#00ffaa" stroke-width="1.5" stroke-opacity="0.35"/>
  <line x1="36" y1="256" x2="476" y2="256" stroke="#00ffaa" stroke-width="1.5" stroke-opacity="0.35"/>

  <!-- Globe Latitude / Longitude Arcs -->
  <ellipse cx="256" cy="256" rx="160" ry="60" fill="none" stroke="#00aaff" stroke-width="2" stroke-opacity="0.35" transform="rotate(-20 256 256)"/>
  <ellipse cx="256" cy="256" rx="160" ry="110" fill="none" stroke="#00aaff" stroke-width="1.5" stroke-opacity="0.2" transform="rotate(-20 256 256)"/>
  <ellipse cx="256" cy="256" rx="60" ry="160" fill="none" stroke="#00aaff" stroke-width="2" stroke-opacity="0.35" transform="rotate(-20 256 256)"/>

  <!-- Radar Sector Sweep Wedge -->
  <path d="M 256 256 L 390 140 A 160 160 0 0 1 416 256 Z" fill="url(#sweep)" />

  <!-- Target Tracking Brackets -->
  <!-- Target 1: Aircraft -->
  <path d="M 330 170 L 345 170 L 345 185" fill="none" stroke="#00ffaa" stroke-width="3" filter="url(#glow)"/>
  <path d="M 330 205 L 345 205 L 345 190" fill="none" stroke="#00ffaa" stroke-width="3" filter="url(#glow)"/>
  <path d="M 315 170 L 300 170 L 300 185" fill="none" stroke="#00ffaa" stroke-width="3" filter="url(#glow)"/>
  <path d="M 315 205 L 300 205 L 300 190" fill="none" stroke="#00ffaa" stroke-width="3" filter="url(#glow)"/>
  <circle cx="322" cy="187" r="3" fill="#ffaa00" filter="url(#glow)"/>

  <!-- Target 2: Satellite Orbit Track -->
  <ellipse cx="256" cy="256" rx="200" ry="85" fill="none" stroke="#ff3366" stroke-width="2" stroke-dasharray="8,6" stroke-opacity="0.6" transform="rotate(42 256 256)"/>
  <circle cx="390" cy="315" r="5" fill="#ff3366" filter="url(#glow)"/>

  <!-- HUD Corner Accents -->
  <path d="M 60 100 L 60 60 L 100 60" fill="none" stroke="#00ffaa" stroke-width="4" stroke-opacity="0.8"/>
  <path d="M 452 100 L 452 60 L 412 60" fill="none" stroke="#00ffaa" stroke-width="4" stroke-opacity="0.8"/>
  <path d="M 60 412 L 60 452 L 100 452" fill="none" stroke="#00ffaa" stroke-width="4" stroke-opacity="0.8"/>
  <path d="M 452 412 L 452 452 L 412 452" fill="none" stroke="#00ffaa" stroke-width="4" stroke-opacity="0.8"/>

  <!-- Tactical Text HUD -->
  <text x="75" y="90" font-family="monospace" font-size="14" fill="#00ffaa" letter-spacing="2" opacity="0.9">GEV // EASIER SUPPORT</text>
  <text x="75" y="440" font-family="monospace" font-size="12" fill="#00aaff" letter-spacing="1.5" opacity="0.8">GLOBAL SAT-SURVEILLANCE</text>
  <text x="350" y="440" font-family="monospace" font-size="12" fill="#00ffaa" opacity="0.8">LIVE: SYS-ON</text>
</svg>
`;

async function run() {
  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(svgContent);
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(assetsDir, 'icon.png'));
  await sharp(svgBuffer).resize(256, 256).png().toFile(path.join(assetsDir, 'icon-256.png'));
  await sharp(svgBuffer).resize(128, 128).png().toFile(path.join(assetsDir, 'icon-128.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(assetsDir, 'icon-64.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(assetsDir, 'icon-48.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(assetsDir, 'icon-32.png'));
  await sharp(svgBuffer).resize(16, 16).png().toFile(path.join(assetsDir, 'icon-16.png'));

  // Also write public/icon.png
  await sharp(svgBuffer).resize(256, 256).png().toFile(path.join('public', 'favicon-tactical.png'));

  console.log('Icons generated successfully in assets/ and public/');
}

run().catch(console.error);
