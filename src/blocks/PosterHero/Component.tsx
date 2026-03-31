'use client'
import React from 'react'
import type { PosterHeroBlock as T } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { motion } from 'motion/react'

export const PosterHeroBlock: React.FC<T> = ({
  headline,
  subheadline,
  highlightColor = '#B59449',
  link,
  subjectImage,
  textureOverlay = true,
}) => {
  return (
    <section 
      data-section-theme="light" 
      className="relative overflow-hidden bg-[#F9F6F1] py-16 md:py-24 lg:py-32 min-h-[70svh] flex items-center"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 w-full relative">
        <div className="relative flex flex-col md:flex-row items-stretch justify-end min-h-[500px] md:min-h-[650px]">
          
          {/* Subject Image - Positioned to overlap the left edge of the navy box */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute left-0 bottom-0 top-0 z-20 w-full md:w-[55%] pointer-events-none flex items-end"
          >
            {subjectImage && (
              <Media
                resource={subjectImage}
                className="h-full w-full object-contain object-bottom md:object-left-bottom"
              />
            )}
          </motion.div>

          {/* Dark Navy Box - Slides in from the right */}
          <motion.div
            initial={{ x: '100%' }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0B1A28] rounded-tl-[120px] w-full md:w-[85%] relative z-10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Texture Overlay - Subtle crumpled paper effect inside the box */}
            {textureOverlay && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay bg-repeat z-0"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
              />
            )}

            {/* Text Content - Absolute positioning within the box to match poster layout */}
            <div className="relative z-30 flex-1 flex flex-col justify-between p-8 md:p-16 lg:p-20 text-white">
              
              {/* Top-Right: Massive bold white Malayalam name (Headline) */}
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="max-w-4xl"
                >
                  {headline && (
                    <RichText
                      data={headline}
                      enableGutter={false}
                      enableProse={false}
                      className="
                        text-right
                        [&_h1]:text-4xl md:[&_h1]:text-6xl lg:[&_h1]:text-[7rem] 
                        [&_h1]:font-black 
                        [&_h1]:leading-none 
                        [&_h1]:text-white 
                        [&_h1]:tracking-tighter
                        [&_h1]:m-0
                      "
                    />
                  )}
                </motion.div>
              </div>

              {/* Center-Right: Multi-line body text (Subheadline) + CTA */}
              <div className="flex justify-end mt-12 md:mt-24">
                <div className="max-w-md text-right flex flex-col items-end">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                  >
                    {subheadline && (
                      <p className="type-body-lg md:type-body-xl text-white/90 leading-relaxed font-medium">
                        {subheadline}
                      </p>
                    )}
                    
                    {/* Highlight color used as an accent element */}
                    <div 
                      className="h-1.5 w-24 ml-auto mt-6"
                      style={{ backgroundColor: highlightColor ?? undefined }}
                    />
                  </motion.div>

                  {link && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                    >
                      <CMSLink
                        {...link}
                        appearance="inline"
                        className="inline-block bg-transparent border-2 border-white text-white uppercase font-bold tracking-[0.2em] px-10 py-4 mt-10 transition-all duration-300 hover:bg-white hover:text-[#0B1A28] rounded-none text-sm"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
