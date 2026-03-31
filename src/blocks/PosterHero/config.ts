import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

export const PosterHero: Block = {
  slug: 'posterHero',
  interfaceName: 'PosterHeroBlock',
  labels: {
    singular: 'Poster Hero',
    plural: 'Poster Heroes',
  },
  fields: [
    {
      name: 'headline',
      type: 'richText',
      admin: {
        description: 'Main poster headline (H1)',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'subheadline',
      type: 'text',
      admin: {
        description: 'Supporting text displayed below the headline',
      },
    },
    {
      name: 'highlightColor',
      type: 'text',
      defaultValue: '#B59449',
      admin: {
        description: 'Primary accent color (Default: Mustard Gold #B59449)',
      },
    },
    link(),
    {
      name: 'subjectImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The main subject image for the poster',
      },
    },
    {
      name: 'textureOverlay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle the paper texture overlay effect',
      },
    },
  ],
}
