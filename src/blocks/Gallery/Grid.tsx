'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

import type { GalleryBlock as GalleryBlockType, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const GalleryGrid: React.FC<GalleryBlockType> = ({ images, intro, variant = 'grid' }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)

  const galleryImages = useMemo(() => 
    images?.filter((img): img is MediaType => typeof img === 'object') || [],
    [images]
  )

  const isMasonry = variant === 'masonry'

  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setDirection(1)
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0))
  }, [selectedIndex, galleryImages.length])

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setDirection(-1)
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) : 0))
  }, [selectedIndex, galleryImages.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'Escape') setSelectedIndex(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, handleNext, handlePrev])

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) handlePrev()
      else handleNext()
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div className="container mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
      {intro && (
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <RichText 
            data={intro} 
            enableGutter={false} 
            className="[&_h3]:type-headline-1 [&_h3]:text-type-heading [&_p]:type-body-lg [&_p]:text-type-body [&_p]:mt-4"
          />
        </div>
      )}

      {isMasonry ? (
        <div className="columns-3 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid group relative cursor-zoom-in overflow-hidden bg-muted shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:shadow-brand-500/10"
              onClick={() => {
                setDirection(0)
                setSelectedIndex(index)
              }}
            >
              <Media
                resource={image}
                className="w-full h-auto"
                imgClassName="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square cursor-zoom-in overflow-hidden bg-muted"
              onClick={() => {
                setDirection(0)
                setSelectedIndex(index)
              }}
            >
              <Media
                resource={image}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </motion.div>
          ))}
        </div>
      )}

      <Dialog.Root open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <AnimatePresence initial={false}>
          {selectedIndex !== null && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 outline-none">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    
                    {/* Navigation Buttons - Desktop */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePrev() }}
                      className="absolute left-4 z-[70] hidden md:flex items-center justify-center rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95 focus:outline-none"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-8" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleNext() }}
                      className="absolute right-4 z-[70] hidden md:flex items-center justify-center rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95 focus:outline-none"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-8" />
                    </button>

                    {/* Image Container with Swipe */}
                    <motion.div
                      key={selectedIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.8}
                      onDragEnd={onDragEnd}
                      className="relative flex h-full w-full max-w-7xl cursor-grab flex-col items-center justify-center active:cursor-grabbing"
                    >
                      <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
                        <Media
                          resource={selectedImage!}
                          fill
                          className="w-full h-full"
                          imgClassName="object-contain pointer-events-none"
                        />
                      </div>

                      <div className="flex flex-col items-center pt-6 pb-2 shrink-0">
                        {selectedImage?.alt && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-white/70 type-body-md max-w-2xl px-4"
                          >
                            {selectedImage.alt}
                          </motion.p>
                        )}
                        <p className="mt-2 text-white/40 type-body-sm font-medium tracking-wider">
                          {selectedIndex + 1} / {galleryImages.length}
                        </p>
                      </div>
                    </motion.div>

                    {/* Controls */}
                    <Dialog.Close asChild>
                      <button
                        className="fixed right-4 top-4 z-[80] rounded-full bg-white/5 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 focus:outline-none md:right-8 md:top-8"
                        aria-label="Close dialog"
                      >
                        <X className="size-6 md:size-8" />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  )
}
