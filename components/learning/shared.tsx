'use client'

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────
// Used across all learning module components.

import React, { useState } from 'react'

// ── Colour tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg: 'bg-zinc-950',
  surface: 'bg-zinc-900',
  card: 'bg-zinc-800/60',
  border: 'border-zinc-700/60',
  border2: 'border-zinc-600',
  text: 'text-zinc-100',
  muted: 'text-zinc-400',
  dim: 'text-zinc-600',
  amber: '#f59e0b',
  cyan: '#22d3ee',
  green: '#34d399',
  purple: '#a78bfa',
  red: '#f87171',
  blue: '#60a5fa',
  yellow: '#fbbf24',
  orange: '#fb923c',
}

// ── Pill / badge ──────────────────────────────────────────────────────────────
export function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="mr-1 inline-block rounded-sm px-2 py-0.5 font-mono text-[9px] tracking-widest uppercase"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </span>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────────
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warn' | 'tip' | 'insight' | 'danger'
  title?: string
  children: React.ReactNode
}) {
  const map: Record<string, string> = {
    info: C.cyan,
    warn: C.amber,
    tip: C.green,
    insight: C.purple,
    danger: C.red,
  }
  const clr = map[type] || C.cyan
  return (
    <div
      className="my-4 rounded-r-sm px-4 py-3"
      style={{ borderLeft: `3px solid ${clr}`, background: `${clr}12` }}
    >
      <div className="mb-2 font-mono text-[9px] tracking-[3px] uppercase" style={{ color: clr }}>
        {title}
      </div>
      <div className="text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({
  children,
  accent,
  className = '',
  onClick,
}: {
  children: React.ReactNode
  accent?: string
  className?: string
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-sm border p-4 transition-all duration-200 ${className}`}
      style={{
        background: hovered ? '#27272a' : '#1c1c1f',
        borderColor: hovered ? '#52525b' : '#3f3f46',
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered && onClick ? 'translateY(-2px)' : 'none',
      }}
    >
      {accent && (
        <div className="absolute top-0 right-0 left-0 h-0.5" style={{ background: accent }} />
      )}
      {children}
    </div>
  )
}

// ── Section heading ───────────────────────────────────────────────────────────
export function SHead({
  children,
  sub,
  accent = C.amber,
}: {
  children: React.ReactNode
  sub?: string
  accent?: string
}) {
  return (
    <div className="mt-8 mb-4">
      <div className="mb-1 flex items-center gap-3">
        <div className="h-5 w-0.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
        <h3 className="text-lg font-bold tracking-tight text-zinc-100">{children}</h3>
      </div>
      {sub && <p className="ml-3 max-w-xl text-sm leading-relaxed text-zinc-500">{sub}</p>}
    </div>
  )
}

// ── Code block ────────────────────────────────────────────────────────────────
export function CodeBlock({
  label,
  bad = false,
  children,
}: {
  label?: string
  bad?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="my-3">
      {label && (
        <div
          className="mb-1 font-mono text-[9px] tracking-[2px] uppercase"
          style={{ color: bad ? C.red : '#4ade80' }}
        >
          {bad ? `✗ ${label}` : `✓ ${label}`}
        </div>
      )}
      <pre
        className="overflow-x-auto rounded-r-sm p-4 font-mono text-[11.5px] leading-loose break-words whitespace-pre-wrap"
        style={{
          background: '#09090b',
          borderLeft: `3px solid ${bad ? C.red : C.amber}`,
          color: '#a1a1aa',
        }}
      >
        {children}
      </pre>
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
export function Quiz({
  question,
  opts,
  correct,
  explanations,
}: {
  question: string
  opts: string[]
  correct: number
  explanations: string[]
}) {
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div className="my-6 rounded-sm border border-zinc-700 bg-zinc-900 p-5">
      <div className="mb-3 font-mono text-[9px] tracking-[3px] uppercase" style={{ color: C.amber }}>
        Knowledge Check
      </div>
      <p className="mb-4 text-sm leading-relaxed font-semibold text-zinc-200">{question}</p>
      <div className="flex flex-col gap-2">
        {opts.map((o, i) => {
          let borderColor = '#3f3f46'
          let textColor = '#a1a1aa'
          let bg = 'transparent'
          if (sel !== null) {
            if (i === correct) {
              borderColor = C.green
              textColor = C.green
              bg = `${C.green}12`
            } else if (i === sel) {
              borderColor = C.red
              textColor = C.red
              bg = `${C.red}12`
            }
          }
          return (
            <button
              key={i}
              disabled={sel !== null}
              onClick={() => setSel(i)}
              className="rounded-sm border px-3 py-2.5 text-left text-sm transition-all duration-150 disabled:cursor-default"
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
export function Checklist({ storageKey, items }: { storageKey: string; items: string[] }) {
  const [checked, setChecked] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      // localStorage unavailable (SSR) — start empty
      return []
    }
  })

  const toggle = (i: number) => {
    const next = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i]
    setChecked(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // localStorage unavailable — ignore
    }
  }

  const pct = Math.round((checked.length / items.length) * 100)

  return (
    <div className="my-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-500">
          {checked.length} / {items.length} complete
        </span>
        <span className="font-mono text-xs" style={{ color: C.amber }}>
          {pct}%
        </span>
      </div>
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.amber}, ${C.yellow})`,
          }}
        />
      </div>
      {items.map((item, i) => {
        const done = checked.includes(i)
        return (
          <div
            key={i}
            role="checkbox"
            aria-checked={done}
            tabIndex={0}
            onClick={() => toggle(i)}
            onKeyDown={(e) => e.key === 'Enter' && toggle(i)}
            className="group flex cursor-pointer items-start gap-3 border-b border-zinc-800 py-2.5"
          >
            <div
              className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all duration-150"
              style={{
                borderColor: done ? C.green : '#52525b',
                background: done ? `${C.green}20` : 'transparent',
              }}
            >
              {done && (
                <span className="text-[9px]" style={{ color: C.green }}>
                  ✓
                </span>
              )}
            </div>
            <span
              className="text-sm leading-relaxed transition-colors duration-150"
              style={{
                color: done ? C.green : '#a1a1aa',
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
export function DataTable({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {heads.map((h, i) => (
              <th
                key={i}
                className="border-b-2 border-zinc-700 px-3 py-2 text-left font-mono text-[9px] tracking-[2px] text-zinc-500 uppercase"
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
                  className="px-3 py-2.5 align-top leading-snug"
                  style={{
                    color: j === 0 ? '#e4e4e7' : '#a1a1aa',
                    fontWeight: j === 0 ? 600 : 400,
                  }}
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
