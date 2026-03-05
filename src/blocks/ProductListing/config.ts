// src/blocks/ProductListing/config.ts
import type { Block } from 'payload'

export const ProductListing: Block = {
  slug: 'productListing',
  interfaceName: 'ProductListingBlock',
  labels: { singular: 'Product Listing', plural: 'Product Listings' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Optional heading above the grid' },
    },
    {
      name: 'description',
      type: 'text',
      admin: { description: 'Optional subheading' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { description: 'Filter to this category (leave empty for all products)' },
    },
    {
      name: 'productsPerPage',
      type: 'number',
      defaultValue: 9,
      min: 1,
      max: 24,
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
