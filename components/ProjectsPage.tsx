'use client'

import { useState } from 'react'
import { Project } from '@/data/projectsData'

interface Props {
  projects: Project[]
}

const categoryColors: Record<string, string> = {
  Observability: '#F46800',
  Automation: '#6B21A8',
  'CI/CD': '#E44C30',
  Cloud: '#0078D4',
  IaC: '#326CE5',
  Personal: '#00C896',
}

const statusColors: Record<string, string> = {
  Production: '#00C896',
  Completed: '#0078D4',
  'In Progress': '#F46800',
}

const categories = ['All', 'Observability', 'Automation', 'CI/CD', 'Cloud', 'IaC', 'Personal']

function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-4 space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: '#0078D4' }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="mt-1 h-full w-px bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
          <p className="pb-2 text-sm text-gray-600 dark:text-gray-400">{step}</p>
        </div>
      ))}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const color = categoryColors[project.category] ?? '#0078D4'
  const statusColor = statusColors[project.status] ?? '#0078D4'

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/60">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {project.category}
            </span>
            {/* Status badge */}
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                borderColor: `${statusColor}40`,
                backgroundColor: `${statusColor}0D`,
                color: statusColor,
              }}
            >
              {project.status}
            </span>
          </div>
          {/* Period */}
          <span className="text-xs text-gray-400 dark:text-gray-500">{project.period}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base leading-snug font-bold text-gray-900 dark:text-gray-100">
          {project.title}
        </h3>

        {/* Company + role */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium" style={{ color }}>
            {project.company}
          </span>
          <span>·</span>
          <span>{project.role}</span>
        </div>

        {/* Impact highlight */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/40">
          <span className="text-lg font-extrabold" style={{ color }}>
            {project.impact}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">— {project.impactDetail}</span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border px-2 py-0.5 text-xs font-medium"
              style={{
                borderColor: `${color}30`,
                backgroundColor: `${color}08`,
                color: color,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expand / collapse */}
        {project.architecture && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color }}
          >
            <span>{expanded ? '▲ Hide' : '▼ View'} Architecture Flow</span>
          </button>
        )}

        {expanded && project.architecture && (
          <div className="mt-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700/50 dark:bg-gray-700/20">
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              How it works
            </p>
            <ArchitectureFlow steps={project.architecture} />
          </div>
        )}

        {/* Links */}
        {(project.href || project.github) && (
          <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4 dark:border-gray-700/50">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            )}
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color }}
              >
                View Project →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsPage({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Page header */}
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Projects
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Real-world DevOps and cloud engineering work — production systems, automation frameworks,
          and infrastructure built from scratch.
        </p>
      </div>

      <div className="pt-8 pb-16">
        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: projects.length.toString(), label: 'Total Projects' },
            {
              value: projects.filter((p) => p.status === 'Production').length.toString(),
              label: 'In Production',
            },
            { value: '3', label: 'Cloud Platforms' },
            { value: '20+', label: 'Tools Used' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-100 bg-white px-4 py-4 text-center shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60"
            >
              <div className="text-primary-500 text-2xl font-extrabold">{s.value}</div>
              <div className="mt-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            const color = categoryColors[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                style={
                  isActive && color
                    ? { backgroundColor: color, borderColor: color, color: '#fff' }
                    : isActive
                      ? { backgroundColor: '#0078D4', borderColor: '#0078D4', color: '#fff' }
                      : {
                          borderColor: 'var(--tw-border-opacity, #e5e7eb)',
                          backgroundColor: 'transparent',
                        }
                }
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-70">
                    ({projects.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Projects grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 dark:text-gray-500">
            No projects in this category yet — coming soon!
          </div>
        )}
      </div>
    </div>
  )
}
