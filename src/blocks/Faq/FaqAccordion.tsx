'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RichText from '@/components/RichText'
import type { FaqBlock } from '@/payload-types'

type Groups = FaqBlock['groups']

export const FaqAccordion: React.FC<{ groups: Groups }> = ({ groups }) => {
  const list = groups ?? []
  if (list.length === 0) return null

  return (
    <Accordion type="multiple" className="w-full">
      {list.map((group, groupIdx) => {
        const categoryName = group.name ?? ''
        const items = group.items ?? []
        return (
          <div
            key={group.id ?? `group-${groupIdx}`}
            className={groupIdx > 0 ? 'mt-16 space-y-2 md:mt-20' : 'space-y-2'}
          >
            {categoryName && (
              <h3 className="type-headline-4 text-type-heading pt-10 pb-4 first:pt-0">
                {categoryName}
              </h3>
            )}
            {items.map((item, idx) => {
              const value = item.id != null ? String(item.id) : `faq-${categoryName}-${idx}`
              return (
                <AccordionItem key={value} value={value} className="border-border border-b">
                  <AccordionTrigger className="type-title-lg font-semibold py-6 text-type-body text-left hover:no-underline [&[data-state=open]]:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    {item.answer && (
                      <RichText
                        data={item.answer}
                        enableGutter={false}
                        className="[&_p]:type-body-lg [&_p]:text-type-secondary [&_p]:leading-relaxed"
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </div>
        )
      })}
    </Accordion>
  )
}
