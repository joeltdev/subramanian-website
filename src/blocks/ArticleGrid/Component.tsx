import type { Post, ArticleGridBlock as ArticleGridBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { ArticleCard } from '@/components/ArticleCard'

export const ArticleGridBlock: React.FC<ArticleGridBlockProps & { id?: string }> = async (
  props,
) => {
  const { id, intro, populateBy, categories, selectedDocs } = props

  let posts: Post[] = []

  if (populateBy === 'selection') {
    if (selectedDocs?.length) {
      posts = (selectedDocs as (number | Post)[])
        .map((doc) => (typeof doc === 'object' ? doc : null))
        .filter(Boolean)
        .slice(0, 4) as Post[]
    }
  } else {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories
      ?.map((cat) => (typeof cat === 'object' ? cat.id : cat))
      .filter(Boolean)

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit: 4,
      sort: '-publishedAt',
      ...(flattenedCategories && flattenedCategories.length > 0
        ? { where: { categories: { in: flattenedCategories } } }
        : {}),
    })

    posts = fetchedPosts.docs
  }

  return (
    <section className="py-16 md:py-24 bg-muted " id={`block-${id}`}>
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

        {posts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
