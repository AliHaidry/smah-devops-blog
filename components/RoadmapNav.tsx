'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ModuleId = 'overview' | 'm01' | 'm02' | 'm03' | 'm04' | 'm05' | 'm06'

const MODULES = [
  { id: 'm01' as ModuleId, num: '01', label: 'Foundations',       emoji: '⚡', phase: 'Months 1–3',  color: '#22d3ee' },
  { id: 'm02' as ModuleId, num: '02', label: 'Systems Design',    emoji: '🏗️', phase: 'Months 3–6',  color: '#f59e0b' },
  { id: 'm03' as ModuleId, num: '03', label: 'Cloud Engineering', emoji: '☁️', phase: 'Months 4–8',  color: '#34d399' },
  { id: 'm04' as ModuleId, num: '04', label: 'AI & ML',           emoji: '🤖', phase: 'Months 6–12', color: '#a78bfa' },
  { id: 'm05' as ModuleId, num: '05', label: 'Design & Craft',    emoji: '✍️', phase: 'Ongoing',     color: '#fb923c' },
  { id: 'm06' as ModuleId, num: '06', label: 'Communication',     emoji: '📣', phase: 'Ongoing',     color: '#60a5fa' },
]

// ─── Global event bus ─────────────────────────────────────────────────────────
// In MDX, RoadmapNav, ModuleSection, and RoadmapFooter are sibling components
// with no common parent we can inject. We use a custom DOM event as a message
// bus so all three stay in sync without a Context provider.

const EV = 'roadmap:nav'
const fire = (id: ModuleId) => window.dispatchEvent(new CustomEvent(EV, { detail: id }))

function useActive(initial: ModuleId = 'overview') {
  const [active, setActive] = useState<ModuleId>(initial)
  useEffect(() => {
    const h = (e: Event) => setActive((e as CustomEvent<ModuleId>).detail)
    window.addEventListener(EV, h)
    return () => window.removeEventListener(EV, h)
  }, [])
  return [active, (id: ModuleId) => { setActive(id); fire(id) }] as const
}

// ─── RoadmapNav ───────────────────────────────────────────────────────────────
// Place ONCE at the very top of software-engineering-roadmap.mdx
// Renders: tab bar, overview landing page, module header strip.

export function RoadmapNav() {
  const [active, go] = useActive('overview')
  const topRef = useRef<HTMLDivElement>(null)

  const navigate = (id: ModuleId) => {
    go(id)
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
  }

  const mod = MODULES.find((m) => m.id === active)
  const idx = MODULES.findIndex((m) => m.id === active)

  return (
    <div ref={topRef} style={{ scrollMarginTop: '80px' }}>

      {/* ── Tab strip ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '2px', padding: '4px',
        background: '#18181b', border: '1px solid #27272a',
        borderRadius: '8px', overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        <button onClick={() => navigate('overview')} style={ts(active === 'overview', '#f59e0b', true)}>
          Overview
        </button>
        <div style={{ width: '1px', background: '#27272a', margin: '4px 2px', flexShrink: 0 }} />
        {MODULES.map((m) => (
          <button key={m.id} onClick={() => navigate(m.id)} style={ts(active === m.id, m.color)}>
            <span style={{ fontSize: '14px' }}>{m.emoji}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{m.num} {m.label}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ────────────────────────────────────────────────────────── */}
      {active === 'overview' && (
        <div style={{ marginTop: '32px' }}>
          {/* Hero */}
          <div style={{ marginBottom: '36px', paddingBottom: '32px', borderBottom: '1px solid #27272a' }}>
            <span style={badge('#f59e0b')}>Software Engineering Roadmap · 12 Months</span>
            <h2 style={{ margin: '14px 0 10px', fontSize: '26px', fontWeight: 800, color: '#f4f4f5', letterSpacing: '-0.4px' }}>
              From good coder to great engineer.
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#a1a1aa', lineHeight: 1.75, maxWidth: '560px' }}>
              Six modules. Each builds on the last. Technical skill gets you in the room —
              the full stack of skills here determines what you do once you're there.
            </p>
          </div>

          {/* Phase bar */}
          <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '28px', borderRadius: '4px', overflow: 'hidden' }}>
            {MODULES.map((m) => <div key={m.id} style={{ flex: 1, background: m.color, opacity: 0.7 }} />)}
          </div>

          {/* Module grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '14px', marginBottom: '40px' }}>
            {MODULES.map((m) => (
              <ModuleCard key={m.id} m={m} onClick={() => navigate(m.id)} />
            ))}
          </div>

          {/* Five principles */}
          <div style={{ borderTop: '1px solid #27272a', paddingTop: '28px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#52525b', margin: '0 0 14px' }}>
              Five Core Principles — apply from day one
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {[
                { n: '01', t: 'Think before typing',       d: 'Five minutes of design saves fifty of debugging.', c: '#22d3ee' },
                { n: '02', t: 'Tradeoffs everywhere',      d: 'Every decision has a cost. Name it explicitly.',   c: '#f59e0b' },
                { n: '03', t: 'Make it work first',        d: 'Correct before fast. Simple before clever.',       c: '#34d399' },
                { n: '04', t: 'Observe everything',        d: 'You cannot improve what you cannot measure.',      c: '#a78bfa' },
                { n: '05', t: 'Communication is leverage', d: 'A doc touches 50 engineers. Code touches 5.',      c: '#60a5fa' },
              ].map((p) => (
                <div key={p.n} style={{
                  padding: '14px', borderRadius: '6px', background: `${p.c}08`,
                  border: `1px solid ${p.c}20`, borderLeft: `3px solid ${p.c}`,
                }}>
                  <p style={{ margin: '0 0 5px', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: p.c }}>{p.n}</p>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '12px', color: '#e4e4e7' }}>{p.t}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#71717a', lineHeight: 1.5 }}>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Module header ───────────────────────────────────────────────────── */}
      {active !== 'overview' && mod && (
        <div style={{
          marginTop: '20px', paddingBottom: '24px', borderBottom: '1px solid #27272a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            {/* Breadcrumb */}
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontFamily: 'monospace' }}>
              <span onClick={() => navigate('overview')}
                style={{ color: '#71717a', cursor: 'pointer' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#d4d4d8')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#71717a')}>
                Roadmap
              </span>
              <span style={{ color: '#3f3f46', margin: '0 6px' }}>/</span>
              <span style={{ color: mod.color }}>{mod.label}</span>
            </p>
            <span style={badge(mod.color)}>Module {mod.num} · {mod.phase}</span>
            <h2 style={{ margin: '10px 0 0', fontSize: '22px', fontWeight: 800, color: '#f4f4f5', letterSpacing: '-0.3px' }}>
              {mod.emoji} {mod.label}
            </h2>
          </div>
          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: '4px' }}>
            {idx > 0 && (
              <button onClick={() => navigate(MODULES[idx - 1].id)} style={nb('#a1a1aa', '#3f3f46')}>← Prev</button>
            )}
            {idx < MODULES.length - 1 && (
              <button onClick={() => navigate(MODULES[idx + 1].id)} style={nb(mod.color, mod.color, true)}>Next →</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ModuleSection ────────────────────────────────────────────────────────────
// Wrap each module's content in this. Only renders when its id is active.
//
// In MDX:
//   <ModuleSection id="m01">
//   ...markdown + component tags...
//   </ModuleSection>

export function ModuleSection({ id, children }: { id: ModuleId; children: React.ReactNode }) {
  const [active] = useActive()
  if (active !== id) return null
  return <div style={{ marginTop: '6px' }}>{children}</div>
}

// ─── RoadmapFooter ────────────────────────────────────────────────────────────
// Place at the bottom of the MDX file.
// Renders Prev / ↑ Overview / Next navigation below the active module.

export function RoadmapFooter() {
  const [active, go] = useActive()
  if (active === 'overview') return null

  const mod = MODULES.find((m) => m.id === active)
  const idx = MODULES.findIndex((m) => m.id === active)

  return (
    <div style={{
      marginTop: '56px', paddingTop: '24px', borderTop: '1px solid #27272a',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: '16px',
    }}>
      <div>
        {idx > 0 && (
          <button onClick={() => go(MODULES[idx - 1].id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#52525b' }}>Previous</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>← {MODULES[idx - 1].emoji} {MODULES[idx - 1].label}</p>
          </button>
        )}
      </div>
      <button onClick={() => go('overview')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#52525b' }}
        onMouseEnter={e => ((e.currentTarget.style.color = '#a1a1aa'))}
        onMouseLeave={e => ((e.currentTarget.style.color = '#52525b'))}>
        ↑ Overview
      </button>
      <div>
        {idx < MODULES.length - 1 && (
          <button onClick={() => go(MODULES[idx + 1].id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', padding: 0 }}>
            <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#52525b', textAlign: 'right' }}>Next</p>
            <p style={{ margin: 0, fontSize: '13px', color: mod?.color }}>
              {MODULES[idx + 1].emoji} {MODULES[idx + 1].label} →
            </p>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ModuleCard({ m, onClick }: { m: typeof MODULES[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: 'left', padding: '20px', borderRadius: '8px',
        border: `1px solid ${hovered ? m.color : '#27272a'}`,
        background: hovered ? `${m.color}0a` : '#18181b',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'all 0.18s', transform: hovered ? 'translateY(-2px)' : 'none', width: '100%',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: m.color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '22px' }}>{m.emoji}</span>
        <span style={badge(m.color)}>{m.phase}</span>
      </div>
      <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: m.color }}>Module {m.num}</p>
      <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '14px', color: '#f4f4f5' }}>{m.label}</p>
      <p style={{ margin: 0, fontSize: '12px', color: m.color, fontFamily: 'monospace' }}>Open module →</p>
    </button>
  )
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function ts(active: boolean, color: string, mono = false): React.CSSProperties {
  return {
    flexShrink: 0, padding: '7px 13px', borderRadius: '5px', border: 'none', cursor: 'pointer',
    fontSize: '12px', fontWeight: 600, transition: 'all 0.15s',
    fontFamily: mono ? 'monospace' : 'inherit',
    letterSpacing: mono ? '0.05em' : 'inherit',
    textTransform: mono ? 'uppercase' : 'inherit',
    background: active ? (mono ? '#3f3f46' : `${color}18`) : 'transparent',
    color: active ? (mono ? '#f4f4f5' : color) : '#71717a',
    display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
  }
}

function badge(color: string): React.CSSProperties {
  return {
    display: 'inline-block', fontFamily: 'monospace', fontSize: '9px',
    letterSpacing: '2px', textTransform: 'uppercase', padding: '3px 9px',
    borderRadius: '3px', background: `${color}18`, color, border: `1px solid ${color}30`,
  }
}

function nb(color: string, border: string, filled = false): React.CSSProperties {
  return {
    padding: '7px 14px', borderRadius: '5px', border: `1px solid ${border}`,
    background: filled ? `${color}12` : 'transparent',
    color, cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', fontWeight: 600,
  }
}
