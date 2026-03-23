'use client'
import React from 'react'
import type { PromoHeroBlock as T } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export const PromoHeroBlock: React.FC<T> = ({ intro, links }) => {
  return (
    <section className="py-24 md:py-40 bg-background overflow-hidden relative border-t border-border/10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
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
                className="[&_h1]:type-display [&_h1]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:mt-10 [&_p]:mx-auto [&_p]:max-w-3xl"
              />
            </motion.div>
          )}

          {/* CTA Buttons - Ultra Modern Symmetrical Design */}
          {links && links.length > 0 && (
            <motion.div 
              className="mt-20 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-8 w-full">
                {links.map(({ link }, i) => (
                  <CMSLink 
                    key={i} 
                    {...link} 
                    size="xl"
                    className="flex-1 w-full h-20 sm:h-24 justify-center px-8 sm:px-16 min-w-0 sm:min-w-[320px] type-title-lg uppercase tracking-[0.15em] font-bold bg-foreground text-background hover:bg-brand-500 hover:text-white border-none transition-all duration-500 shadow-xl"
                  >
                     <ArrowRight className="transition-transform group-hover:translate-x-2 shrink-0 ml-6 size-6" />
                  </CMSLink>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full pointer-events-none overflow-hidden opacity-10">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-brand-500 rounded-full blur-[180px] -translate-y-1/2" />
      </div>
    </section>
  )
}
