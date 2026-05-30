/**
 * Blog Thumbnail Generator
 * ========================
 * Generates 1200x630 PNG thumbnails for all 14 blog posts on alihaidry-devops.website
 *
 * Setup (run once in your portfolio repo root):
 *   npm install sharp --save-dev
 *
 * Usage:
 *   node generate-thumbnails.js                        # regenerate ALL thumbnails
 *   node generate-thumbnails.js --slug my-new-post     # generate ONE thumbnail
 *   node generate-thumbnails.js --list                 # list all available slugs
 *
 * Or add to package.json scripts:
 *   "thumbnails":     "node generate-thumbnails.js && cp thumbnails/*.png public/static/images/"
 *   "thumbnail:new":  "node generate-thumbnails.js --slug"
 *   Then run: npm run thumbnails
 *           : npm run thumbnail:new -- --slug your-new-post-slug
 *
 * Adding a new blog post:
 *   1. Add a new { slug, svg: () => `...` } entry to the posts array below
 *   2. Run: node generate-thumbnails.js --slug your-new-post-slug
 *   3. Run: cp thumbnails/your-new-post-slug-thumb.png public/static/images/
 *   4. Add to MDX frontmatter: images: ['/static/images/your-new-post-slug-thumb.png']
 *   5. git push — Vercel redeploys automatically
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const W = 1200;
const H = 630;

// ─── Shared helpers ────────────────────────────────────────────────────────────
const BG      = '#0D1117';
const BLUE    = '#58A6FF';
const GREEN   = '#3FB950';
const PURPLE  = '#D2A8FF';
const ORANGE  = '#F0A030';
const RED     = '#F85149';
const MUTED   = '#8B949E';
const DARK2   = '#161B22';
const DARK3   = '#21262D';
const BORDER  = '#30363D';
const ACCENT_BLUE   = '#1F6FEB';
const FILL_BLUE     = '#1E3A5F';
const FILL_GREEN    = '#1B3A2A';
const FILL_PURPLE   = '#2A1B3A';
const FILL_ORANGE   = '#3A2A1B';
const FILL_RED      = '#3A1B1B';

// (unused stub removed — use tagRow() instead)

// Footer bar — author + branding (same on every card)
function footer() {
  return `
    <!-- footer -->
    <line x1="0" y1="580" x2="${W}" y2="580" stroke="${DARK3}" stroke-width="1"/>
    <circle cx="60" cy="605" r="30" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
    <text x="60" y="612" font-family="Arial,sans-serif" font-size="18" font-weight="700"
          fill="${BLUE}" text-anchor="middle">AH</text>
    <text x="110" y="598" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#E6EDF3">Syed Muhammad Ali Haidry</text>
    <text x="110" y="622" font-family="Arial,sans-serif" font-size="15" fill="${MUTED}">Senior DevOps Engineer · alihaidry-devops.website</text>
    <text x="${W - 48}" y="598" font-family="monospace" font-size="14" fill="${GREEN}" text-anchor="end">github.com/AliHaidry</text>
    <text x="${W - 48}" y="618" font-family="Arial,sans-serif" font-size="14" fill="${MUTED}" text-anchor="end">@AliHaidry5</text>`;
}

// Left accent bar
function accentBar(color = ACCENT_BLUE) {
  return `<rect x="0" y="0" width="8" height="${H}" fill="${color}"/>`;
}

// Tag pill row helper — returns SVG text for a row of tags starting at (x,y)
function tagRow(tags, x, y) {
  let out = '';
  let cx = x;
  const h = 32;
  const py = 8;
  const px = 20;
  tags.forEach(({ label, color, fill }) => {
    const tw = label.length * 9 + px * 2;
    out += `<rect x="${cx}" y="${y}" width="${tw}" height="${h}" rx="16" fill="${fill}"/>`;
    out += `<text x="${cx + tw / 2}" y="${y + h / 2 + 5}" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>`;
    cx += tw + 12;
  });
  return out;
}

// ─── SVG definitions for each post ────────────────────────────────────────────

const posts = [

  // 1. Azure FinOps Dashboard
  {
    slug: 'azure-finops-dashboard',
    svg: () => `
      ${accentBar(ACCENT_BLUE)}
      <!-- Terminal pill -->
      <rect x="48" y="48" width="160" height="34" rx="6" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="66" y="71" font-family="monospace" font-size="15" fill="${GREEN}">$ az finops --monitor</text>
      <!-- Title -->
      <text x="48" y="170" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Building a Multi-Subscription</text>
      <text x="48" y="238" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${ACCENT_BLUE}">Azure FinOps Dashboard</text>
      <text x="48" y="284" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Python · Terraform · Grafana · Next.js · Slack alerting · GitHub Actions</text>
      <line x1="48" y1="312" x2="${W - 48}" y2="312" stroke="${DARK3}" stroke-width="1"/>
      <!-- Metric cards -->
      <rect x="48" y="332" width="256" height="110" rx="10" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="68" y="366" font-family="Arial,sans-serif" font-size="14" fill="${MUTED}">Total MTD Spend</text>
      <text x="68" y="412" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${GREEN}">$9.91</text>
      <text x="68" y="434" font-family="Arial,sans-serif" font-size="13" fill="${GREEN}">↑ 4 subscriptions</text>

      <rect x="320" y="332" width="256" height="110" rx="10" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="340" y="366" font-family="Arial,sans-serif" font-size="14" fill="${MUTED}">Budget Utilisation</text>
      <text x="340" y="412" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${RED}">117.8%</text>
      <text x="340" y="434" font-family="Arial,sans-serif" font-size="13" fill="${RED}">⚠ finops-rg-dev exceeded</text>

      <rect x="592" y="332" width="256" height="110" rx="10" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="612" y="366" font-family="Arial,sans-serif" font-size="14" fill="${MUTED}">Slack Alerts</text>
      <text x="612" y="412" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${BLUE}">Every 6h</text>
      <text x="612" y="434" font-family="Arial,sans-serif" font-size="13" fill="${BLUE}">#finops-alerts channel</text>

      <rect x="864" y="332" width="288" height="110" rx="10" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="884" y="366" font-family="Arial,sans-serif" font-size="14" fill="${MUTED}">Collector</text>
      <text x="884" y="412" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${PURPLE}">Daily</text>
      <text x="884" y="434" font-family="Arial,sans-serif" font-size="13" fill="${PURPLE}">GitHub Actions · 06:00 UTC</text>

      ${tagRow([
        { label: 'Azure', color: BLUE, fill: FILL_BLUE },
        { label: 'FinOps', color: BLUE, fill: FILL_BLUE },
        { label: 'Python', color: BLUE, fill: FILL_BLUE },
        { label: 'Terraform', color: GREEN, fill: FILL_GREEN },
        { label: 'Next.js', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Grafana', color: ORANGE, fill: FILL_ORANGE },
      ], 48, 464)}
      ${footer()}`
  },

  // 2. GitOps Pipeline
  {
    slug: 'paktech-gitops-pipeline',
    svg: () => `
      ${accentBar(PURPLE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Production-grade multi-environment deployment</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Building a GitOps Pipeline</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${PURPLE}">on Azure AKS</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>
      <!-- Pipeline flow -->
      <rect x="48" y="295" width="160" height="64" rx="8" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="128" y="320" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${BLUE}" text-anchor="middle">GitHub Actions</text>
      <text x="128" y="344" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">build · scan · push</text>

      <line x1="208" y1="327" x2="248" y2="327" stroke="${PURPLE}" stroke-width="2"/>
      <polygon points="240,320 252,327 240,334" fill="${PURPLE}"/>

      <rect x="252" y="295" width="160" height="64" rx="8" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="1"/>
      <text x="332" y="320" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${PURPLE}" text-anchor="middle">Argo CD</text>
      <text x="332" y="344" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">sync loop · GitOps</text>

      <line x1="412" y1="327" x2="452" y2="327" stroke="${GREEN}" stroke-width="2"/>
      <polygon points="444,320 456,327 444,334" fill="${GREEN}"/>

      <rect x="456" y="295" width="160" height="64" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="536" y="320" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${GREEN}" text-anchor="middle">AKS Cluster</text>
      <text x="536" y="344" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">Helm · namespaces</text>

      <!-- Env badges -->
      <rect x="660" y="295" width="100" height="64" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="710" y="322" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="${GREEN}" text-anchor="middle">dev</text>
      <text x="710" y="346" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">auto-deploy</text>

      <rect x="774" y="295" width="110" height="64" rx="8" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="1"/>
      <text x="829" y="322" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="${ORANGE}" text-anchor="middle">staging</text>
      <text x="829" y="346" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">approval gate</text>

      <rect x="898" y="295" width="110" height="64" rx="8" fill="${FILL_RED}" stroke="${RED}" stroke-width="1"/>
      <text x="953" y="322" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="${RED}" text-anchor="middle">production</text>
      <text x="953" y="346" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">canary deploy</text>

      <rect x="1022" y="295" width="130" height="64" rx="8" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="1087" y="322" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="${BLUE}" text-anchor="middle">DevSecOps</text>
      <text x="1087" y="346" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">SAST · RBAC · scan</text>

      <!-- Code block -->
      <rect x="48" y="374" width="560" height="90" rx="8" fill="${DARK2}" stroke="${DARK3}" stroke-width="1"/>
      <rect x="48" y="374" width="560" height="26" rx="8" fill="#1C2128"/>
      <rect x="48" y="388" width="560" height="12" fill="#1C2128"/>
      <circle cx="72" cy="387" r="6" fill="${RED}" opacity="0.7"/>
      <circle cx="92" cy="387" r="6" fill="${ORANGE}" opacity="0.7"/>
      <circle cx="112" cy="387" r="6" fill="${GREEN}" opacity="0.7"/>
      <text x="310" y="392" font-family="monospace" font-size="12" fill="${MUTED}" text-anchor="middle">argocd-app.yaml</text>
      <text x="68" y="420" font-family="monospace" font-size="13" fill="${PURPLE}">syncPolicy:</text>
      <text x="68" y="438" font-family="monospace" font-size="13" fill="${MUTED}">  automated:</text>
      <text x="68" y="456" font-family="monospace" font-size="13" fill="${GREEN}">    prune: true · selfHeal: true</text>

      ${tagRow([
        { label: 'GitOps', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Argo CD', color: PURPLE, fill: FILL_PURPLE },
        { label: 'AKS', color: BLUE, fill: FILL_BLUE },
        { label: 'Helm', color: ORANGE, fill: FILL_ORANGE },
        { label: 'DevSecOps', color: RED, fill: FILL_RED },
        { label: 'CI/CD', color: GREEN, fill: FILL_GREEN },
      ], 48, 480)}
      ${footer()}`
  },

  // 3. Internet Gateway vs NAT Gateway
  {
    slug: 'azure-gateway-explainer',
    svg: () => `
      ${accentBar(BLUE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Azure networking — the one-line rule that wins interviews</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Internet Gateway</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${BLUE}">vs NAT Gateway</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- IGW card -->
      <rect x="48" y="290" width="520" height="190" rx="10" fill="${DARK2}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
      <text x="308" y="330" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${BLUE}" text-anchor="middle">Internet Gateway</text>
      <text x="308" y="358" font-family="monospace" font-size="16" fill="${GREEN}" text-anchor="middle">Inbound + Outbound</text>
      <text x="308" y="382" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Public IP attached to resource</text>
      <text x="308" y="402" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Bidirectional traffic</text>
      <text x="308" y="422" font-family="monospace" font-size="14" fill="${BLUE}" text-anchor="middle">Use: public-facing services</text>
      <text x="308" y="464" font-family="monospace" font-size="15" fill="${ORANGE}" text-anchor="middle">← Internet can reach YOU →</text>

      <!-- NAT card -->
      <rect x="632" y="290" width="520" height="190" rx="10" fill="${DARK2}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="892" y="330" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${GREEN}" text-anchor="middle">NAT Gateway</text>
      <text x="892" y="358" font-family="monospace" font-size="16" fill="${GREEN}" text-anchor="middle">Outbound Only</text>
      <text x="892" y="382" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">SNAT — hides private IPs</text>
      <text x="892" y="402" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">No inbound connections</text>
      <text x="892" y="422" font-family="monospace" font-size="14" fill="${GREEN}" text-anchor="middle">Use: private subnet egress</text>
      <text x="892" y="464" font-family="monospace" font-size="15" fill="${GREEN}" text-anchor="middle">→ Internet (you call them) →</text>

      <!-- vs divider -->
      <text x="600" y="400" font-family="Arial,sans-serif" font-size="36" font-weight="700" fill="${MUTED}" text-anchor="middle">vs</text>

      <!-- Bottom rule -->
      <rect x="48" y="496" width="1104" height="44" rx="8" fill="${FILL_RED}" stroke="${RED}" stroke-width="1"/>
      <text x="600" y="524" font-family="monospace" font-size="18" fill="${RED}" text-anchor="middle">One-line rule: NAT Gateway = outbound only · no inbound traffic ever</text>

      ${tagRow([
        { label: 'Azure', color: BLUE, fill: FILL_BLUE },
        { label: 'Networking', color: BLUE, fill: FILL_BLUE },
        { label: 'Interview Prep', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Cloud Architecture', color: GREEN, fill: FILL_GREEN },
      ], 48, 556)}
      ${footer()}`
  },

  // 4. CI/CD Pipelines for Microservices
  {
    slug: 'Building-Production-Grade-CICD-Pipelines-for-Microservices',
    svg: () => `
      ${accentBar(ORANGE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Build · Scan · Test · Deploy · Rollback</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Production-Grade CI/CD</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${ORANGE}">for Microservices</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Pipeline stages -->
      ${[
        { x: 48,   label: 'Source',   sub: 'git push',           color: BLUE,   fill: FILL_BLUE },
        { x: 248,  label: 'Build',    sub: 'kaniko · cache',     color: GREEN,  fill: FILL_GREEN },
        { x: 448,  label: 'SAST',     sub: 'Trivy · Snyk',       color: PURPLE, fill: FILL_PURPLE },
        { x: 648,  label: 'Test',     sub: 'unit · integration', color: ORANGE, fill: FILL_ORANGE },
        { x: 848,  label: 'Push',     sub: 'ACR · image tag',    color: BLUE,   fill: FILL_BLUE },
        { x: 1048, label: 'Deploy',   sub: 'helm upgrade',       color: GREEN,  fill: FILL_GREEN },
      ].map(({ x, label, sub, color, fill }) => `
        <rect x="${x}" y="290" width="175" height="70" rx="8" fill="${fill}" stroke="${color}" stroke-width="1"/>
        <text x="${x + 87}" y="320" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
        <text x="${x + 87}" y="344" font-family="monospace" font-size="12" fill="${MUTED}" text-anchor="middle">${sub}</text>
        ${x < 1048 ? `<line x1="${x + 175}" y1="325" x2="${x + 195}" y2="325" stroke="${ORANGE}" stroke-width="1.5"/><polygon points="${x + 188},319 ${x + 198},325 ${x + 188},331" fill="${ORANGE}"/>` : ''}
      `).join('')}

      <!-- Strategies row -->
      ${[
        { x: 48,  label: 'Blue/Green',   color: BLUE,   fill: FILL_BLUE },
        { x: 280, label: 'Canary Deploy', color: GREEN,  fill: FILL_GREEN },
        { x: 536, label: 'Auto Rollback', color: RED,    fill: FILL_RED },
        { x: 780, label: 'Feature Flags', color: PURPLE, fill: FILL_PURPLE },
        { x: 1004,label: 'GitOps Sync',   color: ORANGE, fill: FILL_ORANGE },
      ].map(({ x, label, color, fill }) => `
        <rect x="${x}" y="380" width="${label.length * 12 + 40}" height="36" rx="18" fill="${fill}"/>
        <text x="${x + (label.length * 12 + 40) / 2}" y="403" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
      `).join('')}

      <!-- Code block -->
      <rect x="48" y="432" width="700" height="108" rx="8" fill="${DARK2}" stroke="${DARK3}" stroke-width="1"/>
      <rect x="48" y="432" width="700" height="28" rx="8" fill="#1C2128"/>
      <rect x="48" y="448" width="700" height="12" fill="#1C2128"/>
      <circle cx="72" cy="446" r="6" fill="${RED}" opacity="0.7"/>
      <circle cx="92" cy="446" r="6" fill="${ORANGE}" opacity="0.7"/>
      <circle cx="112" cy="446" r="6" fill="${GREEN}" opacity="0.7"/>
      <text x="390" y="451" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">.github/workflows/deploy.yml</text>
      <text x="68" y="480" font-family="monospace" font-size="14" fill="${ORANGE}">on: push:</text>
      <text x="68" y="500" font-family="monospace" font-size="14" fill="${MUTED}">  branches: [main, staging]</text>
      <text x="68" y="520" font-family="monospace" font-size="14" fill="${GREEN}">jobs: build → scan → deploy</text>
      <text x="68" y="540" font-family="monospace" font-size="14" fill="${PURPLE}">  strategy: canary: weight: 20%</text>

      ${tagRow([
        { label: 'CI/CD', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Kubernetes', color: GREEN, fill: FILL_GREEN },
        { label: 'GitOps', color: PURPLE, fill: FILL_PURPLE },
        { label: 'DevSecOps', color: RED, fill: FILL_RED },
        { label: 'Microservices', color: BLUE, fill: FILL_BLUE },
      ], 48, 556)}
      ${footer()}`
  },

  // 5. Microservices Observability
  {
    slug: 'Microservices Observability',
    svg: () => `
      ${accentBar(PURPLE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Metrics · Logs · Traces — the three pillars</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Microservices Observability</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${PURPLE}">Prometheus · Grafana · Loki</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Stack cards -->
      <rect x="48" y="290" width="330" height="180" rx="10" fill="${DARK2}" stroke="${PURPLE}" stroke-width="1.5"/>
      <text x="213" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${PURPLE}" text-anchor="middle">Prometheus</text>
      <text x="213" y="350" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">scrape /metrics every 15s</text>
      <text x="68" y="390" font-family="monospace" font-size="13" fill="${PURPLE}">rate(http_requests_total[5m])</text>
      <text x="68" y="412" font-family="monospace" font-size="13" fill="${GREEN}">histogram_quantile(0.99, ...)</text>
      <text x="68" y="434" font-family="monospace" font-size="13" fill="${ORANGE}">up{job="api"} == 1</text>
      <text x="213" y="460" font-family="Arial,sans-serif" font-size="13" fill="${MUTED}" text-anchor="middle">RED · USE methods</text>

      <rect x="406" y="290" width="330" height="180" rx="10" fill="${DARK2}" stroke="${ORANGE}" stroke-width="1.5"/>
      <text x="571" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${ORANGE}" text-anchor="middle">Grafana</text>
      <text x="571" y="350" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Dashboards · Alerts · Panels</text>
      <text x="426" y="390" font-family="Arial,sans-serif" font-size="13" fill="${ORANGE}">4 dashboard types:</text>
      <text x="426" y="410" font-family="monospace" font-size="13" fill="${MUTED}">Overview · Budget · Teams · Anomaly</text>
      <text x="426" y="432" font-family="monospace" font-size="13" fill="${GREEN}">alerting: pagerduty · slack</text>
      <text x="571" y="460" font-family="Arial,sans-serif" font-size="13" fill="${MUTED}" text-anchor="middle">Prometheus datasource</text>

      <rect x="764" y="290" width="388" height="180" rx="10" fill="${DARK2}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="958" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${GREEN}" text-anchor="middle">Loki</text>
      <text x="958" y="350" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Log aggregation · LogQL queries</text>
      <text x="784" y="390" font-family="monospace" font-size="13" fill="${GREEN}">{app="api"} |= "error"</text>
      <text x="784" y="410" font-family="monospace" font-size="13" fill="${MUTED}">| json | line_format "{{.msg}}"</text>
      <text x="784" y="432" font-family="monospace" font-size="13" fill="${PURPLE}">| count_over_time [5m]</text>
      <text x="958" y="460" font-family="Arial,sans-serif" font-size="13" fill="${MUTED}" text-anchor="middle">Promtail agent · labels</text>

      ${tagRow([
        { label: 'Prometheus', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Grafana', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Loki', color: GREEN, fill: FILL_GREEN },
        { label: 'Observability', color: BLUE, fill: FILL_BLUE },
        { label: 'Microservices', color: BLUE, fill: FILL_BLUE },
      ], 48, 488)}
      ${footer()}`
  },

  // 6. Kubernetes Architecture
  {
    slug: 'kubernetes-architecture',
    svg: () => `
      ${accentBar(GREEN)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Control Plane · Worker Nodes · Pods · Services</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Demystifying</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${GREEN}">Kubernetes Architecture</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Control Plane -->
      <rect x="48" y="290" width="1104" height="100" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="600" y="315" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${GREEN}" text-anchor="middle">Control Plane</text>
      ${[
        { x: 68,   label: 'kube-apiserver', sub: 'REST gateway' },
        { x: 348,  label: 'etcd',           sub: 'cluster state' },
        { x: 588,  label: 'kube-scheduler', sub: 'pod placement' },
        { x: 808,  label: 'controller-mgr', sub: 'reconcile loop' },
        { x: 1028, label: 'cloud-controller',sub: 'cloud APIs' },
      ].map(({ x, label, sub }) => `
        <rect x="${x}" y="326" width="240" height="52" rx="6" fill="${DARK2}" stroke="${BORDER}" stroke-width="0.5"/>
        <text x="${x + 120}" y="348" font-family="monospace" font-size="13" fill="${GREEN}" text-anchor="middle">${label}</text>
        <text x="${x + 120}" y="366" font-family="monospace" font-size="12" fill="${MUTED}" text-anchor="middle">${sub}</text>
      `).join('')}

      <!-- Workers -->
      ${[0, 1, 2].map(i => {
        const x = 48 + i * 384;
        return `
          <rect x="${x}" y="406" width="360" height="110" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
          <text x="${x + 180}" y="428" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="${BLUE}" text-anchor="middle">Worker Node ${i + 1}</text>
          <rect x="${x + 16}" y="436" width="100" height="26" rx="4" fill="${DARK2}"/>
          <text x="${x + 66}" y="453" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">kubelet</text>
          <rect x="${x + 128}" y="436" width="110" height="26" rx="4" fill="${DARK2}"/>
          <text x="${x + 183}" y="453" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">kube-proxy</text>
          <rect x="${x + 250}" y="436" width="94" height="26" rx="4" fill="${DARK2}"/>
          <text x="${x + 297}" y="453" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">container-rt</text>
          <rect x="${x + 16}" y="470" width="70" height="26" rx="4" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="0.5"/>
          <text x="${x + 51}" y="487" font-family="monospace" font-size="11" fill="${GREEN}" text-anchor="middle">Pod</text>
          <rect x="${x + 96}" y="470" width="70" height="26" rx="4" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="0.5"/>
          <text x="${x + 131}" y="487" font-family="monospace" font-size="11" fill="${GREEN}" text-anchor="middle">Pod</text>
          <rect x="${x + 176}" y="470" width="80" height="26" rx="4" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="0.5"/>
          <text x="${x + 216}" y="487" font-family="monospace" font-size="11" fill="${PURPLE}" text-anchor="middle">Service</text>
          <rect x="${x + 266}" y="470" width="78" height="26" rx="4" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="0.5"/>
          <text x="${x + 305}" y="487" font-family="monospace" font-size="11" fill="${ORANGE}" text-anchor="middle">ConfigMap</text>
        `;
      }).join('')}

      ${tagRow([
        { label: 'Kubernetes', color: GREEN, fill: FILL_GREEN },
        { label: 'Architecture', color: BLUE, fill: FILL_BLUE },
        { label: 'DevOps', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Cloud-Native', color: ORANGE, fill: FILL_ORANGE },
      ], 48, 534)}
      ${footer()}`
  },

  // 7. 3-Tier → Microservices
  {
    slug: '3-Tier-Architecture-Evolves-into-Microservices',
    svg: () => `
      ${accentBar(ORANGE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Architecture evolution — monolith to cloud-native</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">3-Tier Architecture</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${ORANGE}">Evolves into Microservices</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Stage 1: Monolith -->
      <rect x="48" y="290" width="220" height="200" rx="8" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="158" y="318" font-family="Arial,sans-serif" font-size="16" fill="${MUTED}" text-anchor="middle">Monolith</text>
      <rect x="68" y="328" width="180" height="40" rx="4" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="0.5"/>
      <text x="158" y="353" font-family="Arial,sans-serif" font-size="14" fill="${PURPLE}" text-anchor="middle">UI + Logic + DB</text>
      <rect x="68" y="376" width="180" height="30" rx="4" fill="${FILL_RED}"/>
      <text x="158" y="396" font-family="monospace" font-size="12" fill="${RED}" text-anchor="middle">tightly coupled</text>
      <rect x="68" y="414" width="180" height="30" rx="4" fill="${FILL_RED}"/>
      <text x="158" y="434" font-family="monospace" font-size="12" fill="${RED}" text-anchor="middle">single deploy unit</text>
      <rect x="68" y="452" width="180" height="30" rx="4" fill="${FILL_RED}"/>
      <text x="158" y="472" font-family="monospace" font-size="12" fill="${RED}" text-anchor="middle">scale everything or nothing</text>

      <!-- Arrow 1 -->
      <line x1="268" y1="390" x2="320" y2="390" stroke="${ORANGE}" stroke-width="2.5"/>
      <polygon points="312,383 324,390 312,397" fill="${ORANGE}"/>

      <!-- Stage 2: 3-Tier -->
      <rect x="324" y="290" width="220" height="200" rx="8" fill="${DARK2}" stroke="${ORANGE}" stroke-width="1.5"/>
      <text x="434" y="318" font-family="Arial,sans-serif" font-size="16" fill="${ORANGE}" text-anchor="middle">3-Tier</text>
      <rect x="344" y="328" width="180" height="34" rx="4" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="0.5"/>
      <text x="434" y="350" font-family="Arial,sans-serif" font-size="14" fill="${ORANGE}" text-anchor="middle">Presentation Layer</text>
      <rect x="344" y="370" width="180" height="34" rx="4" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="0.5"/>
      <text x="434" y="392" font-family="Arial,sans-serif" font-size="14" fill="${ORANGE}" text-anchor="middle">Business Logic</text>
      <rect x="344" y="412" width="180" height="34" rx="4" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="0.5"/>
      <text x="434" y="434" font-family="Arial,sans-serif" font-size="14" fill="${ORANGE}" text-anchor="middle">Data Layer</text>
      <text x="434" y="472" font-family="monospace" font-size="12" fill="${GREEN}" text-anchor="middle">separated concerns ✓</text>

      <!-- Arrow 2 -->
      <line x1="544" y1="390" x2="596" y2="390" stroke="${GREEN}" stroke-width="2.5"/>
      <polygon points="588,383 600,390 588,397" fill="${GREEN}"/>

      <!-- Stage 3: Microservices -->
      <rect x="600" y="290" width="552" height="200" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="876" y="318" font-family="Arial,sans-serif" font-size="16" fill="${GREEN}" text-anchor="middle">Microservices + Cloud-Native</text>
      ${[
        { x: 620, y: 328, label: 'auth-svc',   color: BLUE },
        { x: 786, y: 328, label: 'order-svc',  color: BLUE },
        { x: 952, y: 328, label: 'payment-svc',color: BLUE },
        { x: 620, y: 378, label: 'user-svc',   color: GREEN },
        { x: 786, y: 378, label: 'notify-svc', color: GREEN },
        { x: 952, y: 378, label: 'api-gateway', color: ORANGE },
        { x: 620, y: 428, label: 'PostgreSQL',  color: PURPLE },
        { x: 786, y: 428, label: 'Redis cache', color: RED },
        { x: 952, y: 428, label: 'message-bus', color: ORANGE },
      ].map(({ x, y, label, color }) => `
        <rect x="${x}" y="${y}" width="148" height="38" rx="4" fill="${DARK2}" stroke="${color}" stroke-width="0.5"/>
        <text x="${x + 74}" y="${y + 24}" font-family="monospace" font-size="12" fill="${color}" text-anchor="middle">${label}</text>
      `).join('')}
      <text x="876" y="484" font-family="monospace" font-size="12" fill="${GREEN}" text-anchor="middle">independently deployable · scalable · fault-isolated</text>

      ${tagRow([
        { label: 'System-Design', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Cloud', color: BLUE, fill: FILL_BLUE },
        { label: 'Microservices', color: GREEN, fill: FILL_GREEN },
        { label: 'Kubernetes', color: PURPLE, fill: FILL_PURPLE },
      ], 48, 510)}
      ${footer()}`
  },

  // 8. 2-Tier and 3-Tier Architecture
  {
    slug: 'Understanding-2-Tier-and-3-Tier-Architecture',
    svg: () => `
      ${accentBar(BLUE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">System design fundamentals — separation of concerns</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">2-Tier and 3-Tier</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${BLUE}">Architecture</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- 2-Tier -->
      <rect x="48" y="290" width="520" height="220" rx="10" fill="${DARK2}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
      <text x="308" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${BLUE}" text-anchor="middle">2-Tier Architecture</text>
      <rect x="98" y="340" width="420" height="52" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="308" y="372" font-family="Arial,sans-serif" font-size="18" fill="${BLUE}" text-anchor="middle">Client (Presentation + Business Logic)</text>
      <line x1="308" y1="392" x2="308" y2="412" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6,4"/>
      <rect x="98" y="412" width="420" height="52" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="308" y="444" font-family="Arial,sans-serif" font-size="18" fill="${BLUE}" text-anchor="middle">Database (Data Layer)</text>
      <text x="308" y="490" font-family="monospace" font-size="15" fill="${ORANGE}" text-anchor="middle">Direct DB connection · simple · less scalable</text>

      <!-- vs -->
      <text x="600" y="410" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${MUTED}" text-anchor="middle">vs</text>

      <!-- 3-Tier -->
      <rect x="632" y="290" width="520" height="220" rx="10" fill="${DARK2}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="892" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${GREEN}" text-anchor="middle">3-Tier Architecture</text>
      <rect x="682" y="340" width="420" height="40" rx="6" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="0.5"/>
      <text x="892" y="365" font-family="Arial,sans-serif" font-size="16" fill="${BLUE}" text-anchor="middle">Presentation Layer (UI)</text>
      <line x1="892" y1="380" x2="892" y2="396" stroke="${GREEN}" stroke-width="1.5"/>
      <rect x="682" y="396" width="420" height="40" rx="6" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="0.5"/>
      <text x="892" y="421" font-family="Arial,sans-serif" font-size="16" fill="${ORANGE}" text-anchor="middle">Business Logic Layer (API / App Server)</text>
      <line x1="892" y1="436" x2="892" y2="452" stroke="${GREEN}" stroke-width="1.5"/>
      <rect x="682" y="452" width="420" height="40" rx="6" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="0.5"/>
      <text x="892" y="477" font-family="Arial,sans-serif" font-size="16" fill="${GREEN}" text-anchor="middle">Data Layer (Database)</text>
      <text x="892" y="500" font-family="monospace" font-size="14" fill="${GREEN}" text-anchor="middle">separated concerns · scalable · maintainable</text>

      ${tagRow([
        { label: 'System-Design', color: BLUE, fill: FILL_BLUE },
        { label: 'Architecture', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Backend', color: GREEN, fill: FILL_GREEN },
        { label: 'Cloud', color: BLUE, fill: FILL_BLUE },
      ], 48, 530)}
      ${footer()}`
  },

  // 9. Software Engineering Roadmap
  {
    slug: 'software-engineering-roadmap',
    svg: () => `
      ${accentBar(PURPLE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">12 months · 6 modules · foundations to AI/ML</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Software Engineering</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${PURPLE}">Roadmap 2024</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      ${[
        { x: 48,   y: 290, w: 270, label: 'M1–2: Foundations',     sub: 'Linux · Git · Python · Networking',     color: PURPLE, fill: FILL_PURPLE },
        { x: 334,  y: 290, w: 270, label: 'M3–4: Cloud + IaC',     sub: 'AWS/Azure · Terraform · Docker',        color: GREEN,  fill: FILL_GREEN  },
        { x: 620,  y: 290, w: 270, label: 'M5–6: Kubernetes',      sub: 'k8s · Helm · service mesh · RBAC',      color: BLUE,   fill: FILL_BLUE   },
        { x: 906,  y: 290, w: 246, label: 'M7–8: CI/CD + GitOps',  sub: 'GitHub Actions · Argo CD · pipelines',  color: ORANGE, fill: FILL_ORANGE  },
        { x: 48,   y: 380, w: 270, label: 'M9–10: Security',       sub: 'DevSecOps · SAST · secrets · certs',    color: RED,    fill: FILL_RED    },
        { x: 334,  y: 380, w: 270, label: 'M11–12: AI/ML + SRE',   sub: 'LLMs · SLOs · chaos · FinOps',          color: PURPLE, fill: FILL_PURPLE  },
        { x: 620,  y: 380, w: 532, label: 'Soft Skills + Career',  sub: 'system design · interviews · leadership · communication', color: MUTED, fill: DARK2 },
      ].map(({ x, y, w, label, sub, color, fill }) => `
        <rect x="${x}" y="${y}" width="${w}" height="78" rx="8" fill="${fill}" stroke="${color}" stroke-width="1"/>
        <text x="${x + w / 2}" y="${y + 30}" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
        <text x="${x + w / 2}" y="${y + 54}" font-family="monospace" font-size="12" fill="${MUTED}" text-anchor="middle">${sub}</text>
      `).join('')}

      <!-- Certification badges -->
      ${[
        { x: 48,  label: 'AZ-900', color: BLUE },
        { x: 200, label: 'AZ-104', color: BLUE },
        { x: 352, label: 'CKA', color: GREEN },
        { x: 468, label: 'AZ-400', color: ORANGE },
        { x: 592, label: 'AWS-SAA', color: ORANGE },
        { x: 724, label: 'CKS', color: RED },
        { x: 832, label: 'CKAD', color: GREEN },
      ].map(({ x, label, color }) => `
        <rect x="${x}" y="475" width="${label.length * 12 + 36}" height="34" rx="17" fill="${DARK2}" stroke="${color}" stroke-width="1.5"/>
        <text x="${x + (label.length * 12 + 36) / 2}" y="497" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
      `).join('')}

      ${tagRow([
        { label: 'Roadmap', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Career', color: BLUE, fill: FILL_BLUE },
        { label: 'Learning', color: GREEN, fill: FILL_GREEN },
        { label: 'Engineering', color: ORANGE, fill: FILL_ORANGE },
      ], 48, 526)}
      ${footer()}`
  },

  // 10. Proxy and Reverse Proxy
  {
    slug: 'Proxy-Reverse-Proxy',
    svg: () => `
      ${accentBar(BLUE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Smart intermediaries of modern network design</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Forward Proxy</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${BLUE}">and Reverse Proxy</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Forward Proxy -->
      <rect x="48" y="290" width="520" height="210" rx="10" fill="${DARK2}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
      <text x="308" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${BLUE}" text-anchor="middle">Forward Proxy</text>
      <!-- Flow -->
      <rect x="78" y="342" width="100" height="44" rx="6" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="128" y="369" font-family="Arial,sans-serif" font-size="16" fill="${BLUE}" text-anchor="middle">Client</text>
      <line x1="178" y1="364" x2="218" y2="364" stroke="${BLUE}" stroke-width="2"/>
      <polygon points="210,357 222,364 210,371" fill="${BLUE}"/>
      <rect x="218" y="342" width="100" height="44" rx="6" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="1"/>
      <text x="268" y="369" font-family="Arial,sans-serif" font-size="16" fill="${PURPLE}" text-anchor="middle">Proxy</text>
      <line x1="318" y1="364" x2="358" y2="364" stroke="${GREEN}" stroke-width="2"/>
      <polygon points="350,357 362,364 350,371" fill="${GREEN}"/>
      <rect x="358" y="342" width="130" height="44" rx="6" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="423" y="369" font-family="Arial,sans-serif" font-size="16" fill="${GREEN}" text-anchor="middle">Internet</text>
      <text x="308" y="414" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Hides client identity from server</text>
      <text x="308" y="436" font-family="monospace" font-size="14" fill="${BLUE}" text-anchor="middle">Use cases: VPN · content filter · cache</text>
      <text x="308" y="458" font-family="monospace" font-size="14" fill="${GREEN}" text-anchor="middle">Corp proxy · Squid · browsing anonymity</text>
      <text x="308" y="485" font-family="monospace" font-size="14" fill="${ORANGE}" text-anchor="middle">→ Client is anonymous to the internet ←</text>

      <!-- vs -->
      <text x="600" y="410" font-family="Arial,sans-serif" font-size="42" font-weight="700" fill="${MUTED}" text-anchor="middle">vs</text>

      <!-- Reverse Proxy -->
      <rect x="632" y="290" width="520" height="210" rx="10" fill="${DARK2}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="892" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${GREEN}" text-anchor="middle">Reverse Proxy</text>
      <rect x="662" y="342" width="100" height="44" rx="6" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="712" y="369" font-family="Arial,sans-serif" font-size="16" fill="${BLUE}" text-anchor="middle">Client</text>
      <line x1="762" y1="364" x2="802" y2="364" stroke="${GREEN}" stroke-width="2"/>
      <polygon points="794,357 806,364 794,371" fill="${GREEN}"/>
      <rect x="802" y="342" width="100" height="44" rx="6" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="852" y="369" font-family="Arial,sans-serif" font-size="16" fill="${GREEN}" text-anchor="middle">Nginx</text>
      <line x1="902" y1="364" x2="942" y2="364" stroke="${ORANGE}" stroke-width="2"/>
      <polygon points="934,357 946,364 934,371" fill="${ORANGE}"/>
      <rect x="942" y="342" width="140" height="44" rx="6" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="1"/>
      <text x="1012" y="369" font-family="Arial,sans-serif" font-size="16" fill="${ORANGE}" text-anchor="middle">Backend Pool</text>
      <text x="892" y="414" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Hides server identity from clients</text>
      <text x="892" y="436" font-family="monospace" font-size="14" fill="${GREEN}" text-anchor="middle">Load balancing · TLS termination · cache</text>
      <text x="892" y="458" font-family="monospace" font-size="14" fill="${BLUE}" text-anchor="middle">Nginx · Caddy · Traefik · AWS ALB</text>
      <text x="892" y="485" font-family="monospace" font-size="14" fill="${ORANGE}" text-anchor="middle">→ Server pool is invisible to clients ←</text>

      ${tagRow([
        { label: 'Networking', color: BLUE, fill: FILL_BLUE },
        { label: 'System-Design', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Load Balancing', color: GREEN, fill: FILL_GREEN },
        { label: 'DevOps', color: PURPLE, fill: FILL_PURPLE },
      ], 48, 520)}
      ${footer()}`
  },

  // 11. DNS Architecture
  {
    slug: 'DNS-Architecture',
    svg: () => `
      ${accentBar(ORANGE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">Recursive resolution · record types · TTL · caching</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">DNS: The Internet's</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${ORANGE}">Address Book</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- Resolution flow left to right -->
      ${[
        { x: 48,  label: 'Browser',     sub: 'DNS query',         color: BLUE,   fill: FILL_BLUE   },
        { x: 288, label: 'Resolver',    sub: 'ISP / 8.8.8.8',    color: ORANGE, fill: FILL_ORANGE  },
        { x: 528, label: 'Root NS',     sub: '13 root servers',   color: PURPLE, fill: FILL_PURPLE  },
        { x: 768, label: 'TLD NS',      sub: '.com / .io / .net', color: GREEN,  fill: FILL_GREEN   },
        { x: 1008,label: 'Auth NS',     sub: 'your domain zone',  color: BLUE,   fill: FILL_BLUE    },
      ].map(({ x, label, sub, color, fill }, i) => `
        <rect x="${x}" y="295" width="216" height="64" rx="8" fill="${fill}" stroke="${color}" stroke-width="1.5"/>
        <text x="${x + 108}" y="322" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
        <text x="${x + 108}" y="346" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">${sub}</text>
        ${i < 4 ? `
          <line x1="${x + 216}" y1="327" x2="${x + 240}" y2="327" stroke="${ORANGE}" stroke-width="2"/>
          <polygon points="${x + 232},320 ${x + 244},327 ${x + 232},334" fill="${ORANGE}"/>
          <text x="${x + 228}" y="318" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">query</text>
        ` : ''}
      `).join('')}

      <!-- Result -->
      <rect x="200" y="380" width="800" height="52" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="600" y="408" font-family="monospace" font-size="18" fill="${GREEN}" text-anchor="middle">alihaidry-devops.website → A record → 104.21.14.82 ✓</text>
      <text x="600" y="428" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">TTL: 300s · cached by resolver · response in ~50ms</text>

      <!-- Record types -->
      ${[
        { x: 48,  label: 'A',     sub: 'IPv4 address',   color: BLUE },
        { x: 204, label: 'AAAA',  sub: 'IPv6 address',   color: BLUE },
        { x: 384, label: 'CNAME', sub: 'alias record',   color: GREEN },
        { x: 576, label: 'MX',    sub: 'mail server',    color: ORANGE },
        { x: 736, label: 'TXT',   sub: 'verification',   color: PURPLE },
        { x: 896, label: 'NS',    sub: 'nameserver',     color: RED },
        { x: 1020,label: 'SOA',   sub: 'zone authority', color: MUTED },
      ].map(({ x, label, sub, color }) => `
        <rect x="${x}" y="450" width="${label.length * 14 + 80}" height="52" rx="6" fill="${DARK2}" stroke="${BORDER}" stroke-width="0.5"/>
        <text x="${x + (label.length * 14 + 80) / 2}" y="472" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
        <text x="${x + (label.length * 14 + 80) / 2}" y="492" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">${sub}</text>
      `).join('')}

      ${tagRow([
        { label: 'DNS', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Networking', color: BLUE, fill: FILL_BLUE },
        { label: 'System-Design', color: PURPLE, fill: FILL_PURPLE },
        { label: 'Platform-Engineering', color: GREEN, fill: FILL_GREEN },
      ], 48, 522)}
      ${footer()}`
  },

  // 12. IP Address
  {
    slug: 'IP-Address',
    svg: () => `
      ${accentBar(GREEN)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">IPv4 · IPv6 · CIDR · subnetting · address types</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">IP Address:</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="${GREEN}">Understanding Digital Identity</text>
      <line x1="48" y1="270" x2="${W - 48}" y2="270" stroke="${DARK3}" stroke-width="1"/>

      <!-- IPv4 vs IPv6 -->
      <rect x="48" y="290" width="540" height="180" rx="10" fill="${DARK2}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
      <text x="318" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${BLUE}" text-anchor="middle">IPv4</text>
      <text x="318" y="360" font-family="monospace" font-size="28" font-weight="700" fill="${GREEN}" text-anchor="middle">192.168.1.1</text>
      <text x="318" y="392" font-family="monospace" font-size="16" fill="${MUTED}" text-anchor="middle">32-bit · 4 octets · 4.3 billion addresses</text>
      <text x="318" y="420" font-family="monospace" font-size="15" fill="${ORANGE}" text-anchor="middle">NAT required · running out · widely used</text>
      <text x="318" y="448" font-family="monospace" font-size="15" fill="${MUTED}" text-anchor="middle">Dotted-decimal notation</text>
      <text x="318" y="466" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">Class A/B/C/D/E</text>

      <rect x="612" y="290" width="540" height="180" rx="10" fill="${DARK2}" stroke="${PURPLE}" stroke-width="1.5"/>
      <text x="882" y="325" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${PURPLE}" text-anchor="middle">IPv6</text>
      <text x="882" y="360" font-family="monospace" font-size="22" font-weight="700" fill="${GREEN}" text-anchor="middle">2001:db8::1</text>
      <text x="882" y="392" font-family="monospace" font-size="16" fill="${MUTED}" text-anchor="middle">128-bit · 8 groups · virtually unlimited</text>
      <text x="882" y="420" font-family="monospace" font-size="15" fill="${GREEN}" text-anchor="middle">No NAT needed · future-proof · IoT ready</text>
      <text x="882" y="448" font-family="monospace" font-size="15" fill="${MUTED}" text-anchor="middle">Hexadecimal colon notation</text>
      <text x="882" y="466" font-family="monospace" font-size="14" fill="${MUTED}" text-anchor="middle">::1 loopback · fe80:: link-local</text>

      <!-- Address types -->
      ${[
        { x: 48,   label: 'Public',    sub: '8.8.8.8',         color: GREEN  },
        { x: 268,  label: 'Private',   sub: '10.x · 192.168.x',color: BLUE   },
        { x: 528,  label: 'Loopback',  sub: '127.0.0.1 / ::1', color: ORANGE },
        { x: 748,  label: 'APIPA',     sub: '169.254.x.x',     color: RED    },
        { x: 960,  label: 'Multicast', sub: '224.x.x.x',       color: PURPLE },
      ].map(({ x, label, sub, color }) => `
        <rect x="${x}" y="488" width="196" height="52" rx="8" fill="${DARK2}" stroke="${color}" stroke-width="1"/>
        <text x="${x + 98}" y="510" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
        <text x="${x + 98}" y="530" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">${sub}</text>
      `).join('')}

      ${tagRow([
        { label: 'Networking', color: GREEN, fill: FILL_GREEN },
        { label: 'System-Design', color: BLUE, fill: FILL_BLUE },
        { label: 'Cloud', color: ORANGE, fill: FILL_ORANGE },
        { label: 'Platform-Engineering', color: PURPLE, fill: FILL_PURPLE },
      ], 48, 558)}
      ${footer()}`
  },


  // 13. Client-Server Architecture
  {
    slug: 'client-server',
    svg: () => `
      ${accentBar(ACCENT_BLUE)}
      <text x="48" y="100" font-family="Arial,sans-serif" font-size="22" fill="${MUTED}">The foundation of every networked application</text>
      <text x="48" y="168" font-family="Arial,sans-serif" font-size="58" font-weight="700" fill="#E6EDF3">Client-Server Architecture:</text>
      <text x="48" y="236" font-family="Arial,sans-serif" font-size="50" font-weight="700" fill="${ACCENT_BLUE}">The Foundation of Modern Systems</text>
      <line x1="48" y1="268" x2="${W - 48}" y2="268" stroke="${DARK3}" stroke-width="1"/>

      <!-- Client box -->
      <rect x="48" y="288" width="340" height="248" rx="10" fill="${DARK2}" stroke="${ACCENT_BLUE}" stroke-width="1.5"/>
      <text x="218" y="322" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="${BLUE}" text-anchor="middle">Clients</text>
      <rect x="72" y="334" width="90" height="60" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="117" y="360" font-family="Arial,sans-serif" font-size="14" fill="${BLUE}" text-anchor="middle">Browser</text>
      <text x="117" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">HTTP/S</text>
      <rect x="178" y="334" width="90" height="60" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="223" y="360" font-family="Arial,sans-serif" font-size="14" fill="${BLUE}" text-anchor="middle">Mobile</text>
      <text x="223" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">REST API</text>
      <rect x="284" y="334" width="90" height="60" rx="8" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="1"/>
      <text x="329" y="360" font-family="Arial,sans-serif" font-size="14" fill="${BLUE}" text-anchor="middle">Desktop</text>
      <text x="329" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">gRPC</text>
      <rect x="72" y="408" width="300" height="34" rx="6" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="0.5"/>
      <text x="222" y="430" font-family="monospace" font-size="13" fill="${PURPLE}" text-anchor="middle">GET /api/users HTTP/1.1</text>
      <rect x="72" y="450" width="300" height="34" rx="6" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="0.5"/>
      <text x="222" y="472" font-family="monospace" font-size="13" fill="${GREEN}" text-anchor="middle">200 OK · JSON body</text>
      <text x="218" y="522" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">initiates requests</text>

      <!-- Arrows -->
      <line x1="388" y1="376" x2="446" y2="358" stroke="${ORANGE}" stroke-width="2.5"/>
      <polygon points="436,350 450,356 440,366" fill="${ORANGE}"/>
      <text x="418" y="400" font-family="monospace" font-size="12" fill="${ORANGE}" text-anchor="middle">request</text>
      <line x1="446" y1="428" x2="388" y2="448" stroke="${GREEN}" stroke-width="2.5"/>
      <polygon points="398,440 386,448 396,458" fill="${GREEN}"/>
      <text x="418" y="424" font-family="monospace" font-size="12" fill="${GREEN}" text-anchor="middle">response</text>

      <!-- Server box -->
      <rect x="450" y="288" width="702" height="248" rx="10" fill="${DARK2}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="801" y="322" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="${GREEN}" text-anchor="middle">Server</text>
      <rect x="474" y="334" width="160" height="60" rx="8" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1"/>
      <text x="554" y="360" font-family="Arial,sans-serif" font-size="14" fill="${GREEN}" text-anchor="middle">Web Server</text>
      <text x="554" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">Nginx · Caddy</text>
      <rect x="650" y="334" width="160" height="60" rx="8" fill="${FILL_ORANGE}" stroke="${ORANGE}" stroke-width="1"/>
      <text x="730" y="360" font-family="Arial,sans-serif" font-size="14" fill="${ORANGE}" text-anchor="middle">App Server</text>
      <text x="730" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">Node · Django</text>
      <rect x="826" y="334" width="160" height="60" rx="8" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="1"/>
      <text x="906" y="360" font-family="Arial,sans-serif" font-size="14" fill="${PURPLE}" text-anchor="middle">Database</text>
      <text x="906" y="378" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">PostgreSQL</text>
      <line x1="634" y1="364" x2="650" y2="364" stroke="${ORANGE}" stroke-width="1.5"/>
      <line x1="810" y1="364" x2="826" y2="364" stroke="${PURPLE}" stroke-width="1.5"/>
      <rect x="474" y="410" width="652" height="30" rx="6" fill="${FILL_BLUE}" stroke="${ACCENT_BLUE}" stroke-width="0.5"/>
      <text x="800" y="430" font-family="monospace" font-size="13" fill="${BLUE}" text-anchor="middle">stateless · horizontally scalable · load balanced</text>
      <rect x="474" y="448" width="310" height="30" rx="6" fill="${FILL_GREEN}"/>
      <text x="629" y="468" font-family="monospace" font-size="13" fill="${GREEN}" text-anchor="middle">TCP/IP · HTTP · WebSocket</text>
      <rect x="794" y="448" width="332" height="30" rx="6" fill="${FILL_ORANGE}"/>
      <text x="960" y="468" font-family="monospace" font-size="13" fill="${ORANGE}" text-anchor="middle">REST · GraphQL · gRPC · SOAP</text>
      <text x="801" y="522" font-family="monospace" font-size="13" fill="${MUTED}" text-anchor="middle">listens · processes · responds</text>

      ${tagRow([
        { label: 'System-Design', color: BLUE,   fill: FILL_BLUE   },
        { label: 'Architecture',  color: ORANGE, fill: FILL_ORANGE },
        { label: 'Networking',    color: GREEN,  fill: FILL_GREEN  },
        { label: 'Backend',       color: PURPLE, fill: FILL_PURPLE },
        { label: 'Cloud',         color: BLUE,   fill: FILL_BLUE   },
      ], 48, 552)}
      ${footer()}`
  },

  // 14. Kubernetes Troubleshooting
  {
    slug: 'Kubernetes-troubleshoot',
    svg: () => `
      ${accentBar(RED)}
      <rect x="48" y="48" width="210" height="34" rx="6" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <text x="68" y="71" font-family="monospace" font-size="15" fill="${RED}">$ kubectl get nodes</text>
      <rect x="278" y="48" width="382" height="34" rx="6" fill="${FILL_RED}" stroke="${RED}" stroke-width="1"/>
      <text x="469" y="71" font-family="monospace" font-size="14" fill="${RED}" text-anchor="middle">Error: connection refused :6443</text>
      <text x="48" y="158" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#E6EDF3">Kubernetes v1.22.5</text>
      <text x="48" y="222" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="${RED}">Troubleshooting Docker Desktop 4.7.1</text>
      <line x1="48" y1="252" x2="${W - 48}" y2="252" stroke="${DARK3}" stroke-width="1"/>

      <!-- Steps row 1 -->
      <rect x="48" y="270" width="256" height="108" rx="8" fill="${FILL_RED}" stroke="${RED}" stroke-width="1.5"/>
      <circle cx="84" cy="308" r="20" fill="${DARK2}" stroke="${RED}" stroke-width="1.5"/>
      <text x="84" y="315" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${RED}" text-anchor="middle">1</text>
      <text x="176" y="316" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${RED}" text-anchor="middle">Reset Docker Desktop</text>
      <text x="176" y="336" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">Factory defaults via tray</text>
      <text x="176" y="358" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">icon - Troubleshoot</text>
      <line x1="304" y1="324" x2="322" y2="324" stroke="${MUTED}" stroke-width="1.5"/>
      <polygon points="314,317 326,324 314,331" fill="${MUTED}"/>

      <rect x="326" y="270" width="256" height="108" rx="8" fill="${FILL_RED}" stroke="${ORANGE}" stroke-width="1.5"/>
      <circle cx="362" cy="308" r="20" fill="${DARK2}" stroke="${ORANGE}" stroke-width="1.5"/>
      <text x="362" y="315" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${ORANGE}" text-anchor="middle">2</text>
      <text x="454" y="316" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${ORANGE}" text-anchor="middle">Quit Docker Desktop</text>
      <text x="454" y="336" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">Close completely</text>
      <text x="454" y="356" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">after factory reset</text>
      <line x1="582" y1="324" x2="600" y2="324" stroke="${MUTED}" stroke-width="1.5"/>
      <polygon points="592,317 604,324 592,331" fill="${MUTED}"/>

      <rect x="604" y="270" width="256" height="108" rx="8" fill="${FILL_PURPLE}" stroke="${PURPLE}" stroke-width="1.5"/>
      <circle cx="640" cy="308" r="20" fill="${DARK2}" stroke="${PURPLE}" stroke-width="1.5"/>
      <text x="640" y="315" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${PURPLE}" text-anchor="middle">3</text>
      <text x="732" y="316" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${PURPLE}" text-anchor="middle">Delete .kube folder</text>
      <text x="732" y="336" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">C:\Users\name\.kube</text>
      <text x="732" y="356" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">backup first if needed</text>
      <line x1="860" y1="324" x2="878" y2="324" stroke="${MUTED}" stroke-width="1.5"/>
      <polygon points="870,317 882,324 870,331" fill="${MUTED}"/>

      <rect x="882" y="270" width="270" height="108" rx="8" fill="${FILL_BLUE}" stroke="${BLUE}" stroke-width="1.5"/>
      <circle cx="918" cy="308" r="20" fill="${DARK2}" stroke="${BLUE}" stroke-width="1.5"/>
      <text x="918" y="315" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${BLUE}" text-anchor="middle">4</text>
      <text x="1017" y="316" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="${BLUE}" text-anchor="middle">Delete pki folder</text>
      <text x="1017" y="336" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">AppData\Local\Docker\pki</text>
      <text x="1017" y="356" font-family="monospace" font-size="11" fill="${MUTED}" text-anchor="middle">backup first if needed</text>

      <!-- Steps row 2 -->
      <rect x="48" y="394" width="540" height="108" rx="8" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <circle cx="84" cy="432" r="20" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="84" y="439" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${GREEN}" text-anchor="middle">5</text>
      <text x="318" y="430" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="${GREEN}" text-anchor="middle">Add entries to hosts file</text>
      <text x="68" y="462" font-family="monospace" font-size="13" fill="${MUTED}">192.168.1.5  host.docker.internal</text>
      <text x="68" y="482" font-family="monospace" font-size="13" fill="${MUTED}">192.168.1.5  gateway.docker.internal</text>

      <rect x="612" y="394" width="540" height="108" rx="8" fill="${DARK2}" stroke="${BORDER}" stroke-width="1"/>
      <circle cx="648" cy="432" r="20" fill="${FILL_GREEN}" stroke="${GREEN}" stroke-width="1.5"/>
      <text x="648" y="439" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="${GREEN}" text-anchor="middle">6</text>
      <text x="882" y="430" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="${GREEN}" text-anchor="middle">Restart and re-enable Kubernetes</text>
      <text x="632" y="462" font-family="monospace" font-size="13" fill="${MUTED}">Docker Desktop - Settings - Kubernetes</text>
      <text x="632" y="482" font-family="monospace" font-size="13" fill="${GREEN}">Enable Kubernetes - Apply and Restart</text>

      ${tagRow([
        { label: 'Kubernetes',     color: GREEN,  fill: FILL_GREEN  },
        { label: 'Docker',         color: BLUE,   fill: FILL_BLUE   },
        { label: 'Troubleshooting',color: RED,    fill: FILL_RED    },
        { label: 'DevOps',         color: PURPLE, fill: FILL_PURPLE },
        { label: 'Problem',        color: ORANGE, fill: FILL_ORANGE },
      ], 48, 518)}
      ${footer()}`
  },

];

// ─── Renderer ─────────────────────────────────────────────────────────────────
async function render(post) {
  const svgContent = post.svg();
  const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
     xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${svgContent}
</svg>`;

  const outPath = path.join(OUT_DIR, `${post.slug}-thumb.png`);
  await sharp(Buffer.from(fullSvg)).png().toFile(outPath);
  console.log(`✅  ${post.slug}-thumb.png`);
}

async function main() {
  const args = process.argv.slice(2);
  const slugIdx = args.indexOf('--slug');
  const listMode = args.includes('--list');

  // ── --list: show all available slugs ───────────────────────────────────────
  if (listMode) {
    console.log('\nAvailable slugs:\n');
    posts.forEach((p, i) =>
      console.log(`  ${String(i + 1).padStart(2, ' ')}. ${p.slug}`)
    );
    console.log('\nUsage: node generate-thumbnails.js --slug <slug>');
    return;
  }

  // ── --slug <name>: generate a single thumbnail ─────────────────────────────
  if (slugIdx !== -1) {
    const targetSlug = args[slugIdx + 1];
    if (!targetSlug) {
      console.error('\n❌  Please provide a slug: --slug your-post-slug');
      console.error('    Run --list to see all available slugs.\n');
      process.exit(1);
    }
    const post = posts.find((p) => p.slug === targetSlug);
    if (!post) {
      console.error(`\n❌  No post found with slug: "${targetSlug}"`);
      console.error('    Run --list to see all available slugs.\n');
      process.exit(1);
    }
    console.log(`\nGenerating thumbnail for: ${targetSlug}\n`);
    try {
      await render(post);
      console.log('\n✅ Done!');
      console.log(`\nNext steps:`);
      console.log(`  cp thumbnails/${targetSlug}-thumb.png public/static/images/`);
      console.log(`  Add to ${targetSlug}.mdx frontmatter:`);
      console.log(`  images: ['/static/images/${targetSlug}-thumb.png']\n`);
    } catch (e) {
      console.error(`❌  ${e.message}`);
      process.exit(1);
    }
    return;
  }

  // ── default: generate ALL thumbnails ───────────────────────────────────────
  console.log(`\nGenerating all ${posts.length} blog thumbnails → ${OUT_DIR}\n`);
  for (const post of posts) {
    try {
      await render(post);
    } catch (e) {
      console.error(`❌  ${post.slug}: ${e.message}`);
    }
  }
  console.log('\n✅ All done!');
  console.log('\nNext steps:');
  console.log('  cp thumbnails/*.png public/static/images/');
  console.log('  (or: npm run thumbnails)\n');
  console.log('Slugs generated:');
  posts.forEach((p, i) =>
    console.log(`  ${String(i + 1).padStart(2, ' ')}. ${p.slug}-thumb.png`)
  );
}

main();
