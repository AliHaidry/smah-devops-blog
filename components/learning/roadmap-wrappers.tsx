'use client'

import { C, Card } from './shared'

// ── Module Section ────────────────────────────────────────────────────────────
// Scroll target wrapper for RoadmapNav links
export function ModuleSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  )
}

// ── Roadmap Footer ────────────────────────────────────────────────────────────
export function RoadmapFooter() {
  return (
    <div className="my-12 rounded-sm border border-zinc-800 bg-zinc-900/60 p-8 text-center">
      <div className="mb-3 font-mono text-[9px] tracking-[4px] text-zinc-600 uppercase">
        End of Roadmap
      </div>
      <div className="mb-4 text-2xl font-bold text-zinc-200">
        Engineering is a practice, not a destination.
      </div>
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-500">
        Revisit these modules as you grow. The concepts that seemed abstract at month 1 will click
        at month 6. The patterns you skimmed will become the ones you reach for daily.
      </p>
      <div className="mt-6 font-mono text-[10px] tracking-widest text-zinc-700 uppercase">
        Ship. Learn. Iterate.
      </div>
    </div>
  )
}

// ── CAP Theorem Diagram ───────────────────────────────────────────────────────
export function CAPTheoremDiagram() {
  const nodes = [
    {
      label: 'Consistency',
      abbr: 'C',
      color: C.amber,
      desc: 'Every read receives the most recent write or an error. All nodes see the same data at the same time.',
      examples: ['PostgreSQL', 'MySQL', 'HBase'],
    },
    {
      label: 'Availability',
      abbr: 'A',
      color: C.cyan,
      desc: 'Every request receives a response (not necessarily the latest data). The system keeps responding even when nodes fail.',
      examples: ['CouchDB', 'DynamoDB', 'Cassandra'],
    },
    {
      label: 'Partition Tolerance',
      abbr: 'P',
      color: C.green,
      desc: 'The system continues operating despite network partitions between nodes. In practice, P is always required in distributed systems.',
      examples: ['All distributed systems'],
    },
  ]

  const tradeoffs = [
    {
      pair: 'CP',
      label: 'Consistent + Partition-Tolerant',
      color: C.amber,
      sacrifice: 'Availability',
      desc: 'When a partition occurs, the system rejects requests rather than return stale data. Best for financial systems, inventory.',
      examples: ['MongoDB (strong mode)', 'Redis (single)', 'HBase'],
    },
    {
      pair: 'AP',
      label: 'Available + Partition-Tolerant',
      color: C.cyan,
      sacrifice: 'Consistency',
      desc: 'System stays up and accepts requests even during partitions, but may return stale data. Best for social feeds, caches, DNS.',
      examples: ['DynamoDB', 'Cassandra', 'CouchDB'],
    },
    {
      pair: 'CA',
      label: 'Consistent + Available',
      color: C.purple,
      sacrifice: 'Partition Tolerance',
      desc: 'Only possible without network partitions — i.e., a single-node or tightly-coupled cluster. Not viable for distributed systems.',
      examples: ['Single-node PostgreSQL', 'SQLite'],
    },
  ]

  return (
    <div className="my-6 space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {nodes.map((n) => (
          <Card key={n.abbr} accent={n.color}>
            <div
              className="mb-1 font-mono text-3xl leading-none font-bold"
              style={{ color: `${n.color}40` }}
            >
              {n.abbr}
            </div>
            <div className="mb-2 text-sm font-bold" style={{ color: n.color }}>
              {n.label}
            </div>
            <p className="mb-3 text-xs leading-relaxed text-zinc-400">{n.desc}</p>
            <div className="flex flex-wrap gap-1">
              {n.examples.map((e) => (
                <span
                  key={e}
                  className="rounded-sm px-1.5 py-0.5 font-mono text-[9px]"
                  style={{ background: `${n.color}15`, color: n.color }}
                >
                  {e}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="rounded-sm border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="mb-3 font-mono text-[9px] tracking-[3px] text-zinc-600 uppercase">
          Pick Two — Real-World Tradeoffs
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {tradeoffs.map((t) => (
            <div
              key={t.pair}
              className="rounded-sm p-3"
              style={{ background: `${t.color}08`, border: `1px solid ${t.color}30` }}
            >
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-base font-bold" style={{ color: t.color }}>
                  {t.pair}
                </span>
                <span className="font-mono text-[9px] text-zinc-600 uppercase">
                  sacrifices {t.sacrifice}
                </span>
              </div>
              <p className="mb-2 text-[11px] leading-relaxed text-zinc-400">{t.desc}</p>
              <div className="flex flex-wrap gap-1">
                {t.examples.map((e) => (
                  <span
                    key={e}
                    className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] text-zinc-500"
                    style={{ background: '#18181b' }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
