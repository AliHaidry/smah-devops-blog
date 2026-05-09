import projectsData from '@/data/projectsData'
import ProjectsPage from '@/components/ProjectsPage'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Projects',
  description:
    'Real-world DevOps and cloud engineering projects by Ali Haidry — observability stacks, CI/CD pipelines, infrastructure automation and more.',
})

export default function Projects() {
  return <ProjectsPage projects={projectsData} />
}
