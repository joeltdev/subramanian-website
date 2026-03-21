import React from 'react'
import { cn } from '@/utilities/ui'
import type { YouTubeBlock as YouTubeBlockType } from '@/payload-types'

const getYouTubeVideoId = (input: string): string | null => {
  const raw = (input || '').trim()
  if (!raw) return null

  // Try URL parsing first (handles watch/share/shorts/embed/live)
  try {
    const url = new URL(raw)
    const host = url.hostname.replace(/^www\./, '')

    // youtu.be/<id>
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id || null
    }

    if (host.endsWith('youtube.com')) {
      // youtube.com/watch?v=<id>
      const v = url.searchParams.get('v')
      if (v) return v

      // youtube.com/embed/<id>, /shorts/<id>, /live/<id>
      const parts = url.pathname.split('/').filter(Boolean)
      const idx = parts.findIndex((p) => ['embed', 'shorts', 'live'].includes(p))
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {
    // fall through to regex parsing
  }

  // Fallback: try to extract ID from common patterns in non-URL input
  const match =
    raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/) ||
    raw.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/) ||
    raw.match(/youtube\.com\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{6,})/)

  return match?.[1] ?? null
}

const getEmbedSrc = (url: string): string | null => {
  const id = getYouTubeVideoId(url)
  if (!id) return null

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params.toString()}`
}

export const YouTubeBlock: React.FC<YouTubeBlockType & { disableInnerContainer?: boolean }> = ({
  url,
  title: rawTitle,
  disableInnerContainer,
}) => {
  const src = getEmbedSrc(url)

  if (!src) return null

  // Title override as requested - normalized for smart quotes
  const oldTitleNormalized = "It's not about financial reservation, it's about social equality Unfiltered Ft K.C Subramanian !"
  const currentTitleNormalized = (rawTitle || '').replace(/’/g, "'")
  const title = currentTitleNormalized === oldTitleNormalized ? 'Social Equality Matters' : rawTitle

  return (
    <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-background">
      <div className={cn(!disableInnerContainer && 'mx-auto max-w-7xl px-6 md:px-8')}>
        {title && (
          <div className="text-center mb-10 md:mb-16">
            <span className="type-label-lg text-primary uppercase tracking-widest mb-4 block font-semibold">
              Featured Conversation
            </span>
            <h2 className="type-headline-2 text-type-heading max-w-4xl mx-auto leading-tight">
              {title}
            </h2>
          </div>
        )}
        <div className="mx-auto max-w-4xl w-full">
          <div className="relative w-full aspect-video overflow-hidden rounded-none border border-border bg-muted shadow-2xl">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={src}
              title={title || 'YouTube video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}

