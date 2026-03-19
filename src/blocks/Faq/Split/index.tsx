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
                <RichText
                  data={intro}
                  enableGutter={false}
                  className="text-left [&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:text-left [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:text-left [&_p]:mt-8"
                />
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
