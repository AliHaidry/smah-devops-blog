'use client'

import { useState } from 'react'
import { C, Card, Checklist, DataTable } from './shared'

// ── Document Types Table ──────────────────────────────────────────────────────
export default function DocumentTypesTable() {
  const docs = [
    {
      name: 'RFC (Request for Comments)',
      color: C.amber,
      when: 'You want to propose a significant technical change and surface disagreement early',
      sections: ['Problem', 'Context', 'Proposed Solution', 'Alternatives Considered', 'Impact', 'Open Questions'],
      rule: 'Write the "Alternatives Considered" section before the "Proposed Solution". Forces honest evaluation.',
    },
    {
      name: 'ADR (Architecture Decision Record)',
      color: C.blue,
      when: 'You\'ve made an important technical decision and want to explain it to future engineers',
      sections: ['Date & Status', 'Context', 'Decision', 'Rationale', 'Consequences', 'Revisit When'],
      rule: 'Always fill in "Revisit When". It makes the decision honest about its lifespan.',
    },
    {
      name: 'Post-mortem / Incident Review',
      color: C.red,
      when: 'After any production incident, even small ones',
      sections: ['Impact & Timeline', 'Root Cause (5 Whys)', 'Contributing Factors', 'Action Items', 'Process Improvements'],
      rule: 'Blameless. The question is never "who did this?" — it\'s "what made this possible?"',
    },
  ]
  const [active, setActive] = useState(0)
  const doc = docs[active]

  return (
    <div className="my-6">
      <div className="flex gap-2 mb-4 flex-wrap">
        {docs.map((d, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="text-xs px-3 py-1.5 rounded-sm border transition-all duration-150"
            style={{ borderColor: i === active ? d.color : '#3f3f46', background: i === active ? `${d.color}18` : 'transparent', color: i === active ? d.color : '#71717a' }}>
            {d.name.split(' ')[0]}
          </button>
        ))}
      </div>
      <Card accent={doc.color}>
        <div className="font-bold text-sm mb-1" style={{ color: doc.color }}>{doc.name}</div>
        <div className="text-xs text-zinc-500 mb-4 italic">{doc.when}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-2">Required Sections</div>
            {doc.sections.map(s => (
              <div key={s} className="text-xs text-zinc-400 pl-3 mb-1 relative">
                <span style={{ color: doc.color, position: 'absolute', left: 0 }}>›</span>{s}
              </div>
            ))}
          </div>
          <div className="bg-zinc-900 rounded-sm p-3" style={{ borderLeft: `2px solid ${doc.color}` }}>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: doc.color }}>Golden Rule</div>
            <div className="text-xs text-zinc-400 leading-relaxed">{doc.rule}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── C4 Model Diagram ──────────────────────────────────────────────────────────
export function C4ModelDiagram() {
  const levels = [
    { level: 'L1', name: 'System Context', color: C.amber,  audience: 'Everyone, including non-technical', shows: 'Your system as a single box, its users, and external systems it talks to', when: 'Kick-off meetings, stakeholder updates' },
    { level: 'L2', name: 'Container',      color: C.cyan,   audience: 'Technical leads, architects', shows: 'Applications and databases inside the system (web app, API, DB, cache)', when: 'Architecture discussions, onboarding engineers' },
    { level: 'L3', name: 'Component',      color: C.green,  audience: 'Developers', shows: 'Components inside a container (controllers, services, repositories)', when: 'Design reviews, documenting complex services' },
    { level: 'L4', name: 'Code',           color: C.purple, audience: 'Developers (on demand)', shows: 'Classes, functions, modules inside a component', when: 'Only when the code itself isn\'t clear enough' },
  ]
  return (
    <div className="my-6 space-y-2">
      {levels.map((l, i) => (
        <div key={i} className="flex items-start gap-4 p-4 border border-zinc-800 rounded-sm bg-zinc-900/50">
          <div className="font-mono text-xs w-6 flex-shrink-0 mt-0.5" style={{ color: l.color }}>{l.level}</div>
          <div className="w-0.5 self-stretch rounded" style={{ background: l.color, flexShrink: 0 }} />
          <div className="flex-1">
            <div className="font-bold text-sm mb-1" style={{ color: l.color }}>{l.name}</div>
            <div className="text-xs text-zinc-400 leading-snug mb-1">{l.shows}</div>
            <div className="font-mono text-[9px] text-zinc-600">AUDIENCE: {l.audience}</div>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono max-w-[140px] text-right hidden md:block">{l.when}</div>
        </div>
      ))}
    </div>
  )
}

// ── Code Review Principles ────────────────────────────────────────────────────
export function CodeReviewPrinciples() {
  const principles = [
    { title: 'Label your feedback', color: C.amber, bad: '"This should probably be different"', good: '"SUGGESTION: consider using a map here for O(1) lookup instead of O(n) linear scan"', why: 'The author knows whether to block on this or take it as optional.' },
    { title: 'Ask questions instead of demanding', color: C.cyan, bad: '"This is wrong, fix it."', good: '"What happens if user is null here? Should we guard against that?"', why: 'Leaves room for the author to have a reason you don\'t know about.' },
    { title: 'Explain the why', color: C.green, bad: '"Don\'t do it this way."', good: '"Avoid mutable default args in Python — this dict is shared across all calls. Use None and initialise inside the function."', why: 'The author learns, not just changes.' },
    { title: 'Acknowledge good work', color: C.blue, bad: '(silence on everything well-done)', good: '"Nice! The guard clauses make this much easier to follow than the original."', why: 'Positive reinforcement makes people receptive to the critical feedback.' },
  ]
  return (
    <div className="space-y-3 my-4">
      {principles.map(p => (
        <Card key={p.title} accent={p.color}>
          <div className="font-bold text-sm mb-3" style={{ color: p.color }}>{p.title}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div>
              <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: C.red }}>✗ Don't</div>
              <div className="text-xs text-zinc-500 italic bg-zinc-900 p-2 rounded-sm">"{p.bad}"</div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: C.green }}>✓ Do</div>
              <div className="text-xs text-zinc-300 bg-zinc-900 p-2 rounded-sm">"{p.good}"</div>
            </div>
          </div>
          <div className="text-xs text-zinc-500 pl-3" style={{ borderLeft: `2px solid ${p.color}` }}>Why: {p.why}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Technical to Business Translation Table ───────────────────────────────────
export function TechnicalToBusinessTable() {
  return (
    <DataTable
      heads={['Technical Reality', 'Business Translation', 'Why It Lands']}
      rows={[
        ['p99 latency increased from 200ms to 2s', 'The slowest 1% of checkout requests now take 10× longer — this directly impacts conversion rate', 'Revenue is the universal language'],
        ['We have no test coverage on the payment module', 'One change to payments could silently break billing with no automated safety net', 'Risk is the executive\'s concern'],
        ['The codebase has significant technical debt', 'We\'re spending ~40% of engineer time working around old decisions instead of building new features', 'Opportunity cost resonates'],
        ['We need to migrate to a new auth library', 'The current library has an unpatched CVE — we\'re exposed to credential theft until we upgrade', 'Security risk is always a priority'],
        ['We should refactor the monolith into services', 'Right now, all teams deploy together — one bug can block everyone. Splitting services lets teams ship independently', 'Team velocity is a business metric'],
      ]}
    />
  )
}

// ── Mentoring Techniques ──────────────────────────────────────────────────────
export function MentoringTechniques() {
  const techniques = [
    { name: 'Socratic Questioning', color: C.amber, desc: 'Guide with questions, not answers. "What do you think would happen if...?" "What are the tradeoffs of approach A vs B?" The mentee owns the reasoning.', when: 'Debugging, design reviews, any time they\'re close to the answer' },
    { name: 'Rubber Duck Pairing', color: C.cyan, desc: 'Have them explain their problem to you before you say anything. The act of explaining often surfaces the answer. Your role: listen carefully and ask clarifying questions.', when: 'Bug hunts, unclear requirements, design confusion' },
    { name: 'Just-in-time Teaching', color: C.green, desc: 'Teach the concept the moment they need it — not in the abstract. When they hit a real mutex bug, that\'s when you teach concurrency. The context makes it stick.', when: 'Any time a real problem maps to a teachable concept' },
    { name: 'Show Your Work', color: C.blue, desc: 'When you solve something, narrate your thinking. "I\'m checking the logs first because... then I\'m going to look at..." Expose the process, not just the answer.', when: 'Pair programming, live debugging, architecture sessions' },
    { name: 'Structured Feedback', color: C.purple, desc: 'SBI model: Situation (when X happened), Behaviour (you did Y), Impact (which led to Z). Specific, observable, factual. Not "you write messy code" but "in the PR last week, the function names made it hard to understand intent without reading the body."', when: 'Performance conversations, regular 1:1s, code reviews' },
  ]
  return (
    <div className="space-y-3 my-4">
      {techniques.map(t => (
        <Card key={t.name} accent={t.color}>
          <div className="font-bold text-sm mb-1" style={{ color: t.color }}>{t.name}</div>
          <div className="text-xs text-zinc-400 leading-relaxed mb-2">{t.desc}</div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-zinc-600">WHEN: <span className="text-zinc-500 normal-case tracking-normal">{t.when}</span></div>
        </Card>
      ))}
    </div>
  )
}

// ── Communication Checklist ───────────────────────────────────────────────────
export function CommChecklist() {
  return (
    <Checklist
      storageKey="comm-checklist"
      items={[
        'Written an RFC that prevented a bad technical decision',
        'Written an ADR that explained a past decision to a future team member',
        'Given a technical presentation to a mixed (technical + non-technical) audience',
        'Used the C4 model to communicate a system at the right level of abstraction',
        'Written a blameless post-mortem that led to a real process improvement',
        'Given a code review with labelled feedback (BLOCKING / SUGGESTION / NIT)',
        'Written a PR description that a reviewer could understand without asking questions',
        'Translated a technical concern into a business impact statement',
        'Surfaced a problem to leadership on the day it was discovered (not after)',
        'Disagreed with a decision, made the case clearly, then committed fully',
        'Mentored a less experienced engineer using at least one structured technique',
        'Written a "Rule of Three" internal doc — something you\'d explained twice already',
        'Given a lunch-and-learn or lightning talk on a technical topic',
        'Read The Staff Engineer\'s Path (Tanya Reilly)',
      ]}
    />
  )
}
