'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'diagrams' | 'production' | 'comparison' | 'usecases'

interface Tab {
  id: TabId
  label: string
}

interface Scenario {
  title: string
  body: string
}

interface UseCaseColumn {
  emoji: string
  title: string
  scenarios: Scenario[]
  accentText: string
  accentBorder: string
  accentBg: string
  bottomGradient: string
}

interface TierAnnotation {
  color: string
  border: string
  bg: string
  label: string
  body: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'diagrams', label: 'Architecture' },
  { id: 'production', label: 'Production' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'usecases', label: 'Use Cases' },
]

const COMPARISON_ROWS: [string, string, string][] = [
  ['Traffic Direction', 'Inbound + Outbound (Bidirectional)', 'Outbound Only'],
  ['Azure Resource', 'Public IP on NIC / Load Balancer', 'Azure NAT Gateway (managed service)'],
  ['VM has Public IP?', '✓  YES', '✗  NO'],
  ['Internet Reachable?', '✓  YES', '✗  NO'],
  [
    'Subnet Type',
    'Public Subnet (internet route in table)',
    'Private Subnet (NAT GW in route table)',
  ],
  [
    'Primary Use Case',
    'Web servers, Bastion Hosts, Load Balancers',
    'App servers, DB patching, package downloads',
  ],
  [
    'Security Posture',
    'NSG required to restrict inbound access',
    'Inherently private — no inbound attack surface',
  ],
  [
    'SNAT Behaviour',
    'Default SNAT (unpredictable public IP)',
    'Dedicated, predictable static Public IP',
  ],
  [
    'Scale',
    '1 Public IP per NIC (multiple attachable)',
    'Up to 16 Public IPs · 64 K SNAT ports/IP',
  ],
  ['Cost Model', 'Pay per Public IP + data transfer', 'Pay per NAT GW hour + data processed'],
  ['Managed by Azure?', 'Partial — you manage NSG + routing', 'Fully Managed — HA built-in'],
  [
    'SNAT Port Exhaustion Risk',
    'High (default SNAT has limited ports)',
    'Low (64 K ports/IP, add IPs to scale)',
  ],
]

const INTERNET_SCENARIOS: Scenario[] = [
  {
    title: 'E-Commerce Web Frontend',
    body: 'Nginx / Apache web servers must be reachable by customers. Assign a Public IP to the Load Balancer, place it in the public subnet. NSG allows 443 inbound.',
  },
  {
    title: 'Bastion Host / Jump Server',
    body: 'A hardened VM that admins SSH into from the internet to reach private resources. Public IP on this one VM only — strict NSG allows SSH from office IP only.',
  },
  {
    title: 'Public API Endpoint',
    body: 'REST APIs consumed by mobile apps or third-party services. Azure API Management or Application Gateway sits in the public subnet with a Public IP.',
  },
]

const NAT_SCENARIOS: Scenario[] = [
  {
    title: 'App Server OS Updates',
    body: 'Backend app VMs need to pull packages from apt / yum repos or download Docker images — outbound only. NAT Gateway provides this without exposing VMs.',
  },
  {
    title: 'Calling External APIs',
    body: 'Private app servers call Stripe, SendGrid, or third-party APIs. NAT Gateway provides a static, predictable public IP you can whitelist on the third-party side.',
  },
  {
    title: 'AKS Node Pools (Private Cluster)',
    body: 'Kubernetes nodes in a private AKS cluster need to pull images from Docker Hub. NAT Gateway is the standard solution — no public IPs on nodes.',
  },
]

// ─── Scoped animation styles ──────────────────────────────────────────────────
// All class names are prefixed `agx-` to avoid collisions with global CSS.
// Injected via <style dangerouslySetInnerHTML> so @keyframes survive
// Next.js App Router + Contentlayer2 MDX rendering without a CSS module.

const ANIMATION_STYLES = `
  /* ── Flowing dashed arrows ───────────────────────────────── */
  @keyframes agx-dash-fwd {
    to { stroke-dashoffset: -24; }
  }
  @keyframes agx-dash-bwd {
    to { stroke-dashoffset: 24; }
  }
  .agx-flow-fwd {
    stroke-dasharray: 7 5;
    animation: agx-dash-fwd 0.85s linear infinite;
  }
  .agx-flow-bwd {
    stroke-dasharray: 7 5;
    animation: agx-dash-bwd 0.85s linear infinite;
  }

  /* ── Travelling packet dots ──────────────────────────────── */
  @keyframes agx-travel-down {
    0%   { cy: 74px;  opacity: 1; }
    75%  { cy: 154px; opacity: 1; }
    100% { cy: 154px; opacity: 0; }
  }
  @keyframes agx-travel-up {
    0%   { opacity: 0; transform: translateY(0);    }
    15%  { opacity: 1; transform: translateY(0);    }
    100% { opacity: 1; transform: translateY(-52px); }
  }
  .agx-pkt-down {
    animation: agx-travel-down 1.9s ease-in-out infinite;
  }
  .agx-pkt-up {
    animation: agx-travel-up 1.9s ease-in-out infinite;
  }

  /* ── Entrance animations ─────────────────────────────────── */
  @keyframes agx-fade-down {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes agx-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .agx-hdr  { animation: agx-fade-down 0.5s ease both; }
  .agx-tabs { animation: agx-fade-down 0.5s 0.07s ease both; }
  .agx-body { animation: agx-fade-up   0.45s 0.12s ease both; }

  /* staggered card entrances */
  .agx-c1 { animation: agx-fade-up 0.45s 0.04s ease both; }
  .agx-c2 { animation: agx-fade-up 0.45s 0.12s ease both; }
  .agx-c3 { animation: agx-fade-up 0.45s 0.20s ease both; }

  /* ── Pulsing status dot ──────────────────────────────────── */
  @keyframes agx-ring {
    0%   { transform: scale(1);    opacity: 0.7; }
    70%  { transform: scale(2.4);  opacity: 0;   }
    100% { transform: scale(2.4);  opacity: 0;   }
  }
  .agx-dot {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .agx-dot::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    animation: agx-ring 1.9s ease-out infinite;
  }
  .agx-dot-violet::before { background: #a78bfa; }
  .agx-dot-cyan::before   { background: #22d3ee; }

  /* ── Blocked X flashing ──────────────────────────────────── */
  @keyframes agx-blink {
    0%, 100% { opacity: 1;   }
    50%       { opacity: 0.25; }
  }
  .agx-blocked { animation: agx-blink 1.5s ease-in-out infinite; }

  /* ── Tab active pop-in ───────────────────────────────────── */
  @keyframes agx-pop {
    from { opacity: 0.5; transform: scale(0.95); }
    to   { opacity: 1;   transform: scale(1);    }
  }
  .agx-active { animation: agx-pop 0.18s ease both; }

  /* ── Comparison row hover ────────────────────────────────── */
  .agx-row { transition: background 0.15s ease; }
  .agx-row:hover { background: rgba(148,163,184,0.04); }

  /* ── Use-case card hover ─────────────────────────────────── */
  .agx-uc-item {
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .agx-uc-item:hover {
    border-color: rgba(148,163,184,0.3);
    background: rgba(30,41,59,0.7);
  }

  /* ── Golden rule border shimmer ──────────────────────────── */
  @keyframes agx-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  .agx-shimmer {
    border-image: linear-gradient(
      90deg,
      rgba(14,165,233,0.2)  0%,
      rgba(6,182,212,0.6)   50%,
      rgba(14,165,233,0.2)  100%
    ) 1;
    background-size: 300% auto;
    animation: agx-shimmer 3.5s linear infinite;
  }
`

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[10px] tracking-[3px] text-sky-400/70 uppercase">
      {children}
    </p>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────

function Overview() {
  const internetPoints = [
    'Resources get a public IP',
    'Reachable from the internet',
    'Bidirectional traffic flow',
    'Azure: Public IP + Public Subnet',
    'Used for web servers, bastion hosts',
  ]
  const natPoints = [
    'Resources stay private',
    'NOT reachable from internet',
    'Outbound only — translates private IP',
    'Azure: NAT Gateway on Private Subnet',
    'Used for app servers, DB patching',
  ]

  return (
    <div className="space-y-6">
      {/* VS strip */}
      <div className="grid grid-cols-[1fr_56px_1fr] overflow-hidden rounded-2xl border border-slate-700/60">
        {/* Internet card */}
        <div className="agx-c1 relative bg-slate-900 p-7">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-700 to-violet-400" />
          <div className="mb-3 text-3xl">🌐</div>
          <h2 className="mb-1 font-sans text-lg font-bold text-violet-400">Internet Gateway</h2>
          <p className="mb-4 font-mono text-[11px] text-slate-500">
            // Inbound + Outbound public traffic
          </p>
          <ul className="space-y-2">
            {internetPoints.map((item) => (
              <li key={item} className="relative pl-4 text-[13px] text-slate-400">
                <span className="absolute left-0 font-mono text-violet-400">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* VS */}
        <div className="flex items-center justify-center border-y border-slate-700/60 bg-slate-800/60 font-mono text-[13px] font-bold tracking-widest text-slate-500">
          VS
        </div>
        {/* NAT card */}
        <div className="agx-c2 relative bg-slate-900 p-7">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 to-emerald-400" />
          <div className="mb-3 text-3xl">🔒</div>
          <h2 className="mb-1 font-sans text-lg font-bold text-cyan-400">NAT Gateway</h2>
          <p className="mb-4 font-mono text-[11px] text-slate-500">// Outbound-only traffic</p>
          <ul className="space-y-2">
            {natPoints.map((item) => (
              <li key={item} className="relative pl-4 text-[13px] text-slate-400">
                <span className="absolute left-0 font-mono text-cyan-400">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Golden rule */}
      <div
        className="agx-c3 agx-shimmer flex gap-4 rounded-xl border border-sky-800/40 p-5"
        style={{ background: 'linear-gradient(135deg,rgba(8,47,73,0.55),rgba(8,51,68,0.35))' }}
      >
        <span className="shrink-0 text-2xl">💡</span>
        <div>
          <h4 className="mb-1 font-sans text-sm font-bold text-sky-300">
            The Golden Rule for DevOps Interviews
          </h4>
          <p className="text-[13px] leading-relaxed text-slate-400">
            <strong className="text-slate-200">
              Internet Gateway = someone on the internet can reach YOU.
            </strong>{' '}
            <strong className="text-slate-200">
              NAT Gateway = YOU can reach the internet, but nobody can reach you back.
            </strong>{' '}
            In production, your web tier uses Public IPs, your app/DB tier uses NAT Gateway (or no
            internet at all). This is the{' '}
            <strong className="text-slate-200">defense-in-depth</strong> principle — minimise your
            attack surface by keeping backend resources private.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Architecture Diagrams ────────────────────────────────────────────────────

function Diagrams() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ── Internet Gateway ── */}
      <div className="agx-c1 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-4">
          <span className="agx-dot agx-dot-violet h-2.5 w-2.5 shrink-0 rounded-full bg-violet-400" />
          <span className="font-sans text-sm font-bold text-slate-100">Internet Gateway Flow</span>
          <span className="ml-auto font-mono text-[10px] text-slate-500">Bidirectional ⬆⬇</span>
        </div>
        <div className="p-6">
          <svg viewBox="0 0 360 395" className="w-full" aria-label="Internet Gateway flow diagram">
            {/* VNet */}
            <rect
              x="10"
              y="96"
              width="340"
              height="289"
              rx="12"
              fill="rgba(15,23,42,0.85)"
              stroke="#1e3a5f"
              strokeWidth="1.5"
            />
            <text x="22" y="114" fill="#334155" fontSize="9" fontFamily="monospace">
              Azure VNet
            </text>
            {/* Public Subnet */}
            <rect
              x="28"
              y="124"
              width="304"
              height="251"
              rx="8"
              fill="rgba(124,58,237,0.06)"
              stroke="rgba(167,139,250,0.3)"
              strokeWidth="1"
              strokeDasharray="5 3"
            />
            <text x="40" y="141" fill="rgba(167,139,250,0.55)" fontSize="8" fontFamily="monospace">
              Public Subnet 10.0.1.0/24
            </text>
            {/* Internet cloud */}
            <circle
              cx="180"
              cy="40"
              r="30"
              fill="rgba(124,58,237,0.14)"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth="1.5"
            />
            <text x="180" y="36" fontSize="13" textAnchor="middle">
              🌐
            </text>
            <text
              x="180"
              y="52"
              fill="#a78bfa"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Internet
            </text>
            {/* Public IP pill */}
            <rect
              x="118"
              y="80"
              width="124"
              height="28"
              rx="7"
              fill="rgba(167,139,250,0.15)"
              stroke="rgba(167,139,250,0.45)"
              strokeWidth="1"
            />
            <text
              x="180"
              y="93"
              fill="#c4b5fd"
              fontSize="7.5"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Public IP
            </text>
            <text
              x="180"
              y="104"
              fill="#a78bfa"
              fontSize="7.5"
              textAnchor="middle"
              fontFamily="monospace"
            >
              20.50.100.10
            </text>

            {/* Animated flowing lines — bidirectional */}
            <line
              x1="180"
              y1="70"
              x2="180"
              y2="79"
              stroke="#a78bfa"
              strokeWidth="2.2"
              className="agx-flow-fwd"
            />
            <line
              x1="175"
              y1="79"
              x2="175"
              y2="70"
              stroke="#c4b5fd"
              strokeWidth="1.3"
              className="agx-flow-bwd"
              opacity="0.55"
            />
            <line
              x1="180"
              y1="108"
              x2="180"
              y2="164"
              stroke="#a78bfa"
              strokeWidth="2"
              className="agx-flow-fwd"
            />
            <line
              x1="175"
              y1="164"
              x2="175"
              y2="108"
              stroke="#c4b5fd"
              strokeWidth="1.3"
              className="agx-flow-bwd"
              opacity="0.5"
            />

            {/* Arrowheads */}
            <polygon points="180,79  175,71  185,71" fill="#a78bfa" />
            <polygon points="175,108 170,116 180,116" fill="#c4b5fd" opacity="0.7" />
            <polygon points="180,164 175,156 185,156" fill="#a78bfa" />

            {/* Travelling packet dot */}
            <circle
              cx="180"
              cy="74"
              r="3.8"
              fill="#a78bfa"
              opacity="0.85"
              className="agx-pkt-down"
            />

            {/* VM box */}
            <rect
              x="85"
              y="165"
              width="190"
              height="68"
              rx="10"
              fill="rgba(15,23,42,0.95)"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth="1.5"
            />
            <text x="180" y="190" fontSize="16" textAnchor="middle">
              🖥️
            </text>
            <text
              x="180"
              y="210"
              fill="#e2e8f0"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              VM / Web Server
            </text>
            <text
              x="180"
              y="223"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              10.0.1.4 · NIC with Public IP
            </text>

            {/* NSG */}
            <rect
              x="48"
              y="254"
              width="264"
              height="36"
              rx="8"
              fill="rgba(251,146,60,0.07)"
              stroke="rgba(251,146,60,0.3)"
              strokeWidth="1"
            />
            <text
              x="180"
              y="269"
              fill="#fb923c"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              🛡 NSG
            </text>
            <text
              x="180"
              y="281"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Inbound: Allow 80, 443 · Outbound: Allow All
            </text>
            {/* Route Table */}
            <rect
              x="48"
              y="300"
              width="264"
              height="30"
              rx="8"
              fill="rgba(96,165,250,0.07)"
              stroke="rgba(96,165,250,0.27)"
              strokeWidth="1"
            />
            <text
              x="180"
              y="313"
              fill="#60a5fa"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              📋 Route Table
            </text>
            <text
              x="180"
              y="324"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              0.0.0.0/0 → Internet (default)
            </text>
          </svg>
          <div className="mt-3 rounded-lg border border-violet-900/40 bg-violet-950/20 p-3">
            <p className="mb-1 font-mono text-[10px] text-violet-400">How it works in Azure</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              No standalone "Internet Gateway" resource exists in Azure. Internet access is achieved
              by assigning a <span className="text-violet-300">Public IP</span> to a NIC or Load
              Balancer and configuring the Route Table with a default internet route. The{' '}
              <span className="text-violet-300">NSG</span> controls what inbound traffic is
              permitted.
            </p>
          </div>
        </div>
      </div>

      {/* ── NAT Gateway ── */}
      <div className="agx-c2 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-4">
          <span className="agx-dot agx-dot-cyan h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
          <span className="font-sans text-sm font-bold text-slate-100">NAT Gateway Flow</span>
          <span className="ml-auto font-mono text-[10px] text-slate-500">Outbound Only ⬆</span>
        </div>
        <div className="p-6">
          <svg viewBox="0 0 360 395" className="w-full" aria-label="NAT Gateway flow diagram">
            {/* VNet */}
            <rect
              x="10"
              y="96"
              width="340"
              height="289"
              rx="12"
              fill="rgba(15,23,42,0.85)"
              stroke="#1e3a5f"
              strokeWidth="1.5"
            />
            <text x="22" y="114" fill="#334155" fontSize="9" fontFamily="monospace">
              Azure VNet
            </text>
            {/* Private Subnet */}
            <rect
              x="28"
              y="124"
              width="304"
              height="251"
              rx="8"
              fill="rgba(0,180,216,0.04)"
              stroke="rgba(34,211,238,0.22)"
              strokeWidth="1"
              strokeDasharray="5 3"
            />
            <text x="40" y="141" fill="rgba(34,211,238,0.45)" fontSize="8" fontFamily="monospace">
              Private Subnet 10.0.2.0/24
            </text>
            {/* Internet cloud */}
            <circle
              cx="180"
              cy="40"
              r="30"
              fill="rgba(0,180,216,0.09)"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="1.5"
            />
            <text x="180" y="36" fontSize="13" textAnchor="middle">
              🌐
            </text>
            <text
              x="180"
              y="52"
              fill="#22d3ee"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Internet
            </text>

            {/* NAT Gateway pill */}
            <rect
              x="106"
              y="78"
              width="148"
              height="32"
              rx="8"
              fill="rgba(0,214,143,0.1)"
              stroke="rgba(0,214,143,0.52)"
              strokeWidth="1.8"
            />
            <text
              x="180"
              y="93"
              fill="#00d68f"
              fontSize="9"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="700"
            >
              🔄 NAT Gateway
            </text>
            <text
              x="180"
              y="105"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Public IP: 20.50.200.99
            </text>

            {/* Outbound-only animated line (upward) */}
            <line
              x1="180"
              y1="78"
              x2="180"
              y2="70"
              stroke="#00d68f"
              strokeWidth="2.5"
              className="agx-flow-bwd"
            />
            <polygon points="180,70  175,77  185,77" fill="#00d68f" />

            {/* VM → NAT outbound */}
            <line
              x1="180"
              y1="112"
              x2="180"
              y2="164"
              stroke="#00d68f"
              strokeWidth="2"
              className="agx-flow-bwd"
            />
            <polygon points="180,112 175,120 185,120" fill="#00d68f" />

            {/* Travelling packet (upward) */}
            <circle cx="180" cy="160" r="3.8" fill="#00d68f" opacity="0.9" className="agx-pkt-up" />

            {/* Blocked inbound X */}
            <g className="agx-blocked">
              <line x1="144" y1="50" x2="162" y2="68" stroke="#f87171" strokeWidth="2.2" />
              <line x1="162" y1="50" x2="144" y2="68" stroke="#f87171" strokeWidth="2.2" />
              <text x="132" y="47" fill="#f87171" fontSize="7" fontFamily="monospace">
                BLOCKED
              </text>
            </g>

            {/* VM box */}
            <rect
              x="85"
              y="165"
              width="190"
              height="68"
              rx="10"
              fill="rgba(15,23,42,0.95)"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="1.5"
            />
            <text x="180" y="190" fontSize="16" textAnchor="middle">
              ⚙️
            </text>
            <text
              x="180"
              y="210"
              fill="#e2e8f0"
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              VM / App Server
            </text>
            <text
              x="180"
              y="223"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Private only: 10.0.2.5 · No Public IP
            </text>

            {/* NSG */}
            <rect
              x="48"
              y="254"
              width="264"
              height="36"
              rx="8"
              fill="rgba(251,146,60,0.06)"
              stroke="rgba(251,146,60,0.24)"
              strokeWidth="1"
            />
            <text
              x="180"
              y="269"
              fill="#fb923c"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              🛡 NSG
            </text>
            <text
              x="180"
              y="281"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Inbound: Deny All from Internet · Outbound: Allow
            </text>
            {/* Route Table */}
            <rect
              x="48"
              y="300"
              width="264"
              height="30"
              rx="8"
              fill="rgba(0,214,143,0.06)"
              stroke="rgba(0,214,143,0.24)"
              strokeWidth="1"
            />
            <text
              x="180"
              y="313"
              fill="#00d68f"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              📋 Route Table
            </text>
            <text
              x="180"
              y="324"
              fill="#475569"
              fontSize="7"
              textAnchor="middle"
              fontFamily="monospace"
            >
              0.0.0.0/0 → NAT Gateway
            </text>
          </svg>
          <div className="mt-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-3">
            <p className="mb-1 font-mono text-[10px] text-cyan-400">How it works in Azure</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              <span className="text-cyan-300">Azure NAT Gateway</span> is a fully managed resource
              attached to a subnet. VMs get <span className="text-cyan-300">no public IP</span> and
              cannot be reached from the internet — but they CAN initiate outbound connections. NAT
              Gateway translates their private IP to its own static public IP.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Production Architecture ──────────────────────────────────────────────────

function Production() {
  const tiers: TierAnnotation[] = [
    {
      color: 'text-violet-400',
      border: 'border-violet-900/40',
      bg: 'bg-violet-950/20',
      label: 'Public Subnet',
      body: 'Load Balancer + Web VMs have Public IPs. Reachable from internet. NSG allows 80/443 inbound.',
    },
    {
      color: 'text-cyan-400',
      border: 'border-cyan-900/40',
      bg: 'bg-cyan-950/20',
      label: 'Private Subnet + NAT',
      body: 'App VMs have no public IP. NAT Gateway provides outbound access for OS updates and API calls.',
    },
    {
      color: 'text-amber-400',
      border: 'border-amber-900/30',
      bg: 'bg-amber-950/10',
      label: 'DB Subnet (Isolated)',
      body: 'PostgreSQL and Key Vault on Private Endpoints. Zero internet exposure. Internal traffic only.',
    },
  ]

  return (
    <div className="agx-c1 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 p-7">
      <h3 className="mb-1 font-sans text-base font-bold text-sky-300">
        Production Architecture: Using Both Together
      </h3>
      <p className="mb-6 text-[13px] leading-relaxed text-slate-500">
        In a real Azure production environment, both patterns coexist — internet-facing resources in
        a public subnet, and backend resources in a private subnet with NAT Gateway for controlled
        outbound-only access.
      </p>

      <svg
        viewBox="0 0 920 302"
        className="w-full"
        aria-label="Production 3-tier Azure architecture"
      >
        {/* Internet */}
        <circle
          cx="56"
          cy="151"
          r="44"
          fill="rgba(124,58,237,0.08)"
          stroke="rgba(167,139,250,0.4)"
          strokeWidth="1.5"
        />
        <text x="56" y="146" fontSize="16" textAnchor="middle">
          🌐
        </text>
        <text x="56" y="163" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">
          Internet
        </text>

        {/* VNet */}
        <rect
          x="116"
          y="18"
          width="790"
          height="266"
          rx="14"
          fill="rgba(15,23,42,0.6)"
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />
        <text x="132" y="36" fill="#334155" fontSize="9" fontFamily="monospace">
          Azure VNet 10.0.0.0/16
        </text>

        {/* Public Subnet */}
        <rect
          x="132"
          y="46"
          width="206"
          height="218"
          rx="10"
          fill="rgba(124,58,237,0.05)"
          stroke="rgba(167,139,250,0.28)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="235"
          y="62"
          fill="rgba(167,139,250,0.45)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Public Subnet
        </text>
        <rect
          x="158"
          y="72"
          width="154"
          height="46"
          rx="8"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(167,139,250,0.5)"
          strokeWidth="1.5"
        />
        <text x="235" y="92" fontSize="12" textAnchor="middle">
          ⚖️
        </text>
        <text
          x="235"
          y="109"
          fill="#c4b5fd"
          fontSize="9"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Load Balancer
        </text>
        <rect
          x="150"
          y="136"
          width="64"
          height="46"
          rx="6"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="1"
        />
        <text x="182" y="156" fontSize="10" textAnchor="middle">
          🖥️
        </text>
        <text
          x="182"
          y="172"
          fill="#94a3b8"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Web VM
        </text>
        <rect
          x="258"
          y="136"
          width="64"
          height="46"
          rx="6"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="1"
        />
        <text x="290" y="156" fontSize="10" textAnchor="middle">
          🖥️
        </text>
        <text
          x="290"
          y="172"
          fill="#94a3b8"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Web VM
        </text>

        {/* Private Subnet */}
        <rect
          x="370"
          y="46"
          width="206"
          height="218"
          rx="10"
          fill="rgba(0,180,216,0.04)"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="473"
          y="62"
          fill="rgba(34,211,238,0.45)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Private Subnet
        </text>
        <rect
          x="384"
          y="72"
          width="64"
          height="46"
          rx="6"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(34,211,238,0.32)"
          strokeWidth="1"
        />
        <text x="416" y="92" fontSize="10" textAnchor="middle">
          ⚙️
        </text>
        <text
          x="416"
          y="108"
          fill="#94a3b8"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
        >
          App VM
        </text>
        <rect
          x="494"
          y="72"
          width="64"
          height="46"
          rx="6"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(34,211,238,0.32)"
          strokeWidth="1"
        />
        <text x="526" y="92" fontSize="10" textAnchor="middle">
          ⚙️
        </text>
        <text
          x="526"
          y="108"
          fill="#94a3b8"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
        >
          App VM
        </text>
        <rect
          x="386"
          y="148"
          width="156"
          height="44"
          rx="8"
          fill="rgba(0,214,143,0.08)"
          stroke="rgba(0,214,143,0.44)"
          strokeWidth="1.5"
        />
        <text x="464" y="167" fontSize="11" textAnchor="middle">
          🔄
        </text>
        <text
          x="464"
          y="183"
          fill="#00d68f"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          NAT Gateway
        </text>

        {/* DB Subnet */}
        <rect
          x="610"
          y="46"
          width="280"
          height="218"
          rx="10"
          fill="rgba(255,209,102,0.03)"
          stroke="rgba(255,209,102,0.18)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="750"
          y="62"
          fill="rgba(255,209,102,0.38)"
          fontSize="8"
          textAnchor="middle"
          fontFamily="monospace"
        >
          DB Subnet (fully private)
        </text>
        <rect
          x="628"
          y="78"
          width="172"
          height="56"
          rx="8"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(255,209,102,0.34)"
          strokeWidth="1.5"
        />
        <text x="714" y="102" fontSize="14" textAnchor="middle">
          🗄️
        </text>
        <text
          x="714"
          y="122"
          fill="#fbbf24"
          fontSize="9"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          PostgreSQL Flexible
        </text>
        <rect
          x="628"
          y="150"
          width="172"
          height="54"
          rx="8"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(251,146,60,0.3)"
          strokeWidth="1.5"
        />
        <text x="714" y="173" fontSize="12" textAnchor="middle">
          🔑
        </text>
        <text
          x="714"
          y="193"
          fill="#fb923c"
          fontSize="9"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Key Vault
        </text>

        {/* ── Animated arrows ── */}

        {/* Internet ↔ LB  (bidirectional) */}
        <line
          x1="100"
          y1="140"
          x2="156"
          y2="106"
          stroke="#a78bfa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <line
          x1="103"
          y1="145"
          x2="159"
          y2="111"
          stroke="#c4b5fd"
          strokeWidth="1.2"
          className="agx-flow-bwd"
          opacity="0.5"
        />
        <polygon points="156,106 147,107 151,115" fill="#a78bfa" />
        <polygon points="100,140 108,133 104,142" fill="#c4b5fd" opacity="0.65" />

        {/* LB → Web VMs */}
        <line
          x1="212"
          y1="118"
          x2="190"
          y2="134"
          stroke="#a78bfa"
          strokeWidth="1.5"
          className="agx-flow-fwd"
        />
        <polygon points="190,134 185,126 194,126" fill="#a78bfa" />
        <line
          x1="258"
          y1="118"
          x2="278"
          y2="134"
          stroke="#a78bfa"
          strokeWidth="1.5"
          className="agx-flow-fwd"
        />
        <polygon points="278,134 273,126 282,126" fill="#a78bfa" />

        {/* Web → App  internal */}
        <line
          x1="338"
          y1="97"
          x2="382"
          y2="97"
          stroke="#60a5fa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <polygon points="382,97 374,93 374,101" fill="#60a5fa" />
        <text x="360" y="91" fill="#60a5fa" fontSize="7" textAnchor="middle" fontFamily="monospace">
          internal
        </text>

        {/* App → NAT */}
        <line
          x1="437"
          y1="118"
          x2="437"
          y2="146"
          stroke="#00d68f"
          strokeWidth="1.6"
          className="agx-flow-bwd"
        />
        <polygon points="437,118 432,126 442,126" fill="#00d68f" />

        {/* NAT → Internet  outbound only */}
        <line
          x1="384"
          y1="166"
          x2="120"
          y2="158"
          stroke="#00d68f"
          strokeWidth="1.8"
          className="agx-flow-bwd"
        />
        <polygon points="120,158 129,154 128,162" fill="#00d68f" />
        <text
          x="254"
          y="178"
          fill="#00d68f"
          fontSize="7"
          textAnchor="middle"
          fontFamily="monospace"
        >
          outbound only
        </text>

        {/* App → DB  private link */}
        <line
          x1="576"
          y1="97"
          x2="626"
          y2="107"
          stroke="#fbbf24"
          strokeWidth="1.6"
          className="agx-flow-fwd"
        />
        <polygon points="626,107 618,101 618,110" fill="#fbbf24" />
        <text x="601" y="92" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">
          private link
        </text>

        {/* Travelling packet dots */}
        <circle
          cx="128"
          cy="149"
          r="3.5"
          fill="#a78bfa"
          opacity="0.8"
          style={{ animation: 'agx-dash-fwd 2s linear infinite' }}
        />
        <circle
          cx="437"
          cy="138"
          r="3.2"
          fill="#00d68f"
          opacity="0.85"
          style={{ animation: 'agx-travel-up 2s 0.5s ease-in-out infinite' }}
        />
      </svg>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tiers.map((t, i) => (
          <div key={t.label} className={`agx-c${i + 1} rounded-lg border p-3 ${t.border} ${t.bg}`}>
            <p className={`mb-1 font-mono text-[10px] ${t.color}`}>{t.label}</p>
            <p className="text-[11px] leading-relaxed text-slate-500">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function Comparison() {
  const headers = ['Attribute', 'Internet Gateway (Public IP)', 'NAT Gateway'] as const

  return (
    <div>
      <SectionLabel>Detailed Comparison</SectionLabel>
      <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-800/70">
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`border-b border-slate-700/60 px-5 py-3 text-left font-mono text-[10px] tracking-wide uppercase ${
                      i === 0 ? 'text-slate-300' : i === 1 ? 'text-violet-300' : 'text-cyan-300'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(([attr, internet, nat]) => (
                <tr key={attr} className="agx-row border-b border-slate-800/60 last:border-0">
                  <td className="px-5 py-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                    {attr}
                  </td>
                  <td className="px-5 py-3 text-[12px] leading-relaxed text-violet-200/80">
                    {internet}
                  </td>
                  <td className="px-5 py-3 text-[12px] leading-relaxed text-cyan-200/80">{nat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

function UseCases() {
  const columns: UseCaseColumn[] = [
    {
      emoji: '🌐',
      title: 'When to use Internet Gateway (Public IP)',
      scenarios: INTERNET_SCENARIOS,
      accentText: 'text-violet-400',
      accentBorder: 'border-violet-900/40',
      accentBg: 'bg-violet-950/20',
      bottomGradient: 'from-transparent via-violet-500 to-transparent',
    },
    {
      emoji: '🔒',
      title: 'When to use NAT Gateway',
      scenarios: NAT_SCENARIOS,
      accentText: 'text-cyan-400',
      accentBorder: 'border-cyan-900/40',
      accentBg: 'bg-cyan-950/20',
      bottomGradient: 'from-transparent via-cyan-500 to-transparent',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {columns.map((col, ci) => (
        <div
          key={col.title}
          className={`agx-c${ci + 1} relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 p-6`}
        >
          <div
            className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${col.bottomGradient}`}
          />
          <h4 className="mb-5 flex items-center gap-2 font-sans text-[13px] font-bold text-slate-100">
            <span className="text-base">{col.emoji}</span>
            {col.title}
          </h4>
          <div className="space-y-3">
            {col.scenarios.map((s) => (
              <div
                key={s.title}
                className="agx-uc-item rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
              >
                <p className={`mb-1 font-mono text-[11px] font-bold ${col.accentText}`}>
                  {s.title}
                </p>
                <p className="text-[12px] leading-relaxed text-slate-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function AzureGatewayExplainer() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [mounted, setMounted] = useState(false)

  // Prevent SSR / hydration mismatch — animations only run client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  const content: Record<TabId, ReactNode> = {
    overview: <Overview />,
    diagrams: <Diagrams />,
    production: <Production />,
    comparison: <Comparison />,
    usecases: <UseCases />,
  }

  return (
    <>
      {/* Scoped @keyframes — safe in Next.js App Router + Contentlayer2 MDX */}
      {mounted && <style dangerouslySetInnerHTML={{ __html: ANIMATION_STYLES }} />}

      <div className="relative my-8 overflow-hidden rounded-3xl border border-slate-700/50 bg-[#0a0e1a] p-6 shadow-2xl sm:p-8">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,120,212,0.07) 0%, transparent 70%), ' +
              'radial-gradient(ellipse 50% 30% at 80% 80%, rgba(0,180,216,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div className={`relative mb-9 text-center ${mounted ? 'agx-hdr' : 'opacity-0'}`}>
          <span className="mb-3 inline-block rounded-full border border-sky-800/60 bg-sky-900/30 px-3 py-1 font-mono text-[10px] tracking-[2px] text-sky-400 uppercase">
            Azure Networking
          </span>
          <h2 className="mb-2 bg-gradient-to-br from-white to-sky-300 bg-clip-text font-sans text-3xl leading-tight font-extrabold text-transparent sm:text-4xl">
            Internet Gateway vs NAT Gateway
          </h2>
          <p className="text-sm text-slate-500">
            Traffic direction, use cases, and architecture patterns on Azure
          </p>
        </div>

        {/* Tab bar */}
        <div
          className={`relative mb-7 flex gap-1 overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-800/50 p-1 ${mounted ? 'agx-tabs' : 'opacity-0'}`}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 font-mono text-[11px] whitespace-nowrap transition-all duration-200 ${
                activeTab === t.id
                  ? 'agx-active bg-sky-600 font-semibold text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`relative ${mounted ? 'agx-body' : 'opacity-0'}`}>{content[activeTab]}</div>
      </div>
    </>
  )
}
