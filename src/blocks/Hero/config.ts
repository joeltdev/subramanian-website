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
        { label: 'Manifesto Landing', value: 'manifesto' },
      ],
      required: true,
    },
    {
      name: 'badgeLabel',
      type: 'text',
      admin: {
        description:
          'Optional announcement badge shown above the heading (e.g. "Introducing our new feature")',
        condition: (_, { type } = {}) => ['section1', 'section2', 'manifesto'].includes(type),
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
        condition: (_, { type } = {}) => ['section1', 'section2', 'manifesto'].includes(type),
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Full-screen background video for desktop. Plays autoplay/muted/loop.',
        condition: (_, { type } = {}) => ['section2', 'manifesto'].includes(type),
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fallback background image for desktop when no video is set.',
        condition: (_, { type } = {}) => ['section2', 'manifesto'].includes(type),
      },
    },
    {
      name: 'mobileBackgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background video for mobile devices.',
        condition: (_, { type } = {}) => ['section2', 'manifesto'].includes(type),
      },
    },
    {
      name: 'mobileBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image for mobile devices.',
        condition: (_, { type } = {}) => ['section2', 'manifesto'].includes(type),
      },
    },
  ],
  label: false,
}
