'use client'
import React, { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BorderBeam } from '@/components/ui/border-beam'
import type { FeatureBentoBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'

export const AccordionFeatureBento: React.FC<FeatureBentoBlock> = ({
  intro,
  accordionItems,
}) => {
  const items = accordionItems ?? []
  const firstId = items[0]?.id ?? 'item-0'
  const [activeItem, setActiveItem] = useState<string>(firstId)

  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const isContentInView = useInView(contentRef, { once: true, margin: '-5% 0px' })

  const activeData = items.find((item) => item.id === activeItem) ?? items[0]

  return (
    <section ref={sectionRef} className="py-4 md:py-8">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <motion.div
          className="relative z-10 mx-auto max-w-2xl space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {intro && <RichText data={intro} enableGutter={false} className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:leading-[1.1] [&_h2]:mb-6 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-4 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}
        </motion.div>

        <div ref={contentRef} className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value)}
            className="w-full"
          >
            {items.map((item) => {
              const Icon = item.icon ? iconMap[item.icon] : null
              return (
                <AccordionItem key={item.id} value={item.id ?? ''}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 type-body-md text-type-body">
                      {Icon && <Icon className="size-4 text-slate-500" />}
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.richText && (
                      <RichText data={item.richText} enableGutter={false} className="[&_p]:type-body-sm [&_p]:text-type-secondary [&_p]:leading-relaxed [&_h3]:type-title-sm [&_h3]:text-type-secondary" />
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          </motion.div>

          <motion.div
            className="bg-background relative flex overflow-hidden rounded-none border p-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isContentInView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]" />
            <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-none">
              <AnimatePresence mode="wait">
                {typeof activeData?.image === 'object' && activeData?.image && (
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="size-full overflow-hidden rounded-none border bg-background shadow-md"
                  >
                    <Media
                      resource={activeData.image}
                      imgClassName="size-full object-cover object-left-top dark:mix-blend-lighten"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
