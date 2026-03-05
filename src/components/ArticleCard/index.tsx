import type { Post, ArticleGridBlock as ArticleGridBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Media } from '@/components/Media'

export const ArticleCard: React.FC<{ post: Post }> = ({ post }) => {
  const { title, slug, heroImage, meta, publishedAt, populatedAuthors } = post
  const description = meta?.description
  const author = populatedAuthors?.[0]
  const href = `/posts/${slug}`

  const formattedDate = publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
      new Date(publishedAt),
    )
    : null

  const initials = author?.name
    ? author.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : null

  return (
    <article className="ring-border bg-background text-foreground rounded-xl ring-1 group relative row-span-5 grid grid-rows-subgrid gap-3 p-6 shadow-xs">
      <div className="-mx-6 -mt-6 aspect-video overflow-hidden">
        {heroImage && typeof heroImage === 'object' ? (
          <Media
            resource={heroImage}
            imgClassName="h-full w-full object-cover  rounded-t-xl"
            size="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      {formattedDate && (
        <time className="text-muted-foreground type-body-sm" dateTime={publishedAt ?? undefined}>
          {formattedDate}
        </time>
      )}

      <h2 className="text-foreground type-title-lg">
        <Link className="before:absolute before:inset-0 hover:text-primary" href={href}>
          {title}
        </Link>
      </h2>

      {description && <p className="text-muted-foreground type-body-sm line-clamp-2">{description}</p>}

      <div className="grid grid-cols-[1fr_auto] items-end gap-2 pt-4">
        {author && (
          <div className="space-y-2">
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
              <div className="ring-border bg-muted aspect-square size-6 overflow-hidden rounded-none ring-1 flex items-center justify-center">
                <span className="text-[9px] font-semibold text-muted-foreground leading-none">
                  {initials}
                </span>
              </div>
              <span className="text-muted-foreground line-clamp-1 type-body-sm">{author.name}</span>
            </div>
          </div>
        )}

        <div className="flex h-6 items-center">
          <span className="text-primary group-hover:text-foreground flex items-center gap-1 type-body-sm transition-colors duration-200">
            Read
            <ChevronRight
              className="size-3.5 translate-y-px duration-200 group-hover:translate-x-0.5"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  )
}
