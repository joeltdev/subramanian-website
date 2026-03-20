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
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

type Groups = FaqBlock['groups']

const colorVariants = [
  {
    base: 'bg-blue-50 border-blue-100',
    hover: 'hover:bg-blue-100/80 hover:shadow-md',
    active: 'data-[state=open]:bg-blue-100/80 data-[state=open]:shadow-md',
    accent: 'text-blue-600',
    iconBg: 'bg-blue-200/40',
  },
  {
    base: 'bg-purple-50 border-purple-100',
    hover: 'hover:bg-purple-100/80 hover:shadow-md',
    active: 'data-[state=open]:bg-purple-100/80 data-[state=open]:shadow-md',
    accent: 'text-purple-600',
    iconBg: 'bg-purple-200/40',
  },
  {
    base: 'bg-green-50 border-green-100',
    hover: 'hover:bg-green-100/80 hover:shadow-md',
    active: 'data-[state=open]:bg-green-100/80 data-[state=open]:shadow-md',
    accent: 'text-green-600',
    iconBg: 'bg-green-200/40',
  },
  {
    base: 'bg-pink-50 border-pink-100',
    hover: 'hover:bg-pink-100/80 hover:shadow-md',
    active: 'data-[state=open]:bg-pink-100/80 data-[state=open]:shadow-md',
    accent: 'text-pink-600',
    iconBg: 'bg-pink-200/40',
  },
  {
    base: 'bg-stone-50 border-stone-200',
    hover: 'hover:bg-stone-100 hover:shadow-md',
    active: 'data-[state=open]:bg-stone-100 data-[state=open]:shadow-md',
    accent: 'text-stone-600',
    iconBg: 'bg-stone-200/40',
  },
]

export const FaqAccordion: React.FC<{ groups: Groups }> = ({ groups }) => {
  const list = groups ?? []
  if (list.length === 0) return null

  return (
    <Accordion type="multiple" className="w-full space-y-12">
      {list.map((group, groupIdx) => {
        const categoryName = group.name ?? ''
        const items = group.items ?? []
        return (
          <div
            key={group.id ?? `group-${groupIdx}`}
            className="space-y-4"
          >
            {categoryName && (
              <h3 className="type-title-md font-bold text-type-heading px-1 mb-2">
                {categoryName}
              </h3>
            )}
            <div className="flex flex-col gap-4">
              {items.map((item, idx) => {
                const value = item.id != null ? String(item.id) : `faq-${categoryName}-${idx}`
                const variant = colorVariants[(groupIdx + idx) % colorVariants.length]
                
                return (
                  <AccordionItem 
                    key={value} 
                    value={value} 
                    className={cn(
                      "border rounded-xl px-5 md:px-6 transition-all duration-300 shadow-sm group overflow-hidden",
                      variant.base,
                      variant.hover,
                      variant.active
                    )}
                  >
                    <AccordionTrigger 
                      className="type-title-md font-semibold py-5 text-type-heading text-left hover:no-underline flex justify-between items-center gap-4 group-data-[state=open]:pb-2"
                      chevron={false}
                    >
                      <span>{item.question}</span>
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                        variant.iconBg,
                        "group-data-[state=open]:bg-white/90"
                      )}>
                        <ChevronDown className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180",
                          variant.accent
                        )} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-2">
                      <div className="max-w-3xl">
                        {item.answer && (
                          <RichText
                            data={item.answer}
                            enableGutter={false}
                            className="[&_p]:type-body-md [&_p]:text-type-secondary [&_p]:leading-relaxed"
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
