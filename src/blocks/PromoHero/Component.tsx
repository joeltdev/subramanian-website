'use client'
import React from 'react'
import type { PromoHeroBlock as T } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

export const PromoHeroBlock: React.FC<T> = ({ intro, links }) => {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden relative border-t border-border/10">
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
                className="[&_h1]:type-headline-1 [&_h1]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary [&_p]:mt-8 [&_p]:mx-auto [&_p]:max-w-3xl"
              />
            </motion.div>
          )}

          {/* CTA Buttons - Modern Symmetrical Design */}
          {links && links.length > 0 && (
            <motion.div 
              className="mt-16 w-full max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 w-full">
                {links.map(({ link }, i) => (
                  <CMSLink 
                    key={i} 
                    {...link} 
                    size="xl"
                    className="flex-1 w-full h-16 sm:h-20 justify-center px-8 sm:px-12 min-w-0 sm:min-w-[280px] type-title-md uppercase tracking-wider bg-primary hover:bg-foreground hover:text-background border-none transition-all duration-300"
                  >
                     <ArrowRight className="transition-transform group-hover:translate-x-1 shrink-0 ml-4" />
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
