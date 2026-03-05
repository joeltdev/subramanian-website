// src/blocks/ProductListing/Component.tsx
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductListingClient } from './ProductListingClient'
import type { ProductListingBlock as ProductListingBlockProps } from '@/payload-types'

export const ProductListingBlock: React.FC<
  ProductListingBlockProps & { disableInnerContainer?: boolean }
> = async (props) => {
  const { title, description, productsPerPage, showPagination = true } = props

  const categoryId =
    props.category && typeof props.category === 'object' && props.category !== null
      ? (props.category as { id: number }).id
      : typeof props.category === 'number'
        ? props.category
        : null

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    limit: productsPerPage ?? 9,
    page: 1,
    depth: 1,
    ...(categoryId ? { where: { category: { equals: categoryId } } } : {}),
  })

  return (
    <ProductListingClient
      initialProducts={result.docs}
      totalPages={result.totalPages}
      currentPage={1}
      productsPerPage={productsPerPage ?? 9}
      categoryId={categoryId}
      showPagination={showPagination ?? true}
      title={title}
      description={description}
    />
  )
}
