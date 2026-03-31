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
import { Plus } from 'lucide-react'

type Groups = FaqBlock['groups']

export const FaqAccordion: React.FC<{ groups: Groups }> = ({ groups }) => {
  const list = groups ?? []
  if (list.length === 0) return null

  return (
    <Accordion type="multiple" className="w-full space-y-16">
      {list.map((group, groupIdx) => {
        const categoryName = group.name ?? ''
        const items = group.items ?? []
        return (
          <div
            key={group.id ?? `group-${groupIdx}`}
            className="space-y-8"
          >
            {categoryName && (
              <div className="flex items-center gap-4 px-1">
                <div className="h-px w-8 bg-brand-500" />
                <h3 className="type-headline-1 text-type-heading uppercase tracking-widest">
                  {categoryName}
                </h3>
              </div>
            )}
            <div className="flex flex-col border-t border-border/40">
              {items.map((item, idx) => {
                const value = item.id != null ? String(item.id) : `faq-${categoryName}-${idx}`
                
                return (
                  <AccordionItem 
                    key={value} 
                    value={value} 
                    className="border-b border-border/40 group overflow-hidden transition-colors hover:bg-stone-50/50"
                  >
                    <AccordionTrigger 
                      className="type-title-lg font-bold py-8 text-type-heading text-left hover:no-underline flex justify-between items-center gap-8 transition-all"
                      chevron={false}
                    >
                      <span className="max-w-2xl">{item.question}</span>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-border/60 transition-all group-data-[state=open]:rotate-45 group-data-[state=open]:bg-brand-500 group-data-[state=open]:text-white group-data-[state=open]:border-brand-500">
                        <Plus className="w-5 h-5 shrink-0" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-10 pt-0">
                      <div className="max-w-3xl pl-0 pr-12">
                        {item.answer && (
                          <RichText
                            data={item.answer}
                            enableGutter={false}
                            className="[&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:leading-relaxed"
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </div>
          </div>
        )
      })}
    </Accordion>
  )
}
