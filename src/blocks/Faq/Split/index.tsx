'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { FaqBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { FaqAccordion } from '../FaqAccordion'

function hasLinkTarget(sl: FaqBlock['supportLine']): boolean {
  if (!sl) return false
  if (sl.type === 'custom' && sl.url) return true
  if (sl.type === 'reference' && sl.reference != null) {
    const ref = sl.reference
    if (typeof ref === 'object' && ref !== null && 'value' in ref && ref.value != null) return true
    if (typeof ref === 'number') return true
  }
  return false
}

export const SplitFaq: React.FC<FaqBlock> = ({ intro, supportLine, groups }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const showSupportLine = supportLine?.subtitle
  const asLink = showSupportLine && hasLinkTarget(supportLine)

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-16 lg:gap-32 md:items-stretch space-y-12 md:space-y-0">
          <motion.div
            className="flex min-h-0 flex-col items-start md:h-full gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full">
              {intro && (
                <div className="mb-12 text-left flex flex-col items-start w-full">
                  <div className="max-w-none md:max-w-3xl w-full">
                    <RichText
                      data={intro}
                      enableGutter={false}
                      enableProse={false}
                      disableTextAlign={true}
                      className="[&_h2]:!text-lg md:[&_h2]:type-display-lg [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h2]:!whitespace-nowrap md:[&_h2]:!whitespace-normal [&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:tracking-widest [&_h3]:uppercase [&_h3]:mb-4 [&_p]:type-title-md [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mt-6 md:[&_p]:mt-0"
                    />
                    <div className="mt-8 h-px w-24 bg-brand-500" />
                  </div>
                </div>
              )}
              {showSupportLine && (
                <p className="mt-8 w-full md:mt-10 type-body-lg text-type-secondary">
                  {asLink ? (
                    <>
                      {supportLine.subtitle}{' '}
                      <CMSLink
                        type={supportLine.type ?? 'reference'}
                        reference={supportLine.reference ?? undefined}
                        url={supportLine.url ?? undefined}
                        label={supportLine.linkLabel ?? undefined}
                        newTab={supportLine.newTab ?? undefined}
                        appearance="inline"
                        className="text-primary underline hover:no-underline"
                      />
                    </>
                  ) : (
                    supportLine.subtitle
                  )}
                </p>
              )}
            </div>

          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <FaqAccordion groups={groups} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
