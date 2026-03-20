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
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    hover: 'hover:bg-blue-100/50 hover:border-blue-200',
    active: 'data-[state=open]:bg-blue-100/40 data-[state=open]:border-blue-200',
    iconBg: 'bg-blue-100/50',
    iconText: 'text-blue-600',
  },
  {
    bg: 'bg-purple-50/50',
    border: 'border-purple-100',
    hover: 'hover:bg-purple-100/50 hover:border-purple-200',
    active: 'data-[state=open]:bg-purple-100/40 data-[state=open]:border-purple-200',
    iconBg: 'bg-purple-100/50',
    iconText: 'text-purple-600',
  },
  {
    bg: 'bg-green-50/50',
    border: 'border-green-100',
    hover: 'hover:bg-green-100/50 hover:border-green-200',
    active: 'data-[state=open]:bg-green-100/40 data-[state=open]:border-green-200',
    iconBg: 'bg-green-100/50',
    iconText: 'text-green-600',
  },
  {
    bg: 'bg-pink-50/50',
    border: 'border-pink-100',
    hover: 'hover:bg-pink-100/50 hover:border-pink-200',
    active: 'data-[state=open]:bg-pink-100/40 data-[state=open]:border-pink-200',
    iconBg: 'bg-pink-100/50',
    iconText: 'text-pink-600',
  },
  {
    bg: 'bg-stone-50/60',
    border: 'border-stone-200',
    hover: 'hover:bg-stone-100 hover:border-stone-300',
    active: 'data-[state=open]:bg-stone-100 data-[state=open]:border-stone-300',
    iconBg: 'bg-stone-200/50',
    iconText: 'text-stone-600',
  },
]

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
              <h3 className="type-title-lg font-bold text-type-heading px-2">
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
                      "border rounded-2xl px-6 md:px-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 shadow-sm group",
                      variant.bg,
                      variant.border,
                      variant.hover,
                      variant.active
                    )}
                  >
                    <AccordionTrigger 
                      className="type-title-md md:type-title-lg font-semibold py-6 text-type-heading text-left hover:no-underline flex justify-between items-center gap-6"
                      chevron={false}
                    >
                      <span>{item.question}</span>
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                        variant.iconBg,
                        "group-data-[state=open]:bg-white/80"
                      )}>
                        <ChevronDown className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180",
                          variant.iconText
                        )} />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pt-0">
                      <div className="max-w-3xl">
                        {item.answer && (
                          <RichText
                            data={item.answer}
                            enableGutter={false}
                            className="[&_p]:type-body-lg [&_p]:text-type-secondary [&_p]:leading-relaxed"
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
