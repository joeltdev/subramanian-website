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
        {intro && <RichText data={intro} enableGutter={false} className="relative z-10 max-w-2xl ml-0 [&_h2]:text-6xl [&_h2]:font-semibold [&_h2]:mb-8 [&_p]:text-slate-600 [&_p]:text-2xl [&_p]:leading-snug [&_p]:font-light" />}

        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            {typeof imageLight === 'object' && imageLight && (
              <Media resource={imageLight} className='bg-linear-to-b aspect-3/2 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700' pictureClassName="w-full h-full" imgClassName="w-full h-full rounded-[15px] object-cover shadow dark:hidden" />
            )}
            {typeof imageDark === 'object' && imageDark && (
              <Media resource={imageDark} className='bg-linear-to-b aspect-3/2 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700' pictureClassName="w-full h-full" imgClassName="w-full h-full hidden rounded-[15px] object-cover dark:block" />
            )}
          </div>

          {quote && (
            <div className="flex flex-col justify-center">
              <blockquote className="border-l-2 pl-6 border-slate-200">
                <RichText
                  data={quote}
                  enableGutter={false}
                  className="[&_p]:text-lg [&_p]:leading-normal [&_p]:font-extralight  [&_p]:italic [&_p]:text-slate-400 md:[&_p]:text-xl"
                />
                <footer className="mt-8 space-y-2">
                  {quoteAuthor && (
                    <cite className="not-italic block text-base font-normal tracking-wide text-slate-600">
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
