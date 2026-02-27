'use client'

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────
// Used across all learning module components.
// Import from here to keep styling consistent.

import { useState } from 'react'

// ── Colour tokens ─────────────────────────────────────────────────────────────
export const C = {
  // surfaces
  bg:      'bg-zinc-950',
  surface: 'bg-zinc-900',
  card:    'bg-zinc-800/60',
  // borders
  border:  'border-zinc-700/60',
  border2: 'border-zinc-600',
  // text
  text:    'text-zinc-100',
  muted:   'text-zinc-400',
  dim:     'text-zinc-600',
  // accents — raw hex for inline styles where Tailwind can't do it
  amber:   '#f59e0b',
  cyan:    '#22d3ee',
  green:   '#34d399',
  purple:  '#a78bfa',
  red:     '#f87171',
  blue:    '#60a5fa',
  yellow:  '#fbbf24',
  orange:  '#fb923c',
}

// ── Pill / badge ──────────────────────────────────────────────────────────────
export function Pill({ color, children }) {
  return (
    <span
      className="inline-block font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm mr-1"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </span>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────────
export function Callout({ type = 'info', title, children }) {
  const map = {
    info:    C.cyan,
    warn:    C.amber,
    tip:     C.green,
    insight: C.purple,
    danger:  C.red,
  }
  const clr = map[type] || C.cyan
  return (
    <div
      className="my-4 py-3 px-4 rounded-r-sm"
      style={{ borderLeft: `3px solid ${clr}`, background: `${clr}12` }}
    >
      <div
        className="font-mono text-[9px] tracking-[3px] uppercase mb-2"
        style={{ color: clr }}
      >
        {title}
      </div>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, accent, className = '', onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-sm border transition-all duration-200 p-4 ${className}`}
      style={{
        background:  hovered ? '#27272a' : '#1c1c1f',
        borderColor: hovered ? '#52525b' : '#3f3f46',
        cursor:      onClick ? 'pointer' : 'default',
        transform:   hovered && onClick ? 'translateY(-2px)' : 'none',
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: accent }}
        />
      )}
      {children}
    </div>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SHead({ children, sub, accent = C.amber }) {
  return (
    <div className="mt-8 mb-4">
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-0.5 h-5 rounded-full flex-shrink-0"
          style={{ background: accent }}
        />
        <h3 className="text-lg font-bold tracking-tight text-zinc-100">
          {children}
        </h3>
      </div>
      {sub && (
        <p className="text-sm text-zinc-500 leading-relaxed ml-3 max-w-xl">
          {sub}
        </p>
      )}
    </div>
  )
}

// ── Code block ────────────────────────────────────────────────────────────────
export function CodeBlock({ label, bad = false, children }) {
  return (
    <div className="my-3">
      {label && (
        <div
          className="font-mono text-[9px] tracking-[2px] uppercase mb-1"
          style={{ color: bad ? C.red : '#4ade80' }}
        >
          {bad ? `✗ ${label}` : `✓ ${label}`}
        </div>
      )}
      <pre
        className="rounded-r-sm p-4 font-mono text-[11.5px] leading-loose overflow-x-auto whitespace-pre-wrap break-words"
        style={{
          background:  '#09090b',
          borderLeft:  `3px solid ${bad ? C.red : C.amber}`,
          color:       '#a1a1aa',
        }}
      >
        {children}
      </pre>
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
export function Quiz({ question, opts, correct, explanations }) {
  const [sel, setSel] = useState(null)
  return (
    <div className="my-6 rounded-sm border border-zinc-700 bg-zinc-900 p-5">
      <div
        className="font-mono text-[9px] tracking-[3px] uppercase mb-3"
        style={{ color: C.amber }}
      >
        Knowledge Check
      </div>
      <p className="text-sm font-semibold text-zinc-200 mb-4 leading-relaxed">
        {question}
      </p>
      <div className="flex flex-col gap-2">
        {opts.map((o, i) => {
          let borderColor = '#3f3f46'
          let textColor   = '#a1a1aa'
          let bg          = 'transparent'
          if (sel !== null) {
            if (i === correct)    { borderColor = C.green;  textColor = C.green;  bg = `${C.green}12` }
            else if (i === sel)   { borderColor = C.red;    textColor = C.red;    bg = `${C.red}12`   }
          }
          return (
            <button
              key={i}
              disabled={sel !== null}
              onClick={() => setSel(i)}
              className="text-left text-sm rounded-sm px-3 py-2.5 border transition-all duration-150 disabled:cursor-default"
              style={{ borderColor, color: textColor, background: bg }}
            >
              {o}
            </button>
          )
        })}
      </div>
      {sel !== null && (
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: sel === correct ? C.green : C.red }}
        >
          {sel === correct ? '✓ ' : '✗ '}
          {explanations[sel]}
        </p>
      )}
    </div>
  )
}

// ── Checklist ─────────────────────────────────────────────────────────────────
export function Checklist({ storageKey, items }) {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') }
    catch { return [] }
  })

  const toggle = (i) => {
    const next = checked.includes(i)
      ? checked.filter(x => x !== i)
      : [...checked, i]
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }

  const pct = Math.round((checked.length / items.length) * 100)

  return (
    <div className="my-6">
      {/* Progress bar */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-zinc-500 font-mono">
          {checked.length} / {items.length} complete
        </span>
        <span className="font-mono text-xs" style={{ color: C.amber }}>
          {pct}%
        </span>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width:      `${pct}%`,
            background: `linear-gradient(90deg, ${C.amber}, ${C.yellow})`,
          }}
        />
      </div>
      {/* Items */}
      {items.map((item, i) => {
        const done = checked.includes(i)
        return (
          <div
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 py-2.5 border-b border-zinc-800 cursor-pointer group"
          >
            <div
              className="mt-0.5 w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-150"
              style={{
                borderColor: done ? C.green : '#52525b',
                background:  done ? `${C.green}20` : 'transparent',
              }}
            >
              {done && <span className="text-[9px]" style={{ color: C.green }}>✓</span>}
            </div>
            <span
              className="text-sm leading-relaxed transition-colors duration-150"
              style={{
                color:          done ? C.green : '#a1a1aa',
                textDecoration: done ? 'line-through' : 'none',
              }}
            >
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Simple data table ─────────────────────────────────────────────────────────
export function DataTable({ heads, rows }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {heads.map((h, i) => (
              <th
                key={i}
                className="text-left font-mono text-[9px] tracking-[2px] uppercase py-2 px-3 border-b-2 border-zinc-700 text-zinc-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="py-2.5 px-3 leading-snug align-top"
                  style={{ color: j === 0 ? '#e4e4e7' : '#a1a1aa', fontWeight: j === 0 ? 600 : 400 }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
