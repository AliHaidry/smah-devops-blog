import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

const techBadges = [
  { label: 'Azure', color: '#0078D4' },
  { label: 'Kubernetes', color: '#326CE5' },
  { label: 'Terraform', color: '#7B42BC' },
  { label: 'Docker', color: '#2496ED' },
  { label: 'CI/CD', color: '#E44C30' },
  { label: 'Observability', color: '#F46800' },
]

const highlights = [
  { value: '5+', label: 'Years in DevOps' },
  { value: '13+', label: 'Articles Published' },
  { value: '6', label: 'Cloud Certifications' },
  { value: '3', label: 'Cloud Platforms' },
]

export default function Home({ posts }) {
  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="pt-10 pb-10 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left — text content */}
          <div className="flex-1">
            {/* Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 dark:border-gray-700 dark:bg-gray-800/60">
              <span className="relative flex h-2 w-2">
                <span className="bg-primary-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-primary-500 relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Senior DevOps Engineer · Karachi, PK
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
              Hi, I'm <span className="text-primary-500">Ali</span>
              <span className="mt-1 block">
                I write about <span className="text-primary-500">DevOps</span>
              </span>
              <span className="mt-1 block text-gray-500 dark:text-gray-400">
                & Cloud Engineering
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              Deep-dives on Azure, Kubernetes, CI/CD pipelines, and cloud-native architecture —
              written from real production experience.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="bg-primary-500 hover:bg-primary-600 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition"
              >
                Read Articles →
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
              >
                About Me
              </Link>
            </div>

            {/* Tech badges */}
            <div className="mt-7 flex flex-wrap gap-2">
              {techBadges.map((t) => (
                <span
                  key={t.label}
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: `${t.color}40`,
                    backgroundColor: `${t.color}0D`,
                    color: t.color,
                  }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — stats card */}
          <div className="w-full flex-shrink-0 md:w-72 lg:w-80">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-primary-500/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Syed Muhammad Ali Haidry
                  </div>
                  <div className="text-primary-500 text-xs font-medium">
                    AZ-305 · CDS | Ex TD Bank
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-700/40"
                  >
                    <div className="text-primary-500 text-xl font-extrabold">{h.value}</div>
                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{h.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href="https://github.com/AliHaidry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/ali-haidry-meng-7b5ba9136/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Latest Articles ───────────────────────────────────────────── */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-2 pb-6 md:space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Latest Articles
            </h2>
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-10">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h3>
                          <div className="mt-1 flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-2 text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts →
          </Link>
        </div>
      )}
    </>
  )
}
