'use client'

import { useState } from 'react'
import { C, Card, SHead, Pill, DataTable, Checklist } from './shared'

// ── Design Framework (7 steps, accordion) ────────────────────────────────────
export default function DesignFramework() {
  const [open, setOpen] = useState<number | null>(null)
  const steps = [
    { n: '01', title: 'Clarify Requirements', color: C.cyan,
      func: 'What does it DO?', nonfunc: 'How well must it do it?',
      detail: 'Functional: what features exist. Non-functional: latency, availability, consistency, throughput. Always ask before designing. Ambiguity here costs hours later.' },
    { n: '02', title: 'Estimate Scale', color: C.green,
      func: 'Users: DAU / MAU', nonfunc: 'QPS, storage, bandwidth',
      detail: 'Back-of-envelope math. 1M DAU × 10 requests/day = ~120 QPS. 120 QPS × 1KB/req = 120KB/s. Does this fit one server? Do we need sharding?' },
    { n: '03', title: 'Define the API', color: C.amber,
      func: 'Endpoints & contracts', nonfunc: 'Request/response shapes',
      detail: 'Define your API before your database. It forces you to think from the user\'s perspective. REST or gRPC? What are the inputs and outputs of every operation?' },
    { n: '04', title: 'Data Model', color: C.purple,
      func: 'Entities & relationships', nonfunc: 'Access patterns',
      detail: 'Design backwards from your queries. What reads are most frequent? What writes? This determines whether you need SQL, NoSQL, or a mix — and what your schema looks like.' },
    { n: '05', title: 'High-Level Architecture', color: C.yellow,
      func: 'Components & connections', nonfunc: 'Traffic flow, data flow',
      detail: 'Draw the boxes and arrows. Client → LB → App Servers → Cache → DB. This is the skeleton. Every component has one job.' },
    { n: '06', title: 'Deep Dive Bottlenecks', color: C.red,
      func: 'Where will it break?', nonfunc: 'Single points of failure',
      detail: 'Go deep on the 2–3 hardest parts: the hot path, the storage layer, the real-time component. This is where senior engineers show their depth.' },
    { n: '07', title: 'Tradeoff Discussion', color: C.blue,
      func: 'Why this, not that?', nonfunc: 'What did you sacrifice?',
      detail: 'Every decision has a cost. SQL vs NoSQL. Push vs pull. Consistency vs availability. Strong engineers articulate their tradeoffs clearly.' },
  ]
  return (
    <div className="my-4 border border-zinc-700 rounded-sm overflow-hidden">
      {steps.map((s, i) => (
        <div key={i}>
          <div
            onClick={() => setOpen(open === i ? null : i)}
            className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/40 transition-colors"
          >
            <span className="font-mono text-xs w-6 flex-shrink-0" style={{ color: s.color }}>{s.n}</span>
            <div className="w-0.5 h-3 rounded flex-shrink-0" style={{ background: s.color }} />
            <div className="flex-1">
              <div className="font-semibold text-sm text-zinc-200">{s.title}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{s.func} · {s.nonfunc}</div>
            </div>
            <div className="text-zinc-500 transition-transform duration-200" style={{ transform: open === i ? 'rotate(90deg)' : 'none' }}>›</div>
          </div>
          {open === i && (
            <div className="px-4 pb-4 pt-2 bg-zinc-900/50 text-sm text-zinc-400 leading-relaxed border-b border-zinc-800" style={{ paddingLeft: '3.5rem' }}>
              {s.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Tradeoff Explorer ─────────────────────────────────────────────────────────
export function TradeoffExplorer() {
  const tradeoffs = [
    { title: 'Consistency vs Availability', color: C.amber,
      a: { label: 'Strong Consistency', desc: 'Every read returns the most recent write. All nodes see the same data.', wins: ['Banking, payments', 'Inventory systems', 'User auth'], costs: ['Higher latency', 'Unavailable during partition'] },
      b: { label: 'High Availability',  desc: 'System always responds, even if data might be slightly stale.', wins: ['Social feeds', 'Metrics/analytics', 'Shopping carts'], costs: ['Stale reads possible', 'Complex conflict resolution'] },
      insight: 'Most consumer apps choose availability. Money systems choose consistency. Know your business requirement before picking a DB.' },
    { title: 'Latency vs Throughput', color: C.cyan,
      a: { label: 'Low Latency',    desc: 'Individual requests return fast. Optimise for p99 response time.', wins: ['Real-time systems', 'Gaming', 'Trading'], costs: ['May limit batch sizes', 'Often requires more infra'] },
      b: { label: 'High Throughput', desc: 'Process as many requests/sec as possible. Batch and pipeline.', wins: ['Data pipelines', 'Bulk processing', 'Analytics'], costs: ['Individual requests may wait', 'Buffering adds delay'] },
      insight: 'A batch processor has high throughput but high latency per item. Optimise for what your users actually experience.' },
    { title: 'SQL vs NoSQL', color: C.green,
      a: { label: 'SQL (Relational)', desc: 'Structured schemas, ACID transactions, powerful joins, mature tooling.', wins: ['Complex relationships', 'Financial data', 'Most CRUD apps'], costs: ['Rigid schema', 'Harder to scale horizontally'] },
      b: { label: 'NoSQL',           desc: 'Flexible schemas, horizontal scaling, optimised for specific access patterns.', wins: ['Variable schemas', 'Massive scale', 'Specific data shapes'], costs: ['Limited joins', 'Eventual consistency'] },
      insight: 'Start with Postgres. It handles 99% of use cases. Move to NoSQL only when you have a specific problem SQL can\'t solve well.' },
    { title: 'Normalised vs Denormalised', color: C.purple,
      a: { label: 'Normalised (3NF)',  desc: 'No data duplication. Single source of truth. Complex joins.', wins: ['Write-heavy workloads', 'Data integrity', 'OLTP systems'], costs: ['Slow complex queries', 'Many joins at scale'] },
      b: { label: 'Denormalised',     desc: 'Data duplicated for read performance. Pre-computed joins.', wins: ['Read-heavy workloads', 'Analytics', 'NoSQL docs'], costs: ['Update anomalies', 'Storage cost', 'Sync complexity'] },
      insight: 'Start normalised. Denormalise specific hot paths when profiling data proves it\'s necessary. Never pre-optimise.' },
  ]
  const [active, setActive] = useState(0)
  const t = tradeoffs[active]

  return (
    <div className="my-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {tradeoffs.map((tr, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="text-xs px-3 py-1.5 rounded-sm border transition-all duration-150 font-mono"
            style={{
              borderColor: i === active ? tr.color : '#3f3f46',
              background:  i === active ? `${tr.color}18` : 'transparent',
              color:       i === active ? tr.color : '#71717a',
            }}
          >
            {tr.title}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {[t.a, t.b].map((side, idx) => (
          <Card key={idx} accent={t.color}>
            <div className="font-bold text-sm mb-2" style={{ color: t.color }}>{side.label}</div>
            <div className="text-xs text-zinc-400 leading-relaxed mb-3">{side.desc}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: C.green }}>WINS FOR</div>
            {side.wins.map((w, j) => <div key={j} className="text-xs text-zinc-400 pl-3 relative before:absolute before:left-0 before:content-['+']" style={{ '--tw-before-color': C.green } as any}><span style={{ color: C.green, position: 'absolute', left: 0 }}>+</span>{w}</div>)}
            <div className="font-mono text-[9px] tracking-widest uppercase mt-2 mb-1" style={{ color: C.red }}>COSTS</div>
            {side.costs.map((c, j) => <div key={j} className="text-xs text-zinc-400 pl-3 relative"><span style={{ color: C.red, position: 'absolute', left: 0 }}>−</span>{c}</div>)}
          </Card>
        ))}
      </div>
      <div className="px-4 py-3 rounded-r-sm text-xs text-zinc-400 leading-relaxed" style={{ borderLeft: `3px solid ${t.color}`, background: `${t.color}0e` }}>
        <span className="font-mono text-[9px] tracking-widest uppercase mr-2" style={{ color: t.color }}>Engineer's Take</span>
        {t.insight}
      </div>
    </div>
  )
}

// ── Distributed Concepts Grid ─────────────────────────────────────────────────
export function DistributedConceptsGrid() {
  const concepts = [
    { title: 'Horizontal vs Vertical Scaling', color: C.cyan, desc: 'Vertical: bigger machine. Horizontal: more machines. Vertical has a ceiling. Horizontal requires stateless services. Design for horizontal from the start.', tags: ['Scale-out', 'Stateless'] },
    { title: 'Replication', color: C.green, desc: 'Copies of data on multiple nodes. Leader-Follower: one write node, others replicate. Multi-Leader: multiple write points. Leaderless: any node accepts (Cassandra).', tags: ['Leader-Follower', 'Consistency'] },
    { title: 'Sharding / Partitioning', color: C.amber, desc: 'Split data across nodes by a shard key. Hash sharding: even distribution. Range sharding: supports range queries. Hot shards are the biggest operational headache.', tags: ['Shard Key', 'Hot Spots'] },
    { title: 'Consensus', color: C.purple, desc: 'How distributed nodes agree on a single value. Raft and Paxos are the gold-standard algorithms. Enables distributed locks, leader election, consistent transactions.', tags: ['Raft', 'Paxos'] },
    { title: 'Event-Driven Architecture', color: C.yellow, desc: 'Services communicate via events, not direct calls. Producers emit events. Consumers process independently. Decoupled, resilient, but harder to trace.', tags: ['Kafka', 'Pub/Sub', 'Decoupling'] },
    { title: 'Circuit Breaker', color: C.red, desc: 'Prevent cascading failures. If downstream is failing, stop calling it — return a fallback. After a timeout, test if it\'s back. Fail fast, fail safe.', tags: ['Resilience', 'Fail Fast'] },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {concepts.map(c => (
        <Card key={c.title} accent={c.color}>
          <div className="font-bold text-sm mb-2" style={{ color: c.color }}>{c.title}</div>
          <div className="text-xs text-zinc-400 leading-relaxed mb-3">{c.desc}</div>
          <div>{c.tags.map(t => <span key={t} className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-sm mr-1" style={{ background: `${c.color}22`, color: c.color }}>{t}</span>)}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Caching Strategies ────────────────────────────────────────────────────────
export function CachingStrategies() {
  const strategies: Record<string, any> = {
    'cache-aside': {
      label: 'Cache-Aside (Lazy Loading)', color: C.cyan,
      steps: ['App checks cache → MISS', 'App fetches from DB', 'App writes result to cache', 'Next request → HIT'],
      pros: ['Only caches what\'s actually read', 'Cache failure doesn\'t break app'],
      cons: ['First request always slow (cold start)', 'Cache stampede on popular miss'],
      use: 'General purpose. Most common pattern.',
    },
    'write-through': {
      label: 'Write-Through', color: C.green,
      steps: ['App writes to cache', 'Cache synchronously writes to DB', 'Reads always hit warm cache', 'Never stale for recent writes'],
      pros: ['Cache always fresh after writes', 'No stampede on writes'],
      cons: ['Write latency increases (two writes)', 'Caches data that may never be read'],
      use: 'Read-heavy after writes. User profiles, product catalogue.',
    },
    'write-behind': {
      label: 'Write-Behind (Write-Back)', color: C.amber,
      steps: ['App writes to cache only', 'Cache acknowledges immediately', 'Cache asynchronously flushes to DB', 'DB eventually consistent'],
      pros: ['Fastest write latency', 'Absorbs write bursts'],
      cons: ['Data loss if cache fails before flush', 'Eventual consistency'],
      use: 'Write-heavy, latency-sensitive. Gaming scores, metrics, likes.',
    },
  }
  const [sel, setSel] = useState('cache-aside')
  const s = strategies[sel]

  return (
    <div className="my-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(strategies).map(([k, v]: [string, any]) => (
          <button
            key={k}
            onClick={() => setSel(k)}
            className="text-xs px-3 py-1.5 rounded-sm border transition-all duration-150 font-mono"
            style={{
              borderColor: k === sel ? v.color : '#3f3f46',
              background:  k === sel ? `${v.color}18` : 'transparent',
              color:       k === sel ? v.color : '#71717a',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <Card accent={s.color}>
        <div className="font-bold text-sm mb-4" style={{ color: s.color }}>{s.label}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-500 mb-2">FLOW</div>
            {s.steps.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-3 mb-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[10px] mt-0.5" style={{ background: `${s.color}25`, border: `1px solid ${s.color}50`, color: s.color }}>{i + 1}</div>
                <div className="text-xs text-zinc-400 leading-snug">{step}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: C.green }}>PROS</div>
            {s.pros.map((p: string, i: number) => <div key={i} className="text-xs text-zinc-400 pl-3 mb-1 relative"><span style={{ color: C.green, position: 'absolute', left: 0 }}>+</span>{p}</div>)}
            <div className="font-mono text-[9px] tracking-widest uppercase mt-3 mb-1" style={{ color: C.red }}>CONS</div>
            {s.cons.map((c: string, i: number) => <div key={i} className="text-xs text-zinc-400 pl-3 mb-1 relative"><span style={{ color: C.red, position: 'absolute', left: 0 }}>−</span>{c}</div>)}
            <div className="mt-3 px-3 py-2 rounded-r-sm text-xs text-zinc-400" style={{ borderLeft: `2px solid ${s.color}`, background: `${s.color}0e` }}>
              <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: s.color }}>USE WHEN</div>
              {s.use}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Security Concepts Grid ────────────────────────────────────────────────────
export function SecurityConceptsGrid() {
  const concepts = [
    { title: 'Principle of Least Privilege', color: C.amber, desc: 'Every service, user, and process should have only the permissions it needs. An API that only reads should never have write credentials.' },
    { title: 'Defence in Depth',             color: C.cyan,  desc: 'Layer your defences: firewall → WAF → AuthN → AuthZ → input validation → rate limiting → audit logging. One layer failing ≠ full compromise.' },
    { title: 'Threat Modelling (STRIDE)',     color: C.purple,desc: 'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Ask these for every component.' },
    { title: 'Zero Trust Architecture',       color: C.green, desc: 'Never trust, always verify — even internal traffic. Every request must be authenticated and authorised. Service-to-service auth via mTLS.' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
      {concepts.map(c => (
        <Card key={c.title} accent={c.color}>
          <div className="font-bold text-sm mb-2" style={{ color: c.color }}>{c.title}</div>
          <div className="text-xs text-zinc-400 leading-relaxed">{c.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Observability Pillars ─────────────────────────────────────────────────────
export function ObservabilityPillars() {
  const pillars = [
    { title: 'Metrics', emoji: '📊', color: C.cyan,   desc: 'Numerical measurements over time. The "what is happening right now" signal.', examples: ['Request rate (QPS)', 'Error rate (%)', 'p50/p95/p99 latency', 'Cache hit rate'], tools: ['Prometheus', 'Datadog', 'CloudWatch'] },
    { title: 'Logs',    emoji: '📝', color: C.green,  desc: 'Timestamped records of discrete events. The "what happened and why" signal.', examples: ['Request/response details', 'Error stack traces', 'Audit trail', 'Business events'], tools: ['Elasticsearch', 'Loki', 'Splunk'] },
    { title: 'Traces',  emoji: '🔍', color: C.amber,  desc: 'The path of a request through distributed services. The "where is the time going" signal.', examples: ['Service call tree', 'DB query timing', 'External API calls'], tools: ['Jaeger', 'Zipkin', 'Datadog APM'] },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
      {pillars.map(p => (
        <Card key={p.title} accent={p.color}>
          <div className="text-2xl mb-2">{p.emoji}</div>
          <div className="font-bold text-sm mb-2" style={{ color: p.color }}>{p.title}</div>
          <div className="text-xs text-zinc-400 leading-relaxed mb-3">{p.desc}</div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-1">EXAMPLES</div>
          {p.examples.map(e => <div key={e} className="text-[11px] text-zinc-500 pl-2 relative"><span style={{ color: p.color, position: 'absolute', left: 0 }}>·</span>{e}</div>)}
          <div className="mt-3">{p.tools.map(t => <span key={t} className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-sm mr-1" style={{ background: `${p.color}22`, color: p.color }}>{t}</span>)}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Systems Design Checklist ──────────────────────────────────────────────────
export function SystemsDesignChecklist() {
  return (
    <Checklist
      storageKey="systems-design-checklist"
      items={[
        'Can walk through all 7 design steps without prompting',
        'Estimated scale (QPS, storage, bandwidth) for 3+ different systems',
        'Articulate 5 core tradeoffs and when to choose each side',
        'Designed a complete system end-to-end (URL shortener, Twitter, or similar)',
        'Implemented cache-aside with TTL jitter and stampede protection',
        'Can explain the CAP theorem and name a real DB on each side',
        'Know the difference between AuthN and AuthZ with concrete examples',
        'Know the OWASP Top 10 and can describe an example of each',
        'Set up metrics, logs, and traces for a production-like application',
        'Can define SLI, SLO, and SLA and calculate an error budget',
        'Designed for at least 2 failure modes: node failure and cascading failure',
        'Written a post-mortem for a real or simulated incident with root cause',
      ]}
    />
  )
}

// ── CAP Theorem Diagram ───────────────────────────────────────────────────────
export function CAPTheoremDiagram() {
  const nodes = [
    {
      label: 'Consistency',
      color: C.cyan,
      desc: 'Every read returns the most recent write — all nodes see identical data.',
      dbs: ['PostgreSQL', 'MySQL', 'MongoDB (strong)'],
    },
    {
      label: 'Availability',
      color: C.green,
      desc: 'Every request gets a response (possibly stale) — system never refuses.',
      dbs: ['CouchDB', 'Cassandra', 'DynamoDB'],
    },
    {
      label: 'Partition Tolerance',
      color: C.amber,
      desc: 'System continues operating even if network messages are dropped between nodes.',
      dbs: ['Required in any distributed system — non-negotiable'],
    },
  ]

  return (
    <div className="my-6 bg-zinc-900 border border-zinc-700 rounded-sm p-5">
      <div className="font-mono text-[9px] tracking-[3px] uppercase text-zinc-500 mb-1">
        CAP Theorem
      </div>
      <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
        In a distributed system you can guarantee at most 2 of these 3 properties.
        Since network partitions always happen in the real world, P is non-negotiable —
        making the real engineering choice <span style={{ color: C.amber }}>C vs A</span>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {nodes.map(n => (
          <Card key={n.label} accent={n.color}>
            <div className="font-bold text-sm mb-2" style={{ color: n.color }}>{n.label}</div>
            <div className="text-xs text-zinc-400 leading-relaxed mb-3">{n.desc}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-1">Examples</div>
            {n.dbs.map(db => (
              <div key={db} className="text-[11px] text-zinc-500 pl-2 relative">
                <span style={{ color: n.color, position: 'absolute', left: 0 }}>·</span>{db}
              </div>
            ))}
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { pair: 'CP (Consistency + Partition Tolerance)', color: C.cyan,  trade: 'Will refuse requests during a partition rather than serve stale data. Banks, inventory systems.', ex: 'HBase, Zookeeper, etcd' },
          { pair: 'AP (Availability + Partition Tolerance)', color: C.green, trade: 'Will serve stale data during a partition rather than go down. Social feeds, analytics.', ex: 'Cassandra, CouchDB, DynamoDB' },
        ].map(p => (
          <div key={p.pair} className="p-3 rounded-sm border border-zinc-800"
            style={{ borderLeft: `3px solid ${p.color}`, background: `${p.color}08` }}>
            <div className="font-bold text-xs mb-1" style={{ color: p.color }}>{p.pair}</div>
            <div className="text-xs text-zinc-400 leading-snug mb-1">{p.trade}</div>
            <div className="font-mono text-[9px] text-zinc-600">e.g. {p.ex}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
