import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

export const ManifestoPromo: Block = {
  slug: 'manifestoPromo',
  labels: {
    singular: 'Manifesto Promo Section',
    plural: 'Manifesto Promo Sections',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Large high-quality background image for the section.',
      },
    },
    {
      name: 'mobileBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional: Specifically cropped image for mobile portrait view.',
      },
    },
    {
      name: 'backgroundPosition',
      type: 'select',
      defaultValue: 'center',
      label: 'Image Focal Point (Mobile)',
      admin: {
        description: 'Where the image should be focused on mobile screens.',
      },
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left Focus', value: 'left' },
        { label: 'Right Focus', value: 'right' },
        { label: 'Top Focus', value: 'top' },
        { label: 'Bottom Focus', value: 'bottom' },
      ],
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'brand',
      label: 'Section Theme',
      admin: {
        description: 'Controls the overlay and text color contrast.',
      },
      options: [
        { label: 'Brand (Primary)', value: 'brand' },
        { label: 'Dark (Navy)', value: 'dark' },
        { label: 'Light (White)', value: 'light' },
      ],
    },
    {
      name: 'title',
      type: 'richText',
      label: 'Title',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Short Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    link({
      overrides: {
        name: 'cta',
        label: 'CTA Button',
        admin: {
          description: 'The primary button that links to the full Manifesto page.',
        },
      },
    }),
  ],
}
