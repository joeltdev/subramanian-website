'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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

  const activeData = items.find((item) => item.id === activeItem) ?? items[0]

  return (
    <section className="py-12 md:py-20 lg:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          {intro && <RichText data={intro} enableGutter={false} />}
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
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
                    <div className="flex items-center gap-2 text-base">
                      {Icon && <Icon className="size-4" />}
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.description && (
                      <RichText data={item.description} enableGutter={false} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
            <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]" />
            <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
              <AnimatePresence mode="wait">
                {typeof activeData?.image === 'object' && activeData?.image && (
                  <motion.div
                    key={activeItem}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
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
          </div>
        </div>
      </div>
    </section>
  )
}
