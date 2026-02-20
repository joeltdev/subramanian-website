import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'productCode', 'category', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'name',
      position: undefined,
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
            {
              name: 'productGallery',
              type: 'array',
              admin: {
                description: 'Product images. First image is treated as primary.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  admin: {
                    description: 'Alt text for accessibility',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Downloads & Media',
          fields: [
            {
              name: 'instructionManual',
              type: 'text',
              admin: {
                description: 'URL to instruction manual PDF',
              },
            },
            {
              name: 'dataSheet',
              type: 'text',
              admin: {
                description: 'URL to data sheet PDF',
              },
            },
            {
              name: 'ecDeclaration',
              type: 'array',
              label: 'EC Declarations',
              admin: {
                description: 'EC Declaration of Conformity document URLs',
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'productVideo',
              type: 'text',
              admin: {
                description: 'Video URL (YouTube, Vimeo, etc.)',
              },
            },
            {
              name: 'threeDModel',
              type: 'text',
              admin: {
                description: 'URL to 3D model file',
              },
            },
          ],
        },
        {
          label: 'Technical Parameters',
          fields: [
            {
              name: 'technicalParameters',
              type: 'richText',
              label: false,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
      ],
    },
    // --- Sidebar ---
    {
      name: 'ean',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'EAN / Barcode',
      },
    },
    {
      name: 'productCode',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Internal code / SKU',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      // Populate the category's own parent one level deep.
      // Breadcrumbs from nestedDocsPlugin are already flat/denormalized.
      maxDepth: 2,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'product-tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        step: 0.01,
        description: 'Price (non-translatable)',
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'USD ($)', value: 'USD' },
        { label: 'GBP (£)', value: 'GBP' },
        { label: 'CHF (Fr)', value: 'CHF' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Currency (non-translatable)',
      },
    },
    {
      name: 'buyLink',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Purchase URL',
      },
    },
  ],
}
