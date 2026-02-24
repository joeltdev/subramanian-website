import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ICON_OPTIONS } from '@/blocks/shared/featureIcons'

export const FeatureCards: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCardsBlock',
  labels: { singular: 'Feature Cards', plural: 'Feature Cards' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'floating',
      label: 'Variant',
      required: true,
      options: [
        { label: 'Floating Cards', value: 'floating' },
        { label: 'Outlined Cards', value: 'outlined' },
        { label: 'Bordered Grid', value: 'grid' },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: "Section heading and supporting text — e.g. 'Smart automation for modern buildings'",
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
      name: 'items',
      type: 'array',
      label: 'Feature Items',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: "Short feature label — e.g. 'Remote Control', 'KNX Integration', 'Energy Monitoring'",
          },
        },
        {
          name: 'description',
          type: 'richText',
          admin: {
            description: "One or two sentences — e.g. 'Manage every INELS device from a single dashboard, anywhere in the world.'",
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
