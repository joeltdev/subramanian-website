import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select the form to display in this block.',
      },
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Optional heading and supporting text shown above the form.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      type: 'collapsible',
      label: 'Background Image',
      fields: [
        {
          name: 'imageLight',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Background Image (Light Mode)',
          admin: {
            description: 'Optional background image shown in light mode.',
          },
        },
        {
          name: 'imageDark',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Background Image (Dark Mode)',
          admin: {
            description: 'Optional background image shown in dark mode.',
          },
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
