'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

import type { GalleryBlock as GalleryBlockType, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const GalleryGrid: React.FC<GalleryBlockType> = ({ images, intro }) => {
  const [selectedImage, setSelectedImage] = useState<MediaType | null>(null)

  const galleryImages = images?.filter((img): img is MediaType => typeof img === 'object') || []

  return (
    <div className="container mx-auto px-6 md:px-8 py-16 md:py-24">
      {intro && (
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <RichText 
            data={intro} 
            enableGutter={false} 
            className="[&_h2]:type-headline-1 [&_p]:type-body-lg [&_p]:mt-4"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-square cursor-zoom-in overflow-hidden bg-muted"
            onClick={() => setSelectedImage(image)}
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

      <Dialog.Root open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <AnimatePresence>
          {selectedImage && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                >
                  <div className="relative max-h-full max-w-full overflow-hidden">
                    <Media
                      resource={selectedImage}
                      className="max-h-[85vh] w-auto object-contain shadow-2xl"
                    />
                    {selectedImage.alt && (
                      <p className="mt-4 text-center text-white/80 type-body-sm">
                        {selectedImage.alt}
                      </p>
                    )}
                    <Dialog.Close asChild>
                      <button
                        className="fixed right-4 top-4 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/80 focus:outline-none"
                        aria-label="Close dialog"
                      >
                        <X className="size-6" />
                      </button>
                    </Dialog.Close>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  )
}
