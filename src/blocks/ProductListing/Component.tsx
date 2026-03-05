// src/blocks/ProductListing/Component.tsx
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductListingClient } from './ProductListingClient'

// ProductListingBlock type will be available after generate:types in Task 12
// Use a local type for now to avoid import errors
interface ProductListingBlockProps {
  title?: string | null
  description?: string | null
  category?: number | { id: number; name: string } | null
  productsPerPage?: number | null
  showPagination?: boolean | null
  disableInnerContainer?: boolean
}

export const ProductListingBlock: React.FC<ProductListingBlockProps> = async (props) => {
  const { title, description, productsPerPage = 9, showPagination = true } = props

  const categoryId =
    props.category && typeof props.category === 'object'
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
