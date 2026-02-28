import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

export const MediaCards: Block = {
  slug: 'mediaCards',
  interfaceName: 'MediaCardsBlock',
  labels: { singular: 'Media Cards', plural: 'Media Cards' },
  fields: [
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
      label: 'Cards',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          required: true,
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            description: "Card heading and body — e.g. '### Remote Control\\nManage every device from a single dashboard.'",
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
        link({ disableLabel: true, appearances: false }),
      ],
    },
  ],
}
