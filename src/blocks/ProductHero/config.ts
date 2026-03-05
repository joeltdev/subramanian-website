// src/blocks/ProductHero/config.ts
import type { Block } from 'payload'

export const ProductHero: Block = {
  slug: 'productHero',
  interfaceName: 'ProductHeroBlock',
  labels: { singular: 'Product Hero', plural: 'Product Heroes' },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: { description: 'The product to display' },
    },
    {
      name: 'helpline',
      type: 'text',
      admin: { description: 'Support phone number (overrides default)' },
    },
    {
      name: 'technicalSupportEmail',
      type: 'text',
    },
    {
      name: 'knowledgeBaseUrl',
      type: 'text',
      label: 'Knowledge Base URL',
    },
  ],
}
