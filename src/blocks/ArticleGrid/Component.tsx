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
    <section className="bg-accent py-4 md:py-24" id={`block-${id}`}>
      <div className="mx-auto max-w-7xl px-6">
        {intro && (
          <div className="mb-12 max-w-2xl">
            <RichText
              data={intro}
              enableGutter={false}
              className="[&_h2]:type-headline-2 [&_h2]:text-foreground [&_h2]:mb-3 [&_h3]:type-headline-4 [&_h3]:text-foreground [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:type-body-lg"
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
