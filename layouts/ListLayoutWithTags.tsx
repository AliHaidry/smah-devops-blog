'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Image from 'next/image'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="pt-6 pb-6">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {title}
        </h1>
      </div>

      {/* Tags row — horizontal scrollable strip across the top */}
      <div className="mb-8 flex flex-wrap gap-2">
        {pathname.startsWith('/blog') ? (
          <span className="rounded-full bg-primary-500 px-4 py-1.5 text-sm font-bold text-white uppercase">
            All Posts
          </span>
        ) : (
          <Link
            href="/blog"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 uppercase hover:border-primary-500 hover:text-primary-500 dark:border-gray-600 dark:text-gray-300"
          >
            All Posts
          </Link>
        )}
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${slug(t)}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium uppercase transition-colors ${
              decodeURI(pathname.split('/tags/')[1]) === slug(t)
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-500 dark:border-gray-600 dark:text-gray-300'
            }`}
            aria-label={`View posts tagged ${t}`}
          >
            {t} ({tagCounts[t]})
          </Link>
        ))}
      </div>

      {/* Card grid */}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {displayPosts.map((post) => {
          const { path, date, title, summary, tags, images } = post
          return (
            <li key={path}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                {images?.[0] ? (
                  <Link href={`/${path}`} aria-label={`Read "${title}"`}>
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={images[0]}
                        alt={title}
                        fill
                        className="object-cover object-top transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="h-52 w-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-700" />
                )}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {tags?.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <h2 className="mb-2 text-xl font-bold leading-snug tracking-tight">
                      <Link
                        href={`/${path}`}
                        className="text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                      >
                        {title}
                      </Link>
                    </h2>
                    <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {summary}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <time
                      dateTime={date}
                      suppressHydrationWarning
                      className="text-xs text-gray-400 dark:text-gray-500"
                    >
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                    <Link
                      href={`/${path}`}
                      className="text-xs font-medium text-primary-500 hover:text-primary-600"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
