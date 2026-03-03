// src/blocks/ParallaxShowcase/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const ParallaxShowcase: Block = {
  slug: 'parallaxShowcase',
  interfaceName: 'ParallaxShowcaseBlock',
  labels: { singular: 'Parallax Showcase', plural: 'Parallax Showcases' },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Block-level heading and supporting text (shown above the carousel)',
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
      name: 'autoScrollInterval',
      type: 'number',
      label: 'Auto-scroll Interval (seconds)',
      defaultValue: 5,
      admin: {
        description: 'Seconds between automatic slide advances (2–15). Default: 5.',
        step: 1,
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 2,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Tab label shown in the navigation row' },
        },
        {
          name: 'content',
          type: 'richText',
          admin: {
            description:
              'Top-left slide content — use h3/h4 for heading, paragraph for body text',
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
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Full-slide background. Use 3:2 landscape images (e.g. 1800×1200px)',
          },
        },
        {
          name: 'foregroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional foreground layer with counter-parallax. PNG with transparency recommended.',
          },
        },
        link({ appearances: false }),
      ],
    },
  ],
}
