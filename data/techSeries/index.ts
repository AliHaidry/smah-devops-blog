import { Series } from './types'
import phase1 from './phase1'
import phase2 from './phase2'
import phase3 from './phase3'
import phase4 from './phase4'
import phase5 from './phase5'
import phase6 from './phase6'

export * from './types'

export const techSeries: Series[] = [
  {
    slug: 'paktech-chat',
    title: 'PakTech Chat',
    subtitle: 'DevSecOps on Azure Kubernetes',
    description:
      'A real-time chat app taken from local development to a hardened Azure platform: infrastructure as code, GitOps delivery, a secured CI/CD pipeline, runtime security and observability. Built and run for real, with the problems left in. The lab cluster was decommissioned in November 2026 and can be rebuilt from Terraform and GitOps.',
    status: 'Complete · 6 of 6 phases',
    updated: 'Nov 2026',
    cloud: 'Microsoft Azure',
    environments: 3,
    stack: [
      'Azure AKS',
      'Terraform',
      'Argo CD',
      'GitHub Actions',
      'Trivy',
      'OPA Gatekeeper',
      'Falco',
      'Prometheus',
      'Grafana',
      'Docker',
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'Redis',
    ],
    categories: ['Azure', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Observability'],
    blogPost: '/blog/paktech-chat-devsecops-aks',
    repos: [
      {
        label: 'Application, Terraform and CI',
        href: 'https://github.com/PakTechLimited/app-paktech-chat',
      },
      {
        label: 'GitOps configuration and Helm chart',
        href: 'https://github.com/PakTechLimited/gitops-paktech-chat',
      },
    ],
    before: [
      {
        title: 'What you will build',
        items: [
          'A chat app that runs locally and on Azure',
          'The platform as code, deployed from Git',
          'A pipeline with security gates',
          'A cluster that limits what an intruder can do',
        ],
      },
      {
        title: 'Prerequisites',
        items: [
          'An Azure subscription',
          'Git and a GitHub account',
          'Basic Docker and Kubernetes',
          'A terminal you are comfortable in',
        ],
      },
      {
        title: 'How to follow along',
        items: [
          'Read the phases in order',
          'Run the commands in a dev environment first',
          'Check the Issues block before you start',
          'Code lives in the two repositories linked below',
        ],
      },
    ],
    phases: [phase1, phase2, phase3, phase4, phase5, phase6],
  },
]

export const upcomingSeries = [
  {
    title: '[Next series title]',
    text: '[One line about the next big project. It gets its own phase-by-phase pages here.]',
  },
]

export const getSeries = (slug: string) => techSeries.find((s) => s.slug === slug)
