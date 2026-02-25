import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

export const Integrations: Block = {
  slug: 'integrations',
  interfaceName: 'IntegrationsBlock',
  labels: { singular: 'Integrations', plural: 'Integrations' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      label: 'Variant',
      required: true,
      options: [
        { label: 'Grid Cards', value: 'grid' },
        { label: 'Tiles', value: 'tiles' },
        { label: 'Infinite Slider', value: 'slider' },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Section heading and supporting text — e.g. "Integrate with your favorite tools"',
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
      name: 'integrations',
      type: 'array',
      label: 'Integrations',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Integration logo image (SVG or PNG recommended)',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            description: 'Integration name and description — Grid Cards variant only',
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              description: '"Learn more" link per card — Grid Cards variant only',
            },
          },
        }),
      ],
    },
    {
      name: 'centerLogo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Brand logo shown in the center of the layout — Tiles and Slider variants',
        condition: (_, siblingData) => ['tiles', 'slider'].includes(siblingData?.variant),
      },
    },
    linkGroup({
      overrides: {
        label: 'CTA Button',
        maxRows: 1,
        admin: {
          description: 'Call-to-action button for the section — Tiles and Slider variants',
          condition: (_, siblingData) => ['tiles', 'slider'].includes(siblingData?.variant),
        },
      },
    }),
  ],
}
