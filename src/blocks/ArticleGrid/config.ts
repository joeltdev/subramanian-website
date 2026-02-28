import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ArticleGrid: Block = {
  slug: 'articleGrid',
  interfaceName: 'ArticleGridBlock',
  labels: { singular: 'Article Grid', plural: 'Article Grids' },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Optional section heading and supporting text shown above the article cards',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: 'Populate By',
      options: [
        { label: 'Latest Posts', value: 'collection' },
        { label: 'Individual Selection', value: 'selection' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      hasMany: true,
      label: 'Filter by Category',
      relationTo: 'categories',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: 'Leave empty to show posts from all categories',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      hasMany: true,
      label: 'Selected Posts',
      relationTo: 'posts',
      maxRows: 4,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
        description: 'Pick up to 4 posts to display',
      },
    },
  ],
}
