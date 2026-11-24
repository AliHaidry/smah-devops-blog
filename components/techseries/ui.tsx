import Link from '@/components/Link'
import { PhaseStatus } from '@/data/techSeries'

const chipTones = [
  'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300',
  'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300',
  'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300',
  'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300',
  'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-300',
]

// Stable colour per label so the same tool always looks the same.
export function toneFor(label: string) {
  let h = 0
  for (const c of label) h = (h * 31 + c.charCodeAt(0)) % chipTones.length
  return chipTones[h]
}

export function Chip({ label }: { label: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${toneFor(label)}`}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: PhaseStatus }) {
  const map = {
    published: {
      label: 'Published',
      cls: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300',
    },
    'in-progress': {
      label: 'In progress',
      cls: 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-900 dark:bg-primary-950/50 dark:text-primary-300',
    },
    planned: {
      label: 'Planned',
      cls: 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
  }[status]
  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-sm font-semibold ${map.cls}`}
    >
      {map.label}
    </span>
  )
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400"
    >
      {items.map((it, i) => (
        <span key={it.label} className="flex gap-2">
          {it.href ? (
            <Link href={it.href} className="hover:text-primary-500">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-semibold text-gray-900 dark:text-gray-100">
              {it.label}
            </span>
          )}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  )
}

export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
      <div className="text-primary-600 dark:text-primary-400 text-2xl leading-tight font-bold">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

export function PhaseDot({ n, status }: { n: number; status: PhaseStatus }) {
  const cls =
    status === 'published'
      ? 'bg-primary-500 text-white'
      : status === 'in-progress'
        ? 'border-2 border-primary-500 bg-white text-primary-600 dark:bg-gray-950'
        : 'border-2 border-dashed border-gray-400 bg-white text-gray-500 dark:bg-gray-950'
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-base font-bold ${cls}`}
    >
      {n}
    </span>
  )
}
