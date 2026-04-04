'use client'

import { useState } from 'react'
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
            {'// Inbound + Outbound public traffic'}
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
          <p className="mb-4 font-mono text-[11px] text-slate-500">{'// Outbound-only traffic'}</p>
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
    // Full-width stacked — each diagram gets the entire container width
    <div className="space-y-6">
      {/* ── Internet Gateway ── */}
      <div className="agx-c1 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-700/60 px-6 py-4">
          <span className="agx-dot agx-dot-violet h-2.5 w-2.5 shrink-0 rounded-full bg-violet-400" />
          <span className="font-sans text-sm font-bold text-slate-100">Internet Gateway Flow</span>
          <span className="ml-auto font-mono text-[11px] text-slate-400">Bidirectional ⬆⬇</span>
        </div>
        <div className="p-6">
          {/* viewBox doubled in width → every element is twice as large on screen */}
          <svg viewBox="0 0 520 420" className="w-full" aria-label="Internet Gateway flow diagram">
            {/* VNet */}
            <rect
              x="10"
              y="100"
              width="500"
              height="310"
              rx="14"
              fill="rgba(15,23,42,0.85)"
              stroke="#1e3a5f"
              strokeWidth="2"
            />
            <text x="28" y="122" fill="#334155" fontSize="13" fontFamily="monospace">
              Azure VNet
            </text>
            {/* Public Subnet */}
            <rect
              x="28"
              y="134"
              width="464"
              height="266"
              rx="10"
              fill="rgba(124,58,237,0.06)"
              stroke="rgba(167,139,250,0.3)"
              strokeWidth="1.5"
              strokeDasharray="7 4"
            />
            <text x="46" y="154" fill="rgba(167,139,250,0.65)" fontSize="12" fontFamily="monospace">
              Public Subnet — 10.0.1.0/24
            </text>
            {/* Internet cloud */}
            <circle
              cx="260"
              cy="42"
              r="34"
              fill="rgba(124,58,237,0.14)"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth="2"
            />
            <text x="260" y="36" fontSize="18" textAnchor="middle">
              🌐
            </text>
            <text
              x="260"
              y="56"
              fill="#a78bfa"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Internet
            </text>
            {/* Public IP pill */}
            <rect
              x="160"
              y="86"
              width="200"
              height="36"
              rx="9"
              fill="rgba(167,139,250,0.15)"
              stroke="rgba(167,139,250,0.45)"
              strokeWidth="1.5"
            />
            <text
              x="260"
              y="100"
              fill="#c4b5fd"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Public IP
            </text>
            <text
              x="260"
              y="115"
              fill="#a78bfa"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              20.50.100.10
            </text>

            {/* ── Arrow: Internet → Public IP (down) and return (up) ── */}
            {/* 10px gap each side — lines start/end 2px away from element edges */}
            <line
              x1="265"
              y1="78"
              x2="265"
              y2="84"
              stroke="#a78bfa"
              strokeWidth="2.5"
              className="agx-flow-fwd"
            />
            <line
              x1="255"
              y1="84"
              x2="255"
              y2="78"
              stroke="#c4b5fd"
              strokeWidth="1.6"
              className="agx-flow-bwd"
              opacity="0.6"
            />
            <polygon points="265,84 259,75 271,75" fill="#a78bfa" />
            <polygon points="255,78 249,87 261,87" fill="#c4b5fd" opacity="0.65" />

            {/* ── Arrow: Public IP → VM (down) and return (up) — 55px gap ── */}
            <line
              x1="265"
              y1="124"
              x2="265"
              y2="175"
              stroke="#a78bfa"
              strokeWidth="2.5"
              className="agx-flow-fwd"
            />
            <line
              x1="255"
              y1="175"
              x2="255"
              y2="124"
              stroke="#c4b5fd"
              strokeWidth="1.6"
              className="agx-flow-bwd"
              opacity="0.55"
            />
            <polygon points="265,175 259,164 271,164" fill="#a78bfa" />
            <polygon points="255,124 249,135 261,135" fill="#c4b5fd" opacity="0.65" />

            {/* Travelling packet dot */}
            <circle
              cx="265"
              cy="130"
              r="5"
              fill="#a78bfa"
              opacity="0.85"
              className="agx-pkt-down"
            />

            {/* VM box */}
            <rect
              x="100"
              y="177"
              width="320"
              height="86"
              rx="12"
              fill="rgba(15,23,42,0.95)"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth="2"
            />
            <text x="260" y="208" fontSize="22" textAnchor="middle">
              🖥️
            </text>
            <text
              x="260"
              y="232"
              fill="#e2e8f0"
              fontSize="15"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              VM / Web Server
            </text>
            <text
              x="260"
              y="251"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              10.0.1.4 · NIC with Public IP
            </text>

            {/* NSG */}
            <rect
              x="40"
              y="278"
              width="440"
              height="46"
              rx="10"
              fill="rgba(251,146,60,0.07)"
              stroke="rgba(251,146,60,0.3)"
              strokeWidth="1.5"
            />
            <text
              x="260"
              y="296"
              fill="#fb923c"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              🛡 NSG
            </text>
            <text
              x="260"
              y="313"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Inbound: Allow 80, 443 · Outbound: Allow All
            </text>

            {/* Route Table */}
            <rect
              x="40"
              y="334"
              width="440"
              height="40"
              rx="10"
              fill="rgba(96,165,250,0.07)"
              stroke="rgba(96,165,250,0.27)"
              strokeWidth="1.5"
            />
            <text
              x="260"
              y="350"
              fill="#60a5fa"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              📋 Route Table
            </text>
            <text
              x="260"
              y="366"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              0.0.0.0/0 → Internet (default)
            </text>
          </svg>
          <div className="mt-4 rounded-lg border border-violet-900/40 bg-violet-950/20 p-4">
            <p className="mb-1 font-mono text-xs text-violet-400">How it works in Azure</p>
            <p className="text-sm leading-relaxed text-slate-400">
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
          <span className="ml-auto font-mono text-[11px] text-slate-400">Outbound Only ⬆</span>
        </div>
        <div className="p-6">
          <svg viewBox="0 0 520 420" className="w-full" aria-label="NAT Gateway flow diagram">
            {/* VNet */}
            <rect
              x="10"
              y="100"
              width="500"
              height="310"
              rx="14"
              fill="rgba(15,23,42,0.85)"
              stroke="#1e3a5f"
              strokeWidth="2"
            />
            <text x="28" y="122" fill="#334155" fontSize="13" fontFamily="monospace">
              Azure VNet
            </text>
            {/* Private Subnet */}
            <rect
              x="28"
              y="134"
              width="464"
              height="266"
              rx="10"
              fill="rgba(0,180,216,0.04)"
              stroke="rgba(34,211,238,0.22)"
              strokeWidth="1.5"
              strokeDasharray="7 4"
            />
            <text x="46" y="154" fill="rgba(34,211,238,0.55)" fontSize="12" fontFamily="monospace">
              Private Subnet — 10.0.2.0/24
            </text>
            {/* Internet cloud */}
            <circle
              cx="260"
              cy="42"
              r="34"
              fill="rgba(0,180,216,0.09)"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="2"
            />
            <text x="260" y="36" fontSize="18" textAnchor="middle">
              🌐
            </text>
            <text
              x="260"
              y="56"
              fill="#22d3ee"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Internet
            </text>

            {/* NAT Gateway pill */}
            <rect
              x="140"
              y="84"
              width="240"
              height="40"
              rx="10"
              fill="rgba(0,214,143,0.1)"
              stroke="rgba(0,214,143,0.52)"
              strokeWidth="2"
            />
            <text
              x="260"
              y="101"
              fill="#00d68f"
              fontSize="13"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="700"
            >
              🔄 NAT Gateway
            </text>
            <text
              x="260"
              y="117"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Public IP: 20.50.200.99
            </text>

            {/* Outbound-only animated line */}
            <line
              x1="260"
              y1="84"
              x2="260"
              y2="76"
              stroke="#00d68f"
              strokeWidth="3"
              className="agx-flow-bwd"
            />
            <polygon points="260,76 254,84 266,84" fill="#00d68f" />

            {/* VM → NAT outbound */}
            <line
              x1="260"
              y1="124"
              x2="260"
              y2="177"
              stroke="#00d68f"
              strokeWidth="2.5"
              className="agx-flow-bwd"
            />
            <polygon points="260,124 254,133 266,133" fill="#00d68f" />

            {/* Travelling packet (upward) */}
            <circle cx="260" cy="170" r="5" fill="#00d68f" opacity="0.9" className="agx-pkt-up" />

            {/* Blocked inbound X */}
            <g className="agx-blocked">
              <line x1="200" y1="52" x2="224" y2="76" stroke="#f87171" strokeWidth="3" />
              <line x1="224" y1="52" x2="200" y2="76" stroke="#f87171" strokeWidth="3" />
              <text x="186" y="48" fill="#f87171" fontSize="11" fontFamily="monospace">
                BLOCKED
              </text>
            </g>

            {/* VM box */}
            <rect
              x="100"
              y="178"
              width="320"
              height="86"
              rx="12"
              fill="rgba(15,23,42,0.95)"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="2"
            />
            <text x="260" y="209" fontSize="22" textAnchor="middle">
              ⚙️
            </text>
            <text
              x="260"
              y="233"
              fill="#e2e8f0"
              fontSize="15"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              VM / App Server
            </text>
            <text
              x="260"
              y="252"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Private only: 10.0.2.5 · No Public IP
            </text>

            {/* NSG */}
            <rect
              x="40"
              y="279"
              width="440"
              height="46"
              rx="10"
              fill="rgba(251,146,60,0.06)"
              stroke="rgba(251,146,60,0.24)"
              strokeWidth="1.5"
            />
            <text
              x="260"
              y="297"
              fill="#fb923c"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              🛡 NSG
            </text>
            <text
              x="260"
              y="314"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              Inbound: Deny All from Internet · Outbound: Allow
            </text>

            {/* Route Table */}
            <rect
              x="40"
              y="335"
              width="440"
              height="40"
              rx="10"
              fill="rgba(0,214,143,0.06)"
              stroke="rgba(0,214,143,0.24)"
              strokeWidth="1.5"
            />
            <text
              x="260"
              y="351"
              fill="#00d68f"
              fontSize="12"
              textAnchor="middle"
              fontFamily="monospace"
            >
              📋 Route Table
            </text>
            <text
              x="260"
              y="367"
              fill="#64748b"
              fontSize="11"
              textAnchor="middle"
              fontFamily="monospace"
            >
              0.0.0.0/0 → NAT Gateway
            </text>
          </svg>
          <div className="mt-4 rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-4">
            <p className="mb-1 font-mono text-xs text-cyan-400">How it works in Azure</p>
            <p className="text-sm leading-relaxed text-slate-400">
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
        viewBox="0 0 520 680"
        className="w-full"
        aria-label="Production 3-tier Azure architecture"
      >
        {/* ── Internet (top) ── */}
        <circle
          cx="260"
          cy="36"
          r="30"
          fill="rgba(124,58,237,0.1)"
          stroke="rgba(167,139,250,0.45)"
          strokeWidth="2"
        />
        <text x="260" y="30" fontSize="16" textAnchor="middle">
          🌐
        </text>
        <text
          x="260"
          y="50"
          fill="#a78bfa"
          fontSize="12"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Internet
        </text>

        {/* ── VNet outer box ── */}
        <rect
          x="10"
          y="76"
          width="500"
          height="594"
          rx="14"
          fill="rgba(15,23,42,0.6)"
          stroke="#1e3a5f"
          strokeWidth="2"
        />
        <text x="28" y="96" fill="#334155" fontSize="12" fontFamily="monospace">
          Azure VNet 10.0.0.0/16
        </text>

        {/* ══ TIER 1 — Public Subnet ══ */}
        <rect
          x="26"
          y="106"
          width="468"
          height="160"
          rx="10"
          fill="rgba(124,58,237,0.05)"
          stroke="rgba(167,139,250,0.3)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text x="44" y="124" fill="rgba(167,139,250,0.6)" fontSize="12" fontFamily="monospace">
          Public Subnet
        </text>
        <rect
          x="150"
          y="132"
          width="220"
          height="54"
          rx="10"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(167,139,250,0.55)"
          strokeWidth="2"
        />
        <text x="260" y="153" fontSize="16" textAnchor="middle">
          ⚖️
        </text>
        <text
          x="260"
          y="174"
          fill="#c4b5fd"
          fontSize="13"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Load Balancer
        </text>
        <rect
          x="60"
          y="196"
          width="160"
          height="58"
          rx="8"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="1.5"
        />
        <text x="140" y="221" fontSize="16" textAnchor="middle">
          🖥️
        </text>
        <text
          x="140"
          y="242"
          fill="#94a3b8"
          fontSize="12"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Web VM 1
        </text>
        <rect
          x="300"
          y="196"
          width="160"
          height="58"
          rx="8"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="1.5"
        />
        <text x="380" y="221" fontSize="16" textAnchor="middle">
          🖥️
        </text>
        <text
          x="380"
          y="242"
          fill="#94a3b8"
          fontSize="12"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Web VM 2
        </text>

        {/* ══ TIER 2 — Private Subnet ══ */}
        <rect
          x="26"
          y="278"
          width="468"
          height="180"
          rx="10"
          fill="rgba(0,180,216,0.04)"
          stroke="rgba(34,211,238,0.25)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text x="44" y="296" fill="rgba(34,211,238,0.6)" fontSize="12" fontFamily="monospace">
          Private Subnet
        </text>
        <rect
          x="60"
          y="304"
          width="160"
          height="58"
          rx="8"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1.5"
        />
        <text x="140" y="329" fontSize="16" textAnchor="middle">
          ⚙️
        </text>
        <text
          x="140"
          y="350"
          fill="#94a3b8"
          fontSize="12"
          textAnchor="middle"
          fontFamily="monospace"
        >
          App VM 1
        </text>
        <rect
          x="300"
          y="304"
          width="160"
          height="58"
          rx="8"
          fill="rgba(15,23,42,0.85)"
          stroke="rgba(34,211,238,0.35)"
          strokeWidth="1.5"
        />
        <text x="380" y="329" fontSize="16" textAnchor="middle">
          ⚙️
        </text>
        <text
          x="380"
          y="350"
          fill="#94a3b8"
          fontSize="12"
          textAnchor="middle"
          fontFamily="monospace"
        >
          App VM 2
        </text>
        <rect
          x="150"
          y="374"
          width="220"
          height="54"
          rx="10"
          fill="rgba(0,214,143,0.09)"
          stroke="rgba(0,214,143,0.5)"
          strokeWidth="2"
        />
        <text x="260" y="396" fontSize="16" textAnchor="middle">
          🔄
        </text>
        <text
          x="260"
          y="416"
          fill="#00d68f"
          fontSize="13"
          textAnchor="middle"
          fontFamily="monospace"
        >
          NAT Gateway
        </text>

        {/* ══ TIER 3 — DB Subnet ══ */}
        <rect
          x="26"
          y="444"
          width="468"
          height="212"
          rx="10"
          fill="rgba(255,209,102,0.03)"
          stroke="rgba(255,209,102,0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text x="44" y="462" fill="rgba(255,209,102,0.5)" fontSize="12" fontFamily="monospace">
          DB Subnet (fully private)
        </text>
        <rect
          x="50"
          y="470"
          width="190"
          height="72"
          rx="10"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(255,209,102,0.4)"
          strokeWidth="2"
        />
        <text x="145" y="500" fontSize="20" textAnchor="middle">
          🗄️
        </text>
        <text
          x="145"
          y="524"
          fill="#fbbf24"
          fontSize="13"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          PostgreSQL Flexible
        </text>
        <rect
          x="280"
          y="470"
          width="190"
          height="72"
          rx="10"
          fill="rgba(15,23,42,0.95)"
          stroke="rgba(251,146,60,0.35)"
          strokeWidth="2"
        />
        <text x="375" y="500" fontSize="20" textAnchor="middle">
          🔑
        </text>
        <text
          x="375"
          y="524"
          fill="#fb923c"
          fontSize="13"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          Key Vault
        </text>
        <text
          x="145"
          y="556"
          fill="#64748b"
          fontSize="11"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Private Endpoint
        </text>
        <text
          x="375"
          y="556"
          fill="#64748b"
          fontSize="11"
          textAnchor="middle"
          fontFamily="monospace"
        >
          Private Endpoint
        </text>

        {/* ══ ANIMATED ARROWS ══ */}

        {/* Internet ↔ LB: centre column, clear 10px gaps each side */}
        {/* Internet bottom=66, LB top=132 → 66px gap, lines span 68→130 */}
        <line
          x1="265"
          y1="68"
          x2="265"
          y2="130"
          stroke="#a78bfa"
          strokeWidth="2.5"
          className="agx-flow-fwd"
        />
        <line
          x1="255"
          y1="130"
          x2="255"
          y2="68"
          stroke="#c4b5fd"
          strokeWidth="1.5"
          className="agx-flow-bwd"
          opacity="0.5"
        />
        <polygon points="265,130 259,119 271,119" fill="#a78bfa" />
        <polygon points="255,68 249,79 261,79" fill="#c4b5fd" opacity="0.6" />
        <text x="282" y="102" fill="#a78bfa" fontSize="11" fontFamily="monospace">
          ⬆⬇ public
        </text>

        {/* LB → Web VM 1: diagonal from LB left-centre to VM1 top-centre */}
        {/* LB bottom=186, VM1 centre-x=140 top=196 → start (175,186) end (140,196) */}
        <line
          x1="175"
          y1="187"
          x2="142"
          y2="195"
          stroke="#a78bfa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <polygon points="142,195 144,184 153,191" fill="#a78bfa" />

        {/* LB → Web VM 2: symmetric right side */}
        {/* VM2 centre-x=380, start (345,186) end (380,196) */}
        <line
          x1="345"
          y1="187"
          x2="378"
          y2="195"
          stroke="#a78bfa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <polygon points="378,195 367,184 376,191" fill="#a78bfa" />

        {/* Web VM 1 → App VM 1: straight down, centre-x=140 */}
        {/* VM1 bottom=254, AppVM1 top=304 → 50px gap, lines span 256→302 */}
        <line
          x1="140"
          y1="256"
          x2="140"
          y2="302"
          stroke="#60a5fa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <polygon points="140,302 134,291 146,291" fill="#60a5fa" />

        {/* Web VM 2 → App VM 2: straight down, centre-x=380 */}
        <line
          x1="380"
          y1="256"
          x2="380"
          y2="302"
          stroke="#60a5fa"
          strokeWidth="2"
          className="agx-flow-fwd"
        />
        <polygon points="380,302 374,291 386,291" fill="#60a5fa" />
        <text x="404" y="280" fill="#60a5fa" fontSize="11" fontFamily="monospace">
          internal
        </text>

        {/* App VM 1 → NAT GW: down from VM bottom (362) to NAT top (374) = 12px */}
        {/* Use centre of VM1 (140) routing to NAT left-quarter (210) */}
        <line
          x1="200"
          y1="362"
          x2="200"
          y2="372"
          stroke="#00d68f"
          strokeWidth="2"
          className="agx-flow-bwd"
        />
        <polygon points="200,362 194,372 206,372" fill="#00d68f" />

        {/* App VM 2 → NAT GW: from VM2 (380) to NAT right-quarter (320) */}
        <line
          x1="320"
          y1="362"
          x2="320"
          y2="372"
          stroke="#00d68f"
          strokeWidth="2"
          className="agx-flow-bwd"
        />
        <polygon points="320,362 314,372 326,372" fill="#00d68f" />

        {/* NAT GW → Internet outbound: route via RIGHT side to avoid overlapping boxes */}
        {/* NAT right edge=370, route right at x=490, up to y=50, then left to Internet */}
        <line
          x1="372"
          y1="401"
          x2="490"
          y2="401"
          stroke="#00d68f"
          strokeWidth="2"
          className="agx-flow-bwd"
        />
        <line
          x1="490"
          y1="401"
          x2="490"
          y2="50"
          stroke="#00d68f"
          strokeWidth="2"
          className="agx-flow-bwd"
        />
        <line
          x1="490"
          y1="50"
          x2="292"
          y2="50"
          stroke="#00d68f"
          strokeWidth="2"
          className="agx-flow-bwd"
        />
        <polygon points="292,50 303,44 303,56" fill="#00d68f" />
        <text x="392" y="396" fill="#00d68f" fontSize="11" fontFamily="monospace">
          outbound only →
        </text>

        {/* App VM 1 → PostgreSQL: straight down, centre-x=145 */}
        {/* AppVM1 bottom=362, PostgreSQL top=470 → 108px gap via DB subnet (enters at 446) */}
        <line
          x1="145"
          y1="364"
          x2="145"
          y2="468"
          stroke="#fbbf24"
          strokeWidth="2"
          className="agx-flow-fwd"
          strokeDasharray="6 4"
        />
        <polygon points="145,468 139,457 151,457" fill="#fbbf24" />

        {/* App VM 2 → Key Vault: straight down, centre-x=375 */}
        <line
          x1="375"
          y1="364"
          x2="375"
          y2="468"
          stroke="#fb923c"
          strokeWidth="2"
          className="agx-flow-fwd"
          strokeDasharray="6 4"
        />
        <polygon points="375,468 369,457 381,457" fill="#fb923c" />
        <text x="404" y="418" fill="#fbbf24" fontSize="11" fontFamily="monospace">
          private link
        </text>
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

  // SSR is handled by the ClientOnly wrapper in the MDX file —
  // this component is never evaluated during static generation.
  const content: Record<TabId, ReactNode> = {
    overview: <Overview />,
    diagrams: <Diagrams />,
    production: <Production />,
    comparison: <Comparison />,
    usecases: <UseCases />,
  }

  return (
    <>
      {/* Scoped @keyframes — injected client-side only, never during SSR */}
      <style dangerouslySetInnerHTML={{ __html: ANIMATION_STYLES }} />

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
        <div className="agx-hdr relative mb-9 text-center">
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
        <div className="agx-tabs relative mb-7 flex gap-1 overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-800/50 p-1">
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
        <div className="agx-body relative">{content[activeTab]}</div>
      </div>
    </>
  )
}
