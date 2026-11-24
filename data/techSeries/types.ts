export type PhaseStatus = 'published' | 'in-progress' | 'planned'

export interface Outcome {
  title: string
  text: string
  badge?: string
}
export interface Step {
  title: string
  text: string
  code: string
  check: string
}
export interface FlowStep {
  title: string
  text: string
}
export interface Issue {
  problem: string
  cause: string
  fix: string
}
export interface Tradeoff {
  title: string
  chose: string
  why: string
  cost: string
}
export interface QA {
  q: string
  a: string
}
export interface Figure {
  src: string
  alt: string
  caption: string
}

export interface Phase {
  n: number
  slug: string // e.g. 'phase-1'
  title: string
  short: string // one-line goal for the series page
  intro: string // hero sentence
  tags: string[]
  topics: string[]
  status: PhaseStatus
  goalText: string
  outcomes: Outcome[]
  steps: Step[]
  stepsNote?: string
  flowIntro: string
  flow: FlowStep[]
  rollback: string
  figures: Figure[]
  issues: Issue[]
  tradeoffs: Tradeoff[]
  qa: QA[]
  updated: string
}

export interface Series {
  slug: string
  title: string
  subtitle: string
  description: string
  status: string
  updated: string
  cloud: string
  environments: number
  stack: string[]
  categories: string[] // filter labels this series belongs to
  blogPost?: string
  repos: { label: string; href: string }[]
  before: { title: string; items: string[] }[]
  phases: Phase[]
}
