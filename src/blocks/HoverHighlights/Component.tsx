'use client'

import React, { useState } from 'react'
import type { HoverHighlightsBlock as HoverHighlightsBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { ArrowRight } from 'lucide-react'

export const HoverHighlightsBlock: React.FC<HoverHighlightsBlockType & { disableInnerContainer?: boolean }> = ({
  beforeHighlights,
  highlights,
  afterHighlights,
  links,
}) => {
  const [active, setActive] = useState(0)

  return (
    <section className="">
      <div className="mx-auto max-w-7xl py-4 md:py-24 relative">
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden rounded-3xl -z-10">
          {Array.isArray(highlights) &&
            highlights.map(({ id, mediaTop, mediaBottom }, i) => {
              const isActive = i === active
              return (
                <div
                  key={id ?? i}
                  className={[
                    'absolute inset-0 flex flex-col gap-4 transition-all duration-700',
                    isActive
                      ? 'translate-y-0 opacity-100'
                      : i < active
                        ? '-translate-y-24 pointer-events-none opacity-0'
                        : 'translate-y-24 pointer-events-none opacity-0',
                  ].join(' ')}
                >
                  {typeof mediaBottom === 'object' && mediaBottom && (
                    <div className="w-full self-end overflow-hidden rounded-none shadow-lg opacity-80">
                      <Media
                        resource={mediaBottom}
                        imgClassName="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          <div className="absolute pointer-events-none left-0 bottom-0 w-full h-full bg-linear-to-t from-black/30 to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8 px-16" data-theme="dark">

          {/* Left: text content */}
          <div className="flex flex-col justify-center gap-6 md:col-span-6 md:gap-8">
            {beforeHighlights && (
              <p className="type-body-xl text-type-body">{beforeHighlights}</p>
            )}

            <div className="flex flex-col gap-2 md:gap-3">
              {Array.isArray(highlights) &&
                highlights.map(({ id, text, link, mediaTop, mediaBottom }, i) => {
                  const isActive = i === active
                  const lineClass = [
                    'flex cursor-pointer items-center gap-3 type-headline-2 transition-all duration-700 md:gap-4',
                    isActive ? 'opacity-100 text-type-heading' : 'opacity-50 text-type-heading hover:opacity-70',
                  ].join(' ')
                  const arrowClass = [
                    'size-7 shrink-0 transition-all duration-500 md:size-9',
                    isActive ? 'translate-x-0 opacity-50' : '-translate-x-2 opacity-0',
                  ].join(' ')
                  const inner = (
                    <>
                      <span>{text}</span>
                      <ArrowRight className={arrowClass} />
                    </>
                  )
                  const hasLink = link?.url || link?.reference

                  return (
                    <div key={id ?? i} onMouseEnter={() => setActive(i)}>
                      {hasLink ? (
                        <CMSLink {...(link as Parameters<typeof CMSLink>[0])} className={lineClass}>
                          {inner}
                        </CMSLink>
                      ) : (
                        <div className={lineClass}>{inner}</div>
                      )}
                    </div>
                  )
                })}
            </div>

            {afterHighlights && (
              <p className="type-body-xl text-type-secondary">{afterHighlights}</p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} size="lg" {...link} />
                ))}
              </div>
            )}
          </div>

          {/* Right: images (one set per highlight, overlaid) */}
          <div className="relative hidden min-h-[420px] md:col-span-6 md:block">
            {Array.isArray(highlights) &&
              highlights.map(({ id, mediaTop, mediaBottom }, i) => {
                const isActive = i === active
                return (
                  <div
                    key={id ?? i}
                    className={[
                      'absolute inset-0 flex flex-col gap-4 transition-all duration-900',
                      isActive
                        ? 'translate-y-0 opacity-100'
                        : i < active
                          ? 'translate-y-8 pointer-events-none opacity-0'
                          : '-translate-y-8 pointer-events-none opacity-0',
                    ].join(' ')}
                  >
                    {typeof mediaTop === 'object' && mediaTop && (
                      <div className="w-full self-start overflow-hidden rounded-none shadow-lg">
                        <Media
                          resource={mediaTop}
                          imgClassName="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-auto object-contain"
                        />
                      </div>
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
