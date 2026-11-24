import SeriesIndex from '@/components/techseries/SeriesIndex'
import { techSeries, upcomingSeries } from '@/data/techSeries'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tech Series',
  description:
    'Big DevOps projects taken apart into guided phases: goal, commands, workflow, issues met and trade-offs. Starting with PakTech Chat, DevSecOps on Azure Kubernetes.',
})

export default function TechSeriesPage() {
  return <SeriesIndex series={techSeries} upcoming={upcomingSeries} />
}
