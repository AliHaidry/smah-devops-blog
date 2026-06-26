/* eslint-disable @typescript-eslint/no-require-imports */
// Generates public/static/images/og-banner.png (1200x630) using sharp + SVG.
// Run: node scripts/generate-og-image.js
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const W = 1200
const H = 630

const pills = ['Azure', 'Kubernetes', 'Terraform', 'CI/CD', 'Grafana']
const PILL_H = 36
const PILL_R = 18
const PILL_PAD_X = 20
const PILL_FONT = 15
// Approximate pill widths (monospace ~9px per char at 15px)
const pillWidths = pills.map((p) => p.length * 9.5 + PILL_PAD_X * 2)
const pillTotalW = pillWidths.reduce((a, b) => a + b, 0) + (pills.length - 1) * 14
const pillStartX = (W - pillTotalW) / 2
const pillY = H - 72

// Build pill SVG elements
let pillSvg = ''
let px = pillStartX
pills.forEach((label, i) => {
  const pw = pillWidths[i]
  pillSvg += `
    <rect x="${px}" y="${pillY}" width="${pw}" height="${PILL_H}" rx="${PILL_R}"
      fill="#ec489918" stroke="#ec4899" stroke-width="1.2"/>
    <text x="${px + pw / 2}" y="${pillY + PILL_H / 2 + 5}" text-anchor="middle"
      font-family="'Courier New',Courier,monospace" font-size="${PILL_FONT}" fill="#ec4899">${label}</text>`
  px += pw + 14
})

// Top-left monogram box — isometric 3D terminal logo (48×48 scaled to 72×72)
const S = 1.5 // scale factor vs nav logo
const bx = 60,
  by = 52 // top-left origin of front face
const bw = 48 * S,
  bh = 48 * S
const d = 9 // depth

const monogramSvg = `
  <!-- 3D top face -->
  <polygon points="${bx},${by} ${bx + bw},${by} ${bx + bw + d},${by - d} ${bx + d},${by - d}" fill="#1e293b"/>
  <!-- 3D right face -->
  <polygon points="${bx + bw},${by} ${bx + bw},${by + bh} ${bx + bw + d},${by + bh - d} ${bx + bw + d},${by - d}" fill="#020617"/>
  <!-- Front face -->
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="#0f172a"/>
  <!-- Traffic lights -->
  <circle cx="${bx + 15}" cy="${by + 19}" r="4.5" fill="#ff5f57"/>
  <circle cx="${bx + 29}" cy="${by + 19}" r="4.5" fill="#ffbd2e"/>
  <circle cx="${bx + 43}" cy="${by + 19}" r="4.5" fill="#28c840"/>
  <!-- ~/AH -->
  <text x="${bx + 10}" y="${by + 50}" font-family="'Courier New',Courier,monospace" font-size="13" fill="#ec4899">~/</text>
  <text x="${bx + 30}" y="${by + 52}" font-family="'Courier New',Courier,monospace" font-size="20" font-weight="700" fill="#ec4899">AH</text>
  <!-- Cursor -->
  <rect x="${bx + 59}" y="${by + 36}" width="7" height="18" rx="1.5" fill="#0078D4"/>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0f1e"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <!-- Pink grid lines -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ec489908" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Subtle pink glow top-right -->
  <ellipse cx="${W - 180}" cy="140" rx="260" ry="160" fill="#ec489910"/>

  <!-- Monogram logo -->
  ${monogramSvg}

  <!-- Divider line -->
  <line x1="60" y1="${by + bh + 24}" x2="${W - 60}" y2="${by + bh + 24}"
    stroke="#ec489930" stroke-width="1"/>

  <!-- Main heading: Ali Haidry -->
  <text x="60" y="310"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif"
    font-size="88" font-weight="800" fill="white" letter-spacing="-2">Ali Haidry</text>

  <!-- Subtitle -->
  <text x="62" y="374"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif"
    font-size="28" font-weight="400" fill="#ec4899" letter-spacing="0.3">
    Senior DevOps Engineer · DevOps, Cloud &amp; AI
  </text>

  <!-- URL -->
  <text x="62" y="420"
    font-family="'Courier New',Courier,monospace"
    font-size="18" fill="#64748b" letter-spacing="0.5">alihaidry-devops.website</text>

  <!-- Tech pills -->
  ${pillSvg}

  <!-- Bottom pink accent bar -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#ec4899"/>
</svg>`

const outPath = path.join(__dirname, '..', 'public', 'static', 'images', 'og-banner.png')
fs.mkdirSync(path.dirname(outPath), { recursive: true })

sharp(Buffer.from(svg))
  .png()
  .toFile(outPath)
  .then(() => console.log(`✓ OG banner written to ${outPath}`))
  .catch((err) => {
    console.error('Failed to generate OG banner:', err)
    process.exit(1)
  })
