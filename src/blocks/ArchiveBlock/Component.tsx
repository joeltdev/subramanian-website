import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, intro, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      posts = selectedDocs
        .map((post) => {
          if (typeof post.value === 'object') return post.value
          return null
        })
        .filter((post): post is Post => Boolean(post))
    }
  }

  return (
    <section className="py-16 md:py-24" id={`block-${id}`}>
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {intro && (
          <div className="mb-12 md:mb-16">
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
            />
          </div>
        )}
        <CollectionArchive posts={posts} />
      </div>
    </section>
  )
}
