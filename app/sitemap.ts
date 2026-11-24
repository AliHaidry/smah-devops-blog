import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { techSeries } from '@/data/techSeries'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags', 'tech-series'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const seriesRoutes = techSeries
    .flatMap((s) => [
      `${siteUrl}/tech-series/${s.slug}`,
      ...s.phases.map((p) => `${siteUrl}/tech-series/${s.slug}/${p.slug}`),
    ])
    .map((url) => ({ url, lastModified: new Date().toISOString().split('T')[0] }))

  return [...routes, ...seriesRoutes, ...blogRoutes]
}
