import React from 'react'
import type { ContentSectionBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const SplitImageContentSection: React.FC<ContentSectionBlock> = ({
  intro,
  imageDark,
  imageLight,
  quote,
  quoteAuthor,
  quoteLogo,
}) => {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        {intro && <RichText data={intro} enableGutter={false} className="relative z-10 max-w-xl" />}

        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-[76/59] relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              {typeof imageLight === 'object' && imageLight && (
                <Media resource={imageLight} imgClassName="rounded-[15px] shadow dark:hidden" />
              )}
              {typeof imageDark === 'object' && imageDark && (
                <Media resource={imageDark} imgClassName="hidden rounded-[15px] dark:block" />
              )}
            </div>
          </div>

          {quote && (
            <div className="relative space-y-4">
              <blockquote className="border-l-4 pl-4">
                <RichText data={quote} enableGutter={false} />
                <div className="mt-6 space-y-3">
                  {quoteAuthor && <cite className="block font-medium">{quoteAuthor}</cite>}
                  {typeof quoteLogo === 'object' && quoteLogo && (
                    <Media resource={quoteLogo} imgClassName="h-5 w-fit dark:invert" />
                  )}
                </div>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
