import React from 'react'
import { cn } from '@/utilities/ui'
import type { VideoGridBlock as VideoGridBlockType } from '@/payload-types'

const getYouTubeVideoId = (input: string): string | null => {
  const raw = (input || '').trim()
  if (!raw) return null

  try {
    const url = new URL(raw)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id || null
    }

    if (host.endsWith('youtube.com')) {
      const v = url.searchParams.get('v')
      if (v) return v

      const parts = url.pathname.split('/').filter(Boolean)
      const idx = parts.findIndex((p) => ['embed', 'shorts', 'live'].includes(p))
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {
    // fall through
  }

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

export const VideoGridBlock: React.FC<VideoGridBlockType & { disableInnerContainer?: boolean }> = ({
  title,
  description,
  videos,
}) => {
  if (!videos || videos.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className={cn('mx-auto max-w-7xl px-6 md:px-8')}>
        {(title || description) && (
          <div className="mb-16 md:mb-20 text-left flex flex-col items-start w-full">
            <div className="max-w-none md:max-w-3xl w-full">
              {title && (
                <h2 className="type-display-lg text-type-heading tracking-tight mb-4">
                  {title}
                </h2>
              )}
              {description && (
                <p className="type-title-md text-type-secondary max-w-2xl mt-6 md:mt-0">
                  {description}
                </p>
              )}
              <div className="mt-8 h-px w-24 bg-brand-500" />
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {videos.map((video, index) => {
              const src = getEmbedSrc(video.url)
              if (!src) return null

              return (
                <div key={index} className="flex flex-col group">
                  <div className="relative w-full aspect-video overflow-hidden border border-border bg-muted mb-6 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={src}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  {video.title && (
                    <h3 className="type-title-md font-bold text-type-heading leading-tight group-hover:text-primary transition-colors text-center md:text-left">
                      {video.title}
                    </h3>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
