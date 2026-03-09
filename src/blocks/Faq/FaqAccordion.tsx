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
            className={groupIdx > 0 ? 'mt-12 space-y-1 md:mt-8' : 'space-y-1'}
          >
            {categoryName && (
              <h3 className="type-title-lg text-type-heading pt-6 first:pt-0">
                {categoryName}
              </h3>
            )}
            {items.map((item, idx) => {
              const value = item.id != null ? String(item.id) : `faq-${categoryName}-${idx}`
              return (
                <AccordionItem key={value} value={value} className="border-border border-b">
                  <AccordionTrigger className="type-body-lg font-medium text-type-body text-left hover:no-underline [&[data-state=open]]:border-border">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.answer && (
                      <RichText
                        data={item.answer}
                        enableGutter={false}
                        className="[&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed"
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
