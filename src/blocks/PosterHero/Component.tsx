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
      className="relative overflow-hidden py-16 md:py-24 lg:py-32 min-h-[70svh] flex items-center  bg-[#F9F6F1]"
    >

      {/* Dark Navy Box - Slides in from the right */}
      <motion.div
        initial={{ x: '100%' }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className=" bg-[#0B1A28] rounded-none max-w-7xl left-1/2 -translate-x-1/2  px-6 md:px-8 w-full h-[80%] bottom-0 absolute flex flex-col overflow-hidden"
      >
      </motion.div>
      {/* Subject Image - Positioned to overlap the left edge of the navy box */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute -left-10 bottom-0 w-full md:w-[40%] pointer-events-none flex items-end"
      >
        {subjectImage && (
          <Media
            resource={subjectImage}
            className="h-full w-full"
            imgClassName='w-full object-cover object-bottom md:object-left-bottom max-h-[100vh]'
          />
        )}
      </motion.div>
      <div className=" mx-auto max-w-7xl px-6 md:px-8 w-full relative ">


        <div className="relative flex flex-col md:flex-row items-stretch justify-end">


          {/* Text Content - Absolute positioning within the box to match poster layout */}
          <div className="relative z-30 flex-1 flex flex-col justify-between p-8 md:p-16 lg:p-20 text-white">

            {/* Top-Right: Massive bold white Malayalam name (Headline) */}
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="max-w-4xl"
              >
                {headline && (
                  <RichText
                    data={headline}
                    enableGutter={false}
                    enableProse={false}
                    className="
                        [&_h1]:text-right
                        [&_h1]:text-5xl md:[&_h1]:text-6xl lg:[&_h1]:text-[7rem] 
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
            <div className="flex justify-end mt-8 md:mt-16">
              <div className="max-w-3xl text-right flex flex-col items-end">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  {subheadline && (
                    <p className="type-body-xl md:type-body-2xl text-white/90 leading-relaxed font-medium text-balance">
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

        </div>
      </div>
    </section>
  )
}
