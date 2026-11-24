import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from '@/components/Link'
import { Chip, Crumbs, StatusBadge } from '@/components/techseries/ui'
import { getSeries, techSeries } from '@/data/techSeries'
import { genPageMetadata } from 'app/seo'

type Props = { params: Promise<{ series: string; phase: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return techSeries.flatMap((s) => s.phases.map((p) => ({ series: s.slug, phase: p.slug })))
}

export async function generateMetadata(props: Props) {
  const { series, phase } = await props.params
  const s = getSeries(series)
  const p = s?.phases.find((x) => x.slug === phase)
  if (!s || !p) return
  return genPageMetadata({
    title: `${s.title} Phase ${p.n}: ${p.title}`,
    description: p.intro,
  })
}

const toc = [
  { id: 'goal', label: 'Goal' },
  { id: 'steps', label: 'Steps and commands' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'diagram', label: 'Diagram' },
  { id: 'issues', label: 'Issues met' },
  { id: 'tradeoffs', label: 'Trade-offs' },
  { id: 'interview', label: 'Interview questions' },
]

function Heading({ n, id, children }: { n: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <span aria-hidden="true" className="text-primary-500 text-lg font-bold">
        {n}
      </span>
      <h2
        id={id}
        className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
      >
        {children}
      </h2>
    </div>
  )
}

export default async function PhasePage(props: Props) {
  const { series, phase } = await props.params
  const s = getSeries(series)
  const idx = s ? s.phases.findIndex((x) => x.slug === phase) : -1
  if (!s || idx < 0) return notFound()
  const p = s.phases[idx]
  const prev = s.phases[idx - 1]
  const next = s.phases[idx + 1]
  const published = s.phases.filter((x) => x.status === 'published').length
  const sec = 'scroll-mt-24 mt-16 first:mt-0'

  return (
    <div className="pt-6 pb-8">
      <Crumbs
        items={[
          { label: 'Tech Series', href: '/tech-series' },
          { label: s.title, href: `/tech-series/${s.slug}` },
          { label: `Phase ${p.n}` },
        ]}
      />

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-primary-500 text-sm font-bold tracking-widest uppercase">
            Phase {p.n} of {s.phases.length}
          </span>
          <StatusBadge status={p.status} />
        </div>
        <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
          {p.title}
        </h1>
        <p className="mt-4 max-w-3xl text-xl text-gray-500 dark:text-gray-400">{p.intro}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {p.tags.map((t) => (
            <Chip key={t} label={t} />
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Updated {p.updated}</span>
        </div>
      </header>

      <div className="mt-12 flex flex-wrap items-start gap-12">
        <aside
          aria-label="On this page"
          className="hidden w-56 flex-none lg:sticky lg:top-6 lg:block"
        >
          <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            On this page
          </div>
          <ol className="mt-3 flex flex-col border-l-2 border-gray-200 dark:border-gray-700">
            {toc.map((t, i) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="hover:text-primary-500 -ml-0.5 block border-l-2 border-transparent px-3 py-1.5 text-sm text-gray-600 hover:border-current dark:text-gray-400"
                >
                  <span aria-hidden="true" className="mr-2 font-bold">
                    0{i + 1}
                  </span>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-xl border border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="font-semibold text-gray-900 dark:text-gray-100">Series progress</div>
            <div className="mt-1">
              Phase {p.n} of {s.phases.length} · {published} published
            </div>
          </div>
        </aside>

        <article className="max-w-3xl min-w-0 flex-[1_1_560px]">
          {/* 01 goal */}
          <section className={sec}>
            <Heading n="01" id="goal">
              Goal
            </Heading>
            <div className="border-primary-200 bg-primary-50 dark:border-primary-900 dark:bg-primary-950/30 mt-4 rounded-2xl border p-5">
              <div className="text-primary-800 dark:text-primary-300 text-xs font-bold tracking-wider uppercase">
                What this phase delivers
              </div>
              <p className="mt-2 text-gray-800 dark:text-gray-200">{p.goalText}</p>
            </div>
            <ul className="mt-5 space-y-2.5">
              {p.outcomes.map((o, i) => (
                <li
                  key={o.title}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700"
                >
                  <span
                    aria-hidden="true"
                    className="text-primary-500 w-5 flex-none text-xl font-bold"
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {o.title}
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">{o.text}</span>
                  </span>
                  {o.badge && (
                    <span className="flex-none rounded-full border border-green-200 bg-green-50 px-3 py-0.5 text-sm font-semibold text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300">
                      {o.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* 02 steps */}
          <section className={sec}>
            <Heading n="02" id="steps">
              Steps and commands
            </Heading>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Run these in dev first. Every step has a check that proves it worked, so you are never
              guessing. {p.stepsNote}
            </p>
            <ol className="mt-5 space-y-8">
              {p.steps.map((st, i) => (
                <li key={st.title} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="bg-primary-500 flex h-9 w-9 flex-none items-center justify-center rounded-full font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {st.title}
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">{st.text}</p>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-950 p-4 text-[13.5px] leading-7 text-gray-100">
                      <code>{st.code}</code>
                    </pre>
                    <div className="mt-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
                      <strong>Check:</strong> {st.check}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 03 workflow */}
          <section className={sec}>
            <Heading n="03" id="workflow">
              Workflow
            </Heading>
            <p className="mt-3 text-gray-500 dark:text-gray-400">{p.flowIntro}</p>
            <ol className="mt-5 flex flex-wrap items-stretch gap-2.5">
              {p.flow.map((f, i) => (
                <li key={f.title} className="flex items-center gap-2.5">
                  <span className="flex min-w-[120px] flex-col rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 dark:border-gray-700 dark:bg-gray-900">
                    <span className="text-primary-500 text-xs font-bold tracking-wide">
                      STEP {i + 1}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {f.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{f.text}</span>
                  </span>
                  {i < p.flow.length - 1 && (
                    <span aria-hidden="true" className="text-xl text-gray-400">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-gray-100">Rollback:</strong> {p.rollback}
            </p>
          </section>

          {/* 04 diagram */}
          <section className={sec}>
            <Heading n="04" id="diagram">
              Diagram
            </Heading>
            {p.figures.length === 0 ? (
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                [Add a diagram for this phase. The workflow above is its text version.]
              </p>
            ) : (
              <div className="mt-4 space-y-6">
                {p.figures.map((f) => (
                  <figure
                    key={f.src}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      width={1600}
                      height={900}
                      sizes="(min-width: 1024px) 768px, 100vw"
                      className="h-auto w-full rounded-lg"
                    />
                    <figcaption className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {f.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          {/* 05 issues */}
          <section className={sec}>
            <Heading n="05" id="issues">
              Issues met
            </Heading>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              These are real, from the run. The surprises are the useful part.
            </p>
            <div className="mt-4 space-y-4">
              {p.issues.map((i) => (
                <div
                  key={i.problem}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{i.problem}</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-red-50 p-3 dark:bg-red-950/30">
                      <div className="text-xs font-bold tracking-wider text-red-700 uppercase dark:text-red-300">
                        Cause
                      </div>
                      <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">{i.cause}</div>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3 dark:bg-green-950/30">
                      <div className="text-xs font-bold tracking-wider text-green-800 uppercase dark:text-green-300">
                        Fix
                      </div>
                      <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">{i.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 06 trade-offs */}
          <section className={sec}>
            <Heading n="06" id="tradeoffs">
              Trade-offs
            </Heading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {p.tradeoffs.map((t) => (
                <div
                  key={t.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {t.title}
                  </div>
                  <div className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/50 dark:text-primary-300 mt-2 inline-block rounded-full border px-3 py-0.5 text-sm font-semibold">
                    I chose: {t.chose}
                  </div>
                  <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                    <strong>Why:</strong> {t.why}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-gray-100">It costs:</strong> {t.cost}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 07 interview */}
          <section className={sec}>
            <Heading n="07" id="interview">
              Interview questions
            </Heading>
            <div className="mt-4 space-y-3">
              {p.qa.map((x) => (
                <div
                  key={x.q}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{x.q}</div>
                  <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{x.a}</div>
                </div>
              ))}
            </div>
          </section>

          {/* prev / next */}
          <nav aria-label="Phase navigation" className="mt-16 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/tech-series/${s.slug}/${prev.slug}`}
                className="hover:border-primary-300 block rounded-2xl border border-gray-200 bg-white p-5 no-underline dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">← Previous</span>
                <span className="mt-1 block text-lg font-bold text-gray-900 dark:text-gray-100">
                  Phase {prev.n}: {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/tech-series/${s.slug}/${next.slug}`}
                className="hover:border-primary-300 block rounded-2xl border border-gray-200 bg-white p-5 text-right no-underline dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">Next →</span>
                <span className="mt-1 block text-lg font-bold text-gray-900 dark:text-gray-100">
                  Phase {next.n}: {next.title}
                </span>
              </Link>
            ) : (
              <Link
                href={`/tech-series/${s.slug}`}
                className="hover:border-primary-300 block rounded-2xl border border-gray-200 bg-white p-5 text-right no-underline dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">Series complete</span>
                <span className="mt-1 block text-lg font-bold text-gray-900 dark:text-gray-100">
                  Back to {s.title}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  )
}
