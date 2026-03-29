'use client'
import React from 'react'
import type { PromoHeroBlock as T } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export const PromoHeroBlock: React.FC<T> = ({ intro, links }) => {
  return (
    <section className="flex min-h-[85svh] flex-col justify-end pb-20 pt-24 md:min-h-0 md:justify-center md:py-32 bg-background overflow-hidden relative border-t border-border/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Content with Semantic Type Scale */}
          {intro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <RichText
                data={intro}
                enableGutter={false}
                className="[&_h1]:type-headline-1 [&_h1]:text-type-heading [&_p]:type-body-lg md:[&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:mt-8 [&_p]:mx-auto [&_p]:max-w-3xl [&_h1]:break-words"
              />
            </motion.div>
          )}

          {/* CTA Buttons - Independent Responsive Design */}
          {links && links.length > 0 && (
            <motion.div 
              className="mt-16 w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 md:gap-6 w-full">
                {links.map(({ link }, i) => (
                  <CMSLink 
                    key={i} 
                    {...link} 
                    size="lg"
                    className="
                      /* Shared */
                      group flex-1 justify-center rounded-full uppercase font-bold tracking-widest transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] border-none bg-brand-100 text-brand-700 hover:bg-brand-500 hover:text-white
                      
                      /* Mobile: Medium Height, Larger Font */
                      w-full h-[48px] px-8 type-title-md
                      
                      /* Tablet (md): Refined Height */
                      md:h-[56px] md:min-w-[220px]
                      
                      /* Laptop (lg): Standard Height, Smaller Font */
                      lg:h-[52px] lg:min-w-[260px] lg:type-title-sm
                    "
                  >
                     <ArrowRight className="transition-transform group-hover:translate-x-1.5 shrink-0 ml-3 size-5 lg:size-4" />
                  </CMSLink>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full pointer-events-none overflow-hidden opacity-5">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500 rounded-full blur-[150px] -translate-y-1/2" />
      </div>
    </section>
  )
}
