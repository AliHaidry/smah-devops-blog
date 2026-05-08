'use client'

import { ReactNode, useState } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const skillCategories = [
  {
    label: 'Cloud Platforms & IaC',
    color: '#0078D4',
    skills: ['Azure', 'AWS', 'GCP', 'Terraform', 'Azure Bicep', 'CloudFormation'],
  },
  {
    label: 'Containers & Orchestration',
    color: '#326CE5',
    skills: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'GitOps', 'Ansible'],
  },
  {
    label: 'CI/CD & Automation',
    color: '#E44C30',
    skills: ['Jenkins', 'GitHub Actions', 'Azure DevOps', 'GitLab CI', 'Bitbucket', 'PowerShell'],
  },
  {
    label: 'Observability & Reporting',
    color: '#F46800',
    skills: ['Prometheus', 'Grafana', 'Loki', 'Datadog', 'ELK Stack', 'PowerBI'],
  },
  {
    label: 'Scripting & Databases',
    color: '#3776AB',
    skills: ['Python', 'Shell', 'YAML', 'PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    label: 'Infrastructure & Virtualization',
    color: '#6B21A8',
    skills: ['Hyper-V', 'VMware', 'Linux (RHEL/Debian)', 'Kafka', 'Fluent Bit', 'ServiceNow'],
  },
]

const certifications = [
  {
    name: 'AZ-305',
    full: 'Azure Solutions Architect Expert',
    issuer: 'Microsoft',
    color: '#0078D4',
    icon: '🏆',
  },
  {
    name: 'AZ-104',
    full: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    color: '#0078D4',
    icon: '⚙️',
  },
  {
    name: 'AI-102',
    full: 'Azure AI Engineer Associate',
    issuer: 'Microsoft',
    color: '#0078D4',
    icon: '🤖',
  },
  {
    name: 'AI-900',
    full: 'Azure AI Fundamentals',
    issuer: 'Microsoft',
    color: '#0078D4',
    icon: '🧠',
  },
  {
    name: 'AZ-900',
    full: 'Azure Fundamentals',
    issuer: 'Microsoft',
    color: '#0078D4',
    icon: '☁️',
  },
  {
    name: 'CLF-C02',
    full: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    color: '#FF9900',
    icon: '🌩️',
  },
]

const experience = [
  {
    role: 'Senior DevOps Engineer',
    company: 'Curve Digital Solutions',
    period: 'Aug 2025 – Present',
    location: 'Karachi, PK',
    highlights: [
      'Architecting and designing cloud-based infrastructure and solutions for the Unified Marketing Platform',
      'Consolidated end-to-end log aggregation pipeline (Prometheus, Fluent Bit, Kafka, Promtail, Loki) rendered in Grafana — 100% ops satisfaction',
      'Automated Windows Server 2022 Hyper-V lifecycle (DHCP, NAT, DNS, WinRM, Firewall) via PowerShell, significantly reducing provisioning time',
      'Developed complete VM lifecycle automation for Hyper-V: image creation, suspend/resume, deletion, and user management',
    ],
    current: true,
  },
  {
    role: 'DevOps Engineer',
    company: 'Curve Digital Solutions',
    period: 'Aug 2024 – Jul 2025',
    location: 'Karachi, PK',
    highlights: [
      'Developed Python scripts to automate processes and execute Ansible playbooks with MySQL integration',
      'Set up Jenkins pipelines integrated with GitHub and Docker Hub, improving release frequency by 25%',
      'Managed 10+ server production infrastructure, contributing to a 10% improvement in system response times',
      'Trained and mentored 5+ new team members, improving team productivity and collaboration',
    ],
    current: false,
  },
  {
    role: 'IT Ops Specialist',
    company: 'TD Bank Group',
    period: 'Feb 2022 – May 2024',
    location: 'Toronto, CA',
    highlights: [
      'Led Azure Sandbox environment deployment, enabling LOBs to experiment with POCs at 100% success rate',
      'Implemented telemetry dashboards for Azure VMs, App Services & ML Workspaces — 40% increase in infrastructure sustainability',
      'Developed FinOps framework on Azure reducing $1,200 USD/month in Azure Learning Box costs',
      'Drove a 30% improvement in business unit performance through process optimisation and automation',
    ],
    current: false,
  },
  {
    role: 'Intern DevOps Engineer',
    company: 'mobileLIVE',
    period: 'Jan 2020 – Sep 2020',
    location: 'Toronto, CA',
    highlights: [
      'Implemented CI/CD pipeline on AWS (Elastic Beanstalk, CodeDeploy, CodePipeline) — 25% improvement in deployment efficiency',
      'Developed foundational Terraform modules for AWS infrastructure, reducing manual workload by 40%',
      'Deployed containerised applications on GCP via Kubernetes & Helm, increasing deployment speed by 70%',
    ],
    current: false,
  },
]

const education = [
  {
    degree: 'Master of Engineering',
    field: 'Software Systems Engineering',
    school: 'University of Regina',
    location: 'Canada',
    period: '2019 – 2021',
    icon: '🎓',
  },
  {
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    school: 'Bahria University',
    location: 'Pakistan',
    period: '2013 – 2017',
    icon: '🎓',
  },
]

const stats = [
  { value: '5+', label: 'Years in IT' },
  { value: '13+', label: 'Blog Posts' },
  { value: '6', label: 'Cloud Certs' },
  { value: '4', label: 'Companies' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatsBanner() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-gray-100 bg-white px-4 py-5 text-center shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60"
        >
          <div className="text-primary-500 text-2xl font-extrabold">{s.value}</div>
          <div className="mt-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {children}
      </h2>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>
  )
}

function SkillPill({ skill, color }: { skill: string; color: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      className="cursor-default rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-150"
      style={{
        borderColor: hovered ? color : `${color}40`,
        backgroundColor: hovered ? color : `${color}0D`,
        color: hovered ? 'white' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {skill}
    </span>
  )
}

function SkillsSection() {
  return (
    <section>
      <SectionHeading>Skills & Tech Stack</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {skillCategories.map((cat) => (
          <div
            key={cat.label}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {cat.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <SkillPill key={skill} skill={skill} color={cat.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CertificationsSection() {
  return (
    <section>
      <SectionHeading>Certifications</SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700/50 dark:bg-gray-800/60"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-xl"
              style={{ backgroundColor: cert.color }}
            />
            <div className="mt-1 flex items-start justify-between">
              <span className="text-2xl">{cert.icon}</span>
              {cert.name === 'AZ-305' && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: cert.color }}
                >
                  Expert
                </span>
              )}
            </div>
            <div
              className="mt-2 text-lg font-extrabold tracking-tight"
              style={{ color: cert.color }}
            >
              {cert.name}
            </div>
            <div className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              {cert.full}
            </div>
            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{cert.issuer}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section>
      <SectionHeading>Work Experience</SectionHeading>
      <div className="relative">
        <div className="absolute top-2 bottom-2 left-3 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-8">
          {experience.map((job, idx) => (
            <div key={idx} className="relative flex gap-6">
              <div className="relative flex-shrink-0">
                <div
                  className={`mt-1 h-6 w-6 rounded-full border-2 border-white shadow-sm dark:border-gray-900 ${
                    job.current ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                {job.current && (
                  <span className="bg-primary-500/30 absolute inset-0 animate-ping rounded-full" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{job.role}</h3>
                    <div className="mt-0.5 flex items-center gap-2 text-sm">
                      <span className="text-primary-500 font-semibold">{job.company}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-gray-500 dark:text-gray-400">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {job.current && (
                      <span className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full px-2 py-0.5 text-xs font-semibold">
                        Current
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {job.period}
                    </span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {job.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-primary-400 mt-0.5 flex-shrink-0">▸</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EducationSection() {
  return (
    <section>
      <SectionHeading>Education</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60"
          >
            <div className="mb-2 text-2xl">{edu.icon}</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{edu.degree}</div>
            <div className="text-primary-500 mt-0.5 text-sm font-semibold">{edu.field}</div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{edu.school}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">{edu.location}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                {edu.period}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function GitHubSection({ github }: { github?: string }) {
  const username = github?.split('/').pop() ?? 'AliHaidry'
  const grid = Array.from({ length: 182 }, (_, i) => {
    const seed = ((i * 2654435761) >>> 0) % 100
    return seed > 85 ? 4 : seed > 65 ? 3 : seed > 45 ? 2 : seed > 25 ? 1 : 0
  })
  const colors = [
    'bg-gray-100 dark:bg-gray-700/40',
    'bg-primary-100 dark:bg-primary-900/40',
    'bg-primary-200 dark:bg-primary-700/60',
    'bg-primary-400 dark:bg-primary-500/80',
    'bg-primary-500 dark:bg-primary-400',
  ]

  return (
    <section>
      <SectionHeading>Open Source & GitHub</SectionHeading>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current text-gray-700 dark:text-gray-300"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {username}
            </span>
          </div>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-medium"
            >
              View Profile →
            </a>
          )}
        </div>
        <div className="px-5 py-4">
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Contribution activity — last 26 weeks
          </p>
          <div className="grid grid-flow-col grid-rows-7 gap-0.5 overflow-x-auto">
            {grid.map((level, i) => (
              <div key={i} className={`h-2.5 w-2.5 rounded-sm ${colors[level]}`} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 dark:divide-gray-700/50 dark:border-gray-700/50">
          {[
            { label: 'Public Repos', value: '18' },
            { label: 'Blog Posts', value: '13' },
            { label: 'Stars Earned', value: '42' },
          ].map((item) => (
            <div key={item.label} className="px-4 py-3 text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection({ email }: { email?: string }) {
  const [form, setForm] = useState({ name: '', userEmail: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('sent')
  }

  return (
    <section>
      <SectionHeading>Get in Touch</SectionHeading>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700/50 dark:bg-gray-800/60">
        <div className="grid lg:grid-cols-5">
          <div className="bg-primary-500 flex flex-col justify-between p-6 lg:col-span-2">
            <div>
              <h3 className="text-lg font-bold text-white">Let's talk DevOps</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Have a question about an article, want to collaborate, or just want to chat about
                cloud architecture? My inbox is open.
              </p>
            </div>
            <div className="mt-8 space-y-3 text-sm text-white/90">
              {email && (
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <a
                    href={`mailto:${email}`}
                    className="underline-offset-2 hover:text-white hover:underline"
                  >
                    {email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span>Typically replies within 24 hours</span>
              </div>
            </div>
          </div>
          <div className="p-6 lg:col-span-3">
            {status === 'sent' ? (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <div className="text-primary-500 mb-3 text-4xl">✓</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Message sent!</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle')
                    setForm({ name: '', userEmail: '', message: '' })
                  }}
                  className="text-primary-500 mt-4 text-sm underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="focus:border-primary-400 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition outline-none focus:bg-white focus:ring-2 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:focus:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.userEmail}
                      onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
                      placeholder="you@example.com"
                      className="focus:border-primary-400 focus:ring-primary-100 dark:focus:border-primary-500 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition outline-none focus:bg-white focus:ring-2 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:focus:bg-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me what's on your mind..."
                    className="focus:border-primary-400 focus:ring-primary-100 dark:focus:border-primary-500 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition outline-none focus:bg-white focus:ring-2 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:focus:bg-gray-700"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending…
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          About
        </h1>
      </div>

      <div className="pt-10 pb-16">
        {/* Hero */}
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          {avatar && (
            <div className="relative flex-shrink-0">
              <Image
                src={avatar}
                alt={name ?? 'avatar'}
                width={160}
                height={160}
                className="ring-primary-400/30 h-36 w-36 rounded-2xl object-cover ring-4 shadow-lg sm:h-40 sm:w-40"
              />
              <span className="bg-primary-500 absolute right-2 bottom-2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
              {name}
            </h2>
            <p className="text-primary-500 mt-1 font-semibold">{occupation}</p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{company}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Azure', 'Kubernetes', 'Terraform', 'CI/CD', 'Observability'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700/60 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <SocialIcon kind="mail" href={`mailto:${email}`} size={5} />
              <SocialIcon kind="github" href={github} size={5} />
              <SocialIcon kind="linkedin" href={linkedin} size={5} />
              <SocialIcon kind="x" href={twitter} size={5} />
              {bluesky && <SocialIcon kind="bluesky" href={bluesky} size={5} />}
            </div>
          </div>
        </div>

        <StatsBanner />

        <div className="prose dark:prose-invert mt-10 max-w-none">{children}</div>

        <div className="mt-12 space-y-14">
          <SkillsSection />
          <CertificationsSection />
          <ExperienceSection />
          <EducationSection />
          <GitHubSection github={github} />
          <ContactSection email={email} />
        </div>
      </div>
    </div>
  )
}
