import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import { Chip, Crumbs, PhaseDot, StatTile, StatusBadge } from '@/components/techseries/ui'
import { getSeries, techSeries } from '@/data/techSeries'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ series: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return techSeries.map((s) => ({ series: s.slug }))
}

export async function generateMetadata(props: Props) {
  const s = getSeries((await props.params).series)
  if (!s) return
  return genPageMetadata({ title: `${s.title} — ${s.subtitle}`, description: s.description })
}

export default async function SeriesPage(props: Props) {
  const s = getSeries((await props.params).series)
  if (!s) return notFound()
  const published = s.phases.filter((p) => p.status === 'published').length

  return (
    <div className="pt-6 pb-8">
      <Crumbs items={[{ label: 'Tech Series', href: '/tech-series' }, { label: s.title }]} />

      <section className="mt-6 flex flex-wrap items-start gap-10">
        <div className="min-w-0 flex-[1_1_480px]">
          <span className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/50 dark:text-primary-300 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold">
            <span aria-hidden="true" className="bg-primary-500 h-2 w-2 rounded-full" />
            {s.status}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            {s.title}
            <span className="text-primary-500 mt-1 block text-[0.6em]">{s.subtitle}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            {s.description} Six phases, one page each: what I built, the commands, how a change
            flows, what broke and why I chose this over the alternatives.
          </p>
          <div className="mt-6 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Tech stack used
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.stack.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/tech-series/${s.slug}/${s.phases[0].slug}`}
              className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white"
            >
              Start at Phase 1 <span aria-hidden="true">→</span>
            </Link>
            {s.blogPost && (
              <Link
                href={s.blogPost}
                className="inline-flex items-center rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                Read the summary post
              </Link>
            )}
          </div>
        </div>

        <aside
          aria-label="Series progress"
          className="min-w-[280px] flex-[1_1_320px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg lg:max-w-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Series progress</div>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {s.phases.map((p) => (
              <span
                key={p.slug}
                className={`h-2.5 flex-1 rounded-full ${
                  p.status === 'published' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {published} of {s.phases.length} phases published
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatTile value={s.phases.length} label="Phases in total" />
            <StatTile value={s.environments} label="Environments" />
          </div>
          <div className="mt-5 flex flex-col gap-1 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <span>Cloud: {s.cloud}</span>
            <span>Updated {s.updated}</span>
          </div>
        </aside>
      </section>

      <section aria-labelledby="phases-h" className="pt-14">
        <h2
          id="phases-h"
          className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          The phases
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Read them in order. Each one builds on the last.
        </p>
        <ol className="relative mt-7 space-y-5">
          <span
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[17px] w-0.5 bg-gray-200 dark:bg-gray-700"
          />
          {s.phases.map((p) => (
            <li key={p.slug} className="relative flex items-start gap-4">
              <PhaseDot n={p.n} status={p.status} />
              <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-2 max-w-3xl text-gray-500 dark:text-gray-400">{p.short}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/tech-series/${s.slug}/${p.slug}`}
                    className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1.5 font-semibold hover:underline"
                  >
                    Read Phase {p.n} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Before you start" className="pt-14">
        <div className="grid gap-5 md:grid-cols-3">
          {s.before.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{c.title}</div>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-500 dark:text-gray-400">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              {c.title === 'How to follow along' && (
                <ul className="mt-3 space-y-1 text-sm">
                  {s.repos.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {r.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
