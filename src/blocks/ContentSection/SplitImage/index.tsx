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
    <section className="py-4 md:py-8">
      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
        {intro && <RichText data={intro} enableGutter={false} className="relative z-10 max-w-4xl ml-0 [&_h2]:type-headline-1 [&_h2]:text-slate-800 [&_h2]:mb-8 [&_h3]:type-headline-3 [&_h3]:text-type-body [&_h3]:leading-tight [&_h3]:mb-6 [&_p]:text-type-secondary [&_p]:type-body-xl [&_p]:leading-snug" />}

        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            {typeof imageLight === 'object' && imageLight && (
              <Media resource={imageLight} className='bg-linear-to-b aspect-3/2 relative rounded-none from-border to-transparent p-px' pictureClassName="w-full h-full" imgClassName="w-full h-full rounded-none object-cover shadow dark:hidden" />
            )}
            {typeof imageDark === 'object' && imageDark && (
              <Media resource={imageDark} className='bg-linear-to-b aspect-3/2 relative rounded-none from-border to-transparent p-px' pictureClassName="w-full h-full" imgClassName="w-full h-full hidden rounded-none object-cover dark:block" />
            )}
          </div>

          {quote && (
            <div className="flex flex-col justify-center">
              <blockquote className="border-l-2 pl-6 border-border">
                <RichText
                  data={quote}
                  enableGutter={false}
                  className="[&_p]:type-quote [&_p]:leading-normal [&_p]:text-slate-400"
                />
                <footer className="mt-8 space-y-2">
                  {quoteAuthor && (
                    <cite className="not-italic block type-body-md text-type-secondary">
                      {quoteAuthor}
                    </cite>
                  )}
                  {typeof quoteLogo === 'object' && quoteLogo && (
                    <Media resource={quoteLogo} imgClassName="h-8 w-fit opacity-60 dark:invert" />
                  )}
                </footer>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
