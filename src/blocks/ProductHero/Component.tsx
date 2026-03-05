// src/blocks/ProductHero/Component.tsx
import React from 'react'
import type { ProductHeroBlock as ProductHeroBlockProps, Product } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductHero } from '@/components/Product/ProductHero'

export const ProductHeroBlock: React.FC<ProductHeroBlockProps> = async (props) => {
  const { helpline, technicalSupportEmail, knowledgeBaseUrl } = props

  // Use populated object if available; fetch only if bare ID came through
  let product: Product | null =
    typeof props.product === 'object' && props.product !== null
      ? (props.product as Product)
      : null

  if (!product) {
    const payload = await getPayload({ config: configPromise })
    product = await payload.findByID({
      collection: 'products',
      id: props.product as number,
      depth: 1,
    })
  }

  if (!product) return null

  return (
    <ProductHero
      product={product}
      helpline={helpline}
      technicalSupportEmail={technicalSupportEmail}
      knowledgeBaseUrl={knowledgeBaseUrl}
    />
  )
}
