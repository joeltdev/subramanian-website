'use client'

import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import type { GalleryBlock } from '@/payload-types'
import type { CarouselApi } from '@/components/ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const ScrollableGallery: React.FC<GalleryBlock> = ({ intro, cta, galleryItems }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  const ctaLink = Array.isArray(cta) && cta.length > 0 ? cta[0]?.link : null

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            {intro && (
              <RichText
                data={intro}
                enableGutter={false}
                className="[&_h2]:type-headline-1 [&_h2]:text-type-body [&_h2]:mb-3 [&_h3]:type-headline-2 [&_h3]:text-type-body [&_h3]:mb-3"
              />
            )}
            {ctaLink && (
              <CMSLink
                {...ctaLink}
                className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
              >
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </CMSLink>
            )}
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {Array.isArray(galleryItems) && galleryItems.length > 0 && (
        <div className="w-full max-w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              containScroll: false,
              breakpoints: {
                '(max-width: 768px)': { dragFree: true },
              },
            }}
            className="relative w-full max-w-full md:left-[-1rem]"
          >
            <CarouselContent className="w-full max-w-full md:-mr-4 md:ml-8 2xl:mr-[max(0rem,calc(50vw-700px-1rem))] 2xl:ml-[max(8rem,calc(50vw-700px+1rem))]">
              {galleryItems.map(({ id, image, richText, link }) => (
                <CarouselItem key={id} className="ml-8 md:max-w-[452px] last:pr-8">
                  <CMSLink
                    {...link}
                    className="group flex flex-col justify-between"
                  >
                    {typeof image === 'object' && image && (
                      <div className="relative aspect-3/2 overflow-hidden rounded-xl">
                        <Media
                          fill
                          resource={image}
                          className="absolute inset-0"
                          pictureClassName="absolute inset-0"
                          imgClassName="object-cover object-center transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    {richText && (
                      <div className="pt-4">
                        <RichText
                          data={richText}
                          enableGutter={false}
                          className="[&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-medium [&_p]:mb-8 [&_p]:line-clamp-2 [&_p]:text-sm [&_p]:text-muted-foreground md:[&_p]:text-base"
                        />
                      </div>
                    )}
                    <div className="flex items-center text-sm font-medium">
                      Read more
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CMSLink>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </section>
  )
}
