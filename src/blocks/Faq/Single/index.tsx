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

export const SingleFaq: React.FC<FaqBlock> = ({ intro, supportLine, groups }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const showSupportLine = supportLine?.subtitle
  const asLink = showSupportLine && hasLinkTarget(supportLine)

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-stone-50/30">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-4xl space-y-16 md:space-y-20">
          {intro && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <RichText
                data={intro}
                enableGutter={false}
                enableProse={false}
                className="[&_h2]:type-headline-2 [&_h2]:text-type-heading  [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:mb-10 [&_h3]:type-headline-3 [&_h3]:text-primary [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:mb-10 [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mx-auto"
              />
            </motion.div>
          )}
          {showSupportLine && (
            <motion.p
              className="type-body-lg text-type-secondary"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
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
            </motion.p>
          )}
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
