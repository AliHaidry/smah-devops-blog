'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import { Series } from '@/data/techSeries'
import { Chip, PhaseDot, StatTile } from './ui'

const structure = [
  { n: '01', title: 'Goal', desc: 'What the phase delivers and why' },
  { n: '02', title: 'Steps and commands', desc: 'Copy-ready, in the order I ran them' },
  { n: '03', title: 'Workflow', desc: 'How a change moves from dev to prod' },
  { n: '04', title: 'Diagram', desc: 'The picture behind the text' },
  { n: '05', title: 'Issues met', desc: 'What broke, the cause, the fix' },
  { n: '06', title: 'Trade-offs', desc: 'The options I weighed, and why this one' },
  { n: '07', title: 'Interview questions', desc: 'What this phase lets you answer' },
]

interface Props {
  series: Series[]
  upcoming: { title: string; text: string }[]
}

export default function SeriesIndex({ series, upcoming }: Props) {
  const filters = ['All series', ...Array.from(new Set(series.flatMap((s) => s.categories)))]
  const [active, setActive] = useState('All series')
  const shown = series.filter((s) => active === 'All series' || s.categories.includes(active))
  const first = series[0]

  return (
    <div>
      {/* hero */}
      <section className="flex flex-wrap items-center gap-10 pt-8 pb-8 md:pt-12">
        <div className="min-w-0 flex-[1_1_480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm dark:border-gray-700">
            <span aria-hidden="true" className="bg-primary-500 h-2 w-2 rounded-full" />
            Guided series · learn by building
          </div>
          <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            Tech <span className="text-primary-500">Series</span>
            <span className="block text-gray-500 dark:text-gray-400">one phase at a time</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-500 dark:text-gray-400">
            Big projects, taken apart into guided phases. Each page explains the goal, the steps and
            commands, the workflow, the issues I hit and the trade-offs behind every choice.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {first && (
              <Link
                href={`/tech-series/${first.slug}`}
                className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white"
              >
                Start with {first.title} <span aria-hidden="true">→</span>
              </Link>
            )}
            <a
              href="#series"
              className="inline-flex items-center rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Browse all series
            </a>
          </div>
        </div>

        <aside
          aria-label="How every phase page is structured"
          className="min-w-[280px] flex-[1_1_340px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Every phase page has the same seven blocks
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            So you always know where to look.
          </div>
          <ul className="mt-4 grid gap-2">
            {structure.map((r) => (
              <li
                key={r.n}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60"
              >
                <span aria-hidden="true" className="text-primary-500 w-7 text-lg font-bold">
                  {r.n}
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-gray-900 dark:text-gray-100">
                    {r.title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{r.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* filters */}
      <section id="series" className="scroll-mt-6 pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            All series
          </h2>
          <span className="text-gray-500 dark:text-gray-400">
            {series.length} series live · more on the way
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter series">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(f)}
              className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active === f
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'hover:border-primary-300 border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* cards */}
      <section aria-label="Series list" className="space-y-6 pt-6">
        {shown.map((s) => {
          const published = s.phases.filter((p) => p.status === 'published').length
          return (
            <article
              key={s.slug}
              className="flex flex-wrap overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="bg-primary-50 dark:bg-primary-950/30 flex-[1_1_300px] p-6 sm:p-8">
                <div className="text-primary-800 dark:text-primary-300 text-xs font-semibold tracking-wider uppercase">
                  The {s.phases.length} phases
                </div>
                <ol className="mt-4 space-y-3">
                  {s.phases.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/tech-series/${s.slug}/${p.slug}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <PhaseDot n={p.n} status={p.status} />
                        <span className="leading-tight">
                          <span className="block font-semibold text-gray-900 dark:text-gray-100">
                            {p.title}
                          </span>
                          <span className="text-sm text-green-700 dark:text-green-400">
                            {p.status === 'published' ? 'Published' : 'Planned'}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="min-w-0 flex-[2_1_480px] p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/50 dark:text-primary-300 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold">
                    <span aria-hidden="true" className="bg-primary-500 h-2 w-2 rounded-full" />
                    {s.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Updated {s.updated}
                  </span>
                </div>
                <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
                  {s.title}
                </h3>
                <div className="text-primary-500 text-xl font-semibold">{s.subtitle}</div>
                <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400">{s.description}</p>

                <div className="mt-6 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Tech stack used
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.stack.map((t) => (
                    <Chip key={t} label={t} />
                  ))}
                </div>

                <div className="mt-6 grid max-w-lg grid-cols-3 gap-3">
                  <StatTile value={s.phases.length} label="Phases in total" />
                  <StatTile value={s.phases.length} label="Guide pages" />
                  <StatTile value={published} label="Published" />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/tech-series/${s.slug}`}
                    className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-white"
                  >
                    Start the series <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={`/tech-series/${s.slug}/${s.phases[s.phases.length - 1].slug}`}
                    className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    Jump to the latest phase
                  </Link>
                </div>
              </div>
            </article>
          )
        })}

        {active === 'All series' && (
          <div className="grid gap-5 sm:grid-cols-2">
            {upcoming.map((u) => (
              <div
                key={u.title}
                className="rounded-2xl border-2 border-dashed border-gray-300 p-6 dark:border-gray-700"
              >
                <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:bg-gray-800 dark:text-gray-400">
                  Coming soon
                </span>
                <div className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                  {u.title}
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{u.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
