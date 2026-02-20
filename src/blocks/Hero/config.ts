import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'section1',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Centered Animated', value: 'section1' },
        { label: 'Left Aligned Animated', value: 'section2' },
      ],
      required: true,
    },
    {
      name: 'badgeLabel',
      type: 'text',
      admin: {
        description:
          'Optional announcement badge shown above the heading (e.g. "Introducing our new feature")',
        condition: (_, { type } = {}) => type === 'section1',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'mediaPreview',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'App screenshot or preview image shown below the hero text',
        condition: (_, { type } = {}) => ['section1', 'section2'].includes(type),
      },
    },
  ],
  label: false,
}
