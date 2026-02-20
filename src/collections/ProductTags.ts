import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const ProductTags: CollectionConfig = {
  slug: 'product-tags',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'color'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code, e.g. #FF5733',
      },
    },
  ],
}
