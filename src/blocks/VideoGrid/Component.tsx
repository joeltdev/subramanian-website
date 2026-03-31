'use client'
import React from 'react'
import { cn } from '@/utilities/ui'
import type { VideoGridBlock as VideoGridBlockType } from '@/payload-types'
import { motion } from 'motion/react'

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

export const VideoGridBlock: React.FC<VideoGridBlockType> = ({
  title,
  description,
  videos,
}) => {
  if (!videos || videos.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        {/* 1. International Header - Left Aligned & Matching Gallery */}
        {(title || description) && (
          <div className="mb-16 md:mb-24 text-left flex flex-col items-start w-full">
            <div className="max-w-none md:max-w-3xl w-full">
              {title && (
                <h3 className="text-xl md:type-headline-1 text-type-heading tracking-tight !whitespace-nowrap md:!whitespace-normal mb-4 font-bold">
                  {title}
                </h3>
              )}
              {description && (
                <p className="type-body-lg text-type-secondary max-w-2xl mt-6 md:mt-0">
                  {description}
                </p>
              )}
              <div className="mt-8 h-px w-24 bg-brand-500" />
            </div>
          </div>
        )}

        {/* 2. Cinematic Video Layout */}
        <div className={cn(
          "grid grid-cols-1 gap-12 lg:gap-24",
          videos.length === 2 ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        )}>
          {videos.map((video, index) => {
            const src = getEmbedSrc(video.url)
            if (!src) return null

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="flex flex-col group relative"
              >
                {/* Decorative Index */}
                <span className="hidden lg:block absolute -left-12 top-0 text-zinc-700 type-display-sm font-bold select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative w-full aspect-video overflow-hidden bg-muted border border-border/40 shadow-sm transition-all duration-500 group-hover:border-brand-500/50 group-hover:shadow-2xl">
                  <iframe
                    className="absolute inset-0 h-full w-full grayscale-[0.2] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                    src={src}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                  
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>

                {video.title && (
                  <div className="mt-8">
                    <h3 className="type-title-lg font-bold text-type-heading leading-tight transition-all duration-500 group-hover:text-brand-500">
                      {video.title}
                    </h3>
                    {/* Visual spacer */}
                    <div className="w-0 h-[2px] bg-brand-500 mt-4 transition-all duration-500 group-hover:w-12" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
