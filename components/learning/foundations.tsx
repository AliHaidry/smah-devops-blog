'use client'

import { C, Card, Checklist, DataTable } from './shared'

// ── Big-O Visualiser ──────────────────────────────────────────────────────────
export default function BigOVisual() {
  const complexities = [
    {
      notation: 'O(1)',
      label: 'Constant',
      color: C.green,
      bar: 4,
      example: 'Hash map lookup, array access by index',
    },
    {
      notation: 'O(log n)',
      label: 'Logarithmic',
      color: C.cyan,
      bar: 12,
      example: 'Binary search, balanced BST operations',
    },
    {
      notation: 'O(n)',
      label: 'Linear',
      color: C.blue,
      bar: 28,
      example: 'Linear scan, single loop through array',
    },
    {
      notation: 'O(n log n)',
      label: 'Linearithmic',
      color: C.yellow,
      bar: 42,
      example: 'Merge sort, heap sort, most fast sorts',
    },
    {
      notation: 'O(n²)',
      label: 'Quadratic',
      color: C.orange,
      bar: 64,
      example: 'Bubble sort, nested loops, naive string match',
    },
    {
      notation: 'O(2ⁿ)',
      label: 'Exponential',
      color: C.red,
      bar: 90,
      example: 'Recursive Fibonacci, brute-force subsets',
    },
  ]

  return (
    <div className="my-6 rounded-sm border border-zinc-700 bg-zinc-900 p-5">
      <div className="mb-4 font-mono text-[9px] tracking-[3px] text-zinc-500 uppercase">
        Big-O Complexity — growth rate as n → ∞
      </div>
      <div className="space-y-3">
        {complexities.map((c) => (
          <div key={c.notation} className="flex items-center gap-3">
            <div className="w-24 flex-shrink-0 font-mono text-xs" style={{ color: c.color }}>
              {c.notation}
            </div>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${c.bar}%`, background: c.color, opacity: 0.85 }}
              />
            </div>
            <div className="hidden w-64 flex-shrink-0 text-xs text-zinc-500 md:block">
              {c.example}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-zinc-600">
        Rule: if your algorithm has nested loops, it&apos;s probably O(n²) or worse. Always ask
        before coding.
      </p>
    </div>
  )
}

// ── Data Structures Table ─────────────────────────────────────────────────────
export function DataStructuresTable() {
  const structures = [
    {
      name: 'Array',
      lookup: 'O(1)',
      insert: 'O(n)',
      delete: 'O(n)',
      use: 'Indexed access, iteration, known size',
    },
    {
      name: 'Hash Map',
      lookup: 'O(1) avg',
      insert: 'O(1) avg',
      delete: 'O(1)',
      use: 'Fast key lookup, counting, deduplication',
    },
    {
      name: 'Stack',
      lookup: 'O(n)',
      insert: 'O(1)',
      delete: 'O(1)',
      use: 'LIFO — undo, call stack, bracket matching',
    },
    {
      name: 'Queue',
      lookup: 'O(n)',
      insert: 'O(1)',
      delete: 'O(1)',
      use: 'FIFO — job queues, BFS, event processing',
    },
    {
      name: 'Binary Tree',
      lookup: 'O(log n)',
      insert: 'O(log n)',
      delete: 'O(log n)',
      use: 'Sorted data, range queries, BST',
    },
    {
      name: 'Heap',
      lookup: 'O(1) min',
      insert: 'O(log n)',
      delete: 'O(log n)',
      use: 'Priority queues, scheduling, top-K',
    },
    {
      name: 'Graph',
      lookup: 'O(V+E)',
      insert: 'O(1)',
      delete: 'O(E)',
      use: 'Relationships, shortest path, dependencies',
    },
    {
      name: 'Trie',
      lookup: 'O(m)',
      insert: 'O(m)',
      delete: 'O(m)',
      use: 'Autocomplete, prefix search, dictionaries',
    },
  ]
  return (
    <DataTable
      heads={['Structure', 'Lookup', 'Insert', 'Delete', 'Use When']}
      rows={structures.map((s) => [s.name, s.lookup, s.insert, s.delete, s.use])}
    />
  )
}

// ── Algorithm Patterns ────────────────────────────────────────────────────────
export function AlgorithmPatterns() {
  const patterns = [
    {
      name: 'Two Pointers',
      color: C.cyan,
      signal: 'Sorted array, pair/triplet problems',
      example: 'Two-sum, remove duplicates, palindrome check',
    },
    {
      name: 'Sliding Window',
      color: C.green,
      signal: '"Contiguous subarray of size k"',
      example: 'Max sum subarray, longest substring without repeat',
    },
    {
      name: 'BFS / DFS',
      color: C.blue,
      signal: 'Graphs, trees, "shortest path"',
      example: 'Level-order traversal, island counting, word ladder',
    },
    {
      name: 'Dynamic Programming',
      color: C.amber,
      signal: 'Overlapping subproblems, optimal substructure',
      example: 'Fibonacci, knapsack, coin change, edit distance',
    },
    {
      name: 'Binary Search',
      color: C.purple,
      signal: 'Sorted data, "find X in sorted..."',
      example: 'Search in rotated array, first/last position',
    },
    {
      name: 'Divide & Conquer',
      color: C.red,
      signal: 'Can split problem into independent halves',
      example: 'Merge sort, quick sort, matrix multiplication',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {patterns.map((p) => (
        <Card key={p.name} accent={p.color}>
          <div className="mb-1 text-sm font-bold" style={{ color: p.color }}>
            {p.name}
          </div>
          <div className="mb-2 font-mono text-[10px] leading-snug text-zinc-500">
            SIGNAL: {p.signal}
          </div>
          <div className="text-xs text-zinc-400">{p.example}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Computational Thinking Pillars ────────────────────────────────────────────
export function ComputationalThinkingPillars() {
  const pillars = [
    {
      name: 'Decomposition',
      color: C.cyan,
      desc: 'Break complex problems into smaller, manageable sub-problems. Instagram = auth + feed + upload + stories + notifications. Each solvable independently.',
    },
    {
      name: 'Pattern Recognition',
      color: C.green,
      desc: 'Identify similarities with problems you\'ve solved before. "This is just graph traversal." "This is two pointers again." Vocabulary compounds.',
    },
    {
      name: 'Abstraction',
      color: C.amber,
      desc: 'Focus on essential details, ignore the irrelevant. A function signature is an abstraction. An API is an abstraction. Know what to hide.',
    },
    {
      name: 'Algorithm Design',
      color: C.purple,
      desc: 'Define a step-by-step solution. Not code — the logical sequence of operations. Pseudocode first, always.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {pillars.map((p) => (
        <Card key={p.name} accent={p.color}>
          <div className="mb-2 text-sm font-bold" style={{ color: p.color }}>
            {p.name}
          </div>
          <div className="leading-relaxed text-zinc-400">{p.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Programming Concepts ──────────────────────────────────────────────────────
export function ProgrammingConcepts() {
  const concepts = [
    {
      name: 'Types & Type Safety',
      color: C.cyan,
      desc: "Type hints in Python, TypeScript's type system. Catch a whole class of bugs at development time, not production.",
    },
    {
      name: 'Error Handling',
      color: C.red,
      desc: "Handle every error path explicitly. Don't swallow exceptions. The happy path is easy; the error path reveals craft.",
    },
    {
      name: 'Concurrency',
      color: C.amber,
      desc: 'async/await, threading, race conditions. Understand the event loop. Know when concurrency helps vs when it creates complexity.',
    },
    {
      name: 'Memory Management',
      color: C.purple,
      desc: "Reference counting, garbage collection, memory leaks. You don't manage memory manually in Python/JS, but you still need to understand it.",
    },
    {
      name: 'Functional Patterns',
      color: C.green,
      desc: 'map, filter, reduce, pure functions, immutability. These patterns make code easier to test and reason about.',
    },
    {
      name: 'Testing',
      color: C.blue,
      desc: 'Unit tests, integration tests. TDD changes how you design code. Write tests before feeling "done" is a habit, not a task.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {concepts.map((c) => (
        <Card key={c.name} accent={c.color}>
          <div className="mb-2 text-sm font-bold" style={{ color: c.color }}>
            {c.name}
          </div>
          <div className="leading-relaxed text-zinc-400">{c.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Networking Concepts ───────────────────────────────────────────────────────
export function NetworkingConcepts() {
  const concepts = [
    {
      name: 'TCP vs UDP',
      color: C.cyan,
      desc: 'TCP: reliable, ordered, slower (web, email, APIs). UDP: fast, lossy, real-time (video, gaming, DNS queries). Know which to reach for.',
    },
    {
      name: 'HTTP Methods',
      color: C.green,
      desc: 'GET=read (idempotent), POST=create, PUT=replace, PATCH=update, DELETE=remove. Using the wrong verb breaks caching and semantics.',
    },
    {
      name: 'TLS / HTTPS',
      color: C.amber,
      desc: 'Encryption in transit. TLS handshake: client hello → server cert → key exchange → encrypted channel. Never send credentials over plain HTTP.',
    },
    {
      name: 'DNS',
      color: C.blue,
      desc: 'Domain → IP mapping. Recursive resolver → root → TLD → authoritative. TTL controls caching. Understand this to debug 503s and slow starts.',
    },
    {
      name: 'HTTP Status Codes',
      color: C.purple,
      desc: '2xx=success, 3xx=redirect, 4xx=client error, 5xx=server error. 200/201/204/301/400/401/403/404/422/429/500/502/503. Know all of these cold.',
    },
    {
      name: 'Load Balancing',
      color: C.red,
      desc: 'L4 (TCP) vs L7 (HTTP). Round-robin, least-connections, consistent hashing. Health checks. Session affinity. The gateway to horizontal scale.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {concepts.map((c) => (
        <Card key={c.name} accent={c.color}>
          <div className="mb-2 text-sm font-bold" style={{ color: c.color }}>
            {c.name}
          </div>
          <div className="leading-relaxed text-zinc-400">{c.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Linux Commands ────────────────────────────────────────────────────────────
export function LinuxCommands() {
  const categories = [
    {
      name: 'Navigation',
      color: C.cyan,
      cmds: [
        { cmd: 'ls -la', desc: 'List files with permissions and hidden files' },
        { cmd: 'find . -name "*.log"', desc: 'Find files by pattern' },
        { cmd: 'cd -', desc: 'Jump back to previous directory' },
      ],
    },
    {
      name: 'Processes',
      color: C.green,
      cmds: [
        { cmd: 'ps aux | grep python', desc: 'Find running Python processes' },
        { cmd: 'htop', desc: 'Interactive process viewer' },
        { cmd: 'kill -9 PID', desc: 'Force-kill a process' },
      ],
    },
    {
      name: 'Logs & Text',
      color: C.amber,
      cmds: [
        { cmd: 'tail -f app.log', desc: 'Live log stream' },
        { cmd: 'grep -r "ERROR" /var/log/', desc: 'Recursive log search' },
        { cmd: "awk '{print $1}' access.log | sort | uniq -c", desc: 'Count occurrences' },
      ],
    },
    {
      name: 'Network',
      color: C.blue,
      cmds: [
        { cmd: 'curl -v https://api.example.com', desc: 'Verbose HTTP request' },
        { cmd: 'ss -tlnp', desc: 'Show listening ports' },
        { cmd: 'traceroute google.com', desc: 'Trace network hops' },
      ],
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {categories.map((cat) => (
        <Card key={cat.name} accent={cat.color}>
          <div className="mb-3 text-sm font-bold" style={{ color: cat.color }}>
            {cat.name}
          </div>
          {cat.cmds.map((c) => (
            <div key={c.cmd} className="mb-2">
              <code className="font-mono text-[11px] text-zinc-200">{c.cmd}</code>
              <div className="mt-0.5 text-[11px] text-zinc-500">{c.desc}</div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  )
}

// ── Foundations Checklist ─────────────────────────────────────────────────────
export function FoundationsChecklist() {
  return (
    <Checklist
      storageKey="foundations-checklist"
      items={[
        'Implement 5+ data structures from scratch: array, hash map, stack, queue, heap',
        'Solve 30+ algorithm problems — write the pattern name after each solution',
        'Explain Big-O for every data structure operation without looking it up',
        'Build a project using stack, heap, and hash map together',
        'Decompose two real systems (e.g. Instagram, Spotify) into components',
        'Write a 300+ line typed project with full error handling and tests',
        'Design a relational database schema and write 5 non-trivial queries',
        'EXPLAIN ANALYZE at least 3 queries and add missing indexes',
        'Explain the full lifecycle of an HTTP request from URL to response',
        'Diagnose a simulated Linux server problem entirely from the CLI',
        'Write a bash script that automates a real task',
        'Deploy an app to a Linux server over SSH with Nginx',
      ]}
    />
  )
}
