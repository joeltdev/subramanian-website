'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { cn } from '@/utilities/ui'

import type { GalleryBlock as GalleryBlockType, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const GalleryGrid: React.FC<GalleryBlockType> = ({ images, intro, variant = 'grid' }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const galleryImages = useMemo(() => 
    images?.filter((img): img is MediaType => typeof img === 'object') || [],
    [images]
  )

  // Different limits for different variants
  const limit = isMobile ? 4 : variant === 'curated' ? 6 : 8
  const hasMore = galleryImages.length > limit
  const visibleImages = isExpanded ? galleryImages : galleryImages.slice(0, limit)

  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setDirection(1)
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0))
  }, [selectedIndex, galleryImages.length])

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setDirection(-1)
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0))
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

  const lightboxVariants = {
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
    <div className="container mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
      {intro && (
        <div className="mb-16 md:mb-20">
          <div className="max-w-3xl">
            <RichText 
              data={intro} 
              enableGutter={false} 
              className="[&_h2]:text-xl md:[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_h2]:tracking-tight [&_h2]:!whitespace-nowrap md:[&_h2]:!whitespace-normal [&_h3]:text-xl md:[&_h3]:type-headline-1 [&_h3]:text-type-heading [&_h3]:font-bold [&_h3]:mb-4 [&_p]:type-body-lg [&_p]:text-type-secondary [&_p]:max-w-2xl [&_p]:mt-6 md:[&_p]:mt-0"
            />
            <div className="mt-8 h-px w-24 bg-brand-500" />
          </div>
        </div>
      )}

      <div className="relative">
        {/* Mobile Snap Carousel / Desktop Bento Grid */}
        {isMobile && !isExpanded ? (
          <div className="flex flex-col gap-8">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 gap-4">
              {visibleImages.map((image, index) => (
                <div
                  key={image.id}
                  className="min-w-[85vw] snap-center aspect-[4/5] relative bg-muted overflow-hidden"
                  onClick={() => {
                    setDirection(0)
                    setSelectedIndex(index)
                  }}
                >
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover object-center"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="type-body-sm text-white font-medium uppercase tracking-widest opacity-80">
                      {index + 1} / {galleryImages.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full py-5 border border-type-heading/20 type-title-sm text-type-heading uppercase tracking-widest font-bold"
            >
              View Archive ({galleryImages.length})
            </button>
          </div>
        ) : (
          <div 
            className={cn(
              "grid gap-4 md:gap-8 animate-in fade-in duration-1000 ease-out",
              variant === 'curated' ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
              !isExpanded && hasMore && "max-h-[1400px] overflow-hidden"
            )}
          >
            {visibleImages.map((image, index) => {
              const isHero = index === 0 && !isMobile;
              
              // Curated variant custom spans
              const isCurated = variant === 'curated' && !isMobile;
              const curatedSpan = isCurated ? (
                index === 0 ? "md:col-span-2 md:row-span-2 aspect-video md:aspect-auto" :
                index === 1 ? "md:col-span-1 md:row-span-2 aspect-[3/4] md:aspect-auto" :
                index === 4 ? "md:col-span-2 md:row-span-1 aspect-[21/9] md:aspect-auto" :
                "aspect-square"
              ) : isHero ? "md:col-span-2 md:row-span-2 aspect-video md:aspect-auto" : "aspect-square";

              return (
                <div
                  key={image.id}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden bg-muted",
                    curatedSpan
                  )}
                  onClick={() => {
                    setDirection(0)
                    setSelectedIndex(index)
                  }}
                >
                  <Media
                    resource={image}
                    fill
                    imgClassName="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.05] transform-gpu will-change-transform"
                    className="w-full h-full"
                  />
                  
                  {/* Glassmorphism Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0 z-10">
                    <div className="m-4 overflow-hidden rounded-none bg-black/40 p-4 backdrop-blur-md border border-white/10">
                      <div className="flex items-center justify-between gap-4">
                        <p className="type-body-sm text-white line-clamp-1 font-medium tracking-wide">
                          {image.alt || 'View Gallery'}
                        </p>
                        <Maximize2 className="size-4 text-white/70 shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Subtle Inner Glow on Hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ring-1 ring-inset ring-white/20 shadow-[inset_0_0_80px_rgba(255,255,255,0.05)] z-20" />
                </div>
              )
            })}
          </div>
        )}

        {/* Show More Logic with Gradient Fade (Desktop) */}
        {!isMobile && hasMore && !isExpanded && (
          <div className={cn(
            "absolute inset-x-0 bottom-0 flex h-96 flex-col items-center justify-end bg-gradient-to-t from-background via-background/80 to-transparent pb-12 z-30",
            variant === 'curated' && "h-48" // Smaller fade for curated
          )}>
            <button
              onClick={() => setIsExpanded(true)}
              className="group relative flex items-center gap-4 px-10 py-5 overflow-hidden transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-type-heading transition-transform duration-500 group-hover:translate-x-full" />
              <div className="absolute inset-0 bg-brand-500 -translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative z-10 type-title-sm text-background group-hover:text-background transition-colors duration-500 uppercase tracking-widest font-bold">
                {variant === 'curated' ? 'Explore Archive' : `Discover More (+${galleryImages.length - limit})`}
              </span>
            </button>
          </div>
        )}

        {/* Collapse Logic (Shared) */}
        {hasMore && isExpanded && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-10 py-5 border border-type-heading/20 hover:border-type-heading type-title-sm text-type-heading transition-all uppercase tracking-widest font-bold active:scale-95"
            >
              Collapse Archive
            </button>
          </div>
        )}
      </div>

      {/* Cinematic Lightbox */}
      <Dialog.Root open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <AnimatePresence initial={false}>
          {selectedIndex !== null && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-[60] flex items-center justify-center outline-none">
                  {/* Background Ambient Blur */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <Media
                      resource={selectedImage!}
                      fill
                      imgClassName="object-cover object-center blur-[120px] scale-150"
                    />
                  </div>

                  <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24">
                    
                    {/* Navigation - Floating & Minimal */}
                    <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4 md:px-8 pointer-events-none z-20">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePrev() }}
                        className="group pointer-events-auto flex size-12 md:size-16 items-center justify-center rounded-full bg-zinc-950/80 text-white backdrop-blur-md transition-all hover:bg-zinc-900 border border-white/20 active:scale-90"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="size-6 md:size-8 transition-transform group-hover:-translate-x-0.5" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleNext() }}
                        className="group pointer-events-auto flex size-12 md:size-16 items-center justify-center rounded-full bg-zinc-950/80 text-white backdrop-blur-md transition-all hover:bg-zinc-900 border border-white/20 active:scale-90"
                        aria-label="Next image"
                      >
                        <ChevronRight className="size-6 md:size-8 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    {/* Main Image View */}
                    <motion.div
                      key={selectedIndex}
                      custom={direction}
                      variants={lightboxVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 200, damping: 25 },
                        opacity: { duration: 0.3 },
                        scale: { duration: 0.4 },
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.5}
                      onDragEnd={onDragEnd}
                      className="relative flex h-full w-full max-w-6xl cursor-grab flex-col items-center justify-center active:cursor-grabbing z-10"
                    >
                      <div className="relative h-full w-full flex items-center justify-center shadow-2xl">
                        <Media
                          resource={selectedImage!}
                          fill
                          className="w-full h-full"
                          imgClassName="object-contain object-center"
                        />
                      </div>

                      {/* Lightbox Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-background/80 to-transparent">
                        <div className="max-w-xl mx-auto text-center">
                          {selectedImage?.alt && (
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-white type-body-lg font-medium tracking-wide mb-2"
                            >
                              {selectedImage.alt}
                            </motion.p>
                          )}
                          <p className="text-white/40 type-body-sm uppercase tracking-widest font-bold">
                            {selectedIndex + 1} <span className="mx-2 opacity-30">/</span> {galleryImages.length}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Close Control */}
                    <Dialog.Close asChild>
                      <button
                        className="fixed right-6 top-6 z-[80] flex size-12 items-center justify-center rounded-full bg-zinc-950/80 text-white backdrop-blur-md transition-all hover:bg-zinc-900 border border-white/20 active:scale-90 focus:outline-none"
                        aria-label="Close dialog"
                      >
                        <X className="size-6" />
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

