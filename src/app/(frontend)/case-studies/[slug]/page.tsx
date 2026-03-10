import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { CaseStudy, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const caseStudies = await payload.find({
    collection: 'case-studies',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return caseStudies.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CaseStudyPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/case-studies/' + decodedSlug
  const caseStudy = await queryCaseStudyBySlug({ slug: decodedSlug })

  if (!caseStudy) return <PayloadRedirects url={url} />

  const image = typeof caseStudy.featuredImage === 'object' ? (caseStudy.featuredImage as MediaType) : null

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />

      {image && (
        <div className="relative w-full h-[420px] overflow-hidden bg-muted">
          <Media resource={image} fill className="object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12">
        {(caseStudy.industry || caseStudy.useCase) && (
          <div className="flex gap-4 mb-4">
            {caseStudy.industry && (
              <span className="type-label-md text-type-tertiary border border-border rounded-none px-2 py-1">
                {caseStudy.industry}
              </span>
            )}
            {caseStudy.useCase && (
              <span className="type-label-md text-type-tertiary border border-border rounded-none px-2 py-1">
                {caseStudy.useCase}
              </span>
            )}
          </div>
        )}

        <h1 className="type-headline-1 text-type-heading mb-6">{caseStudy.title}</h1>

        {caseStudy.introContent && (
          <RichText
            data={caseStudy.introContent}
            enableGutter={false}
            className="[&_h2]:type-headline-2 [&_h2]:text-type-heading [&_h3]:type-headline-3 [&_h3]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const caseStudy = await queryCaseStudyBySlug({ slug: decodeURIComponent(slug) })

  return generateMeta({ doc: caseStudy })
}

const queryCaseStudyBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'case-studies',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
