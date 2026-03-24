import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const HomeSlider: Block = {
  slug: 'home_slider',
  interfaceName: 'HomeSliderBlock',
  labels: {
    singular: 'Home Slider',
    plural: 'Home Sliders',
  },
  fields: [
    {
      name: 'intro_n_a',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Section title and supporting text at the top.',
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
      label: 'Slides',
      minRows: 1,
      maxRows: 6,
      required: true,
      fields: [
        {
          name: 'tabLabel',
          type: 'text',
          label: 'Tab Label',
          required: true,
          admin: {
            description: 'Short label for the tab button.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Slide Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Slide Description',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'overlayColor',
          type: 'select',
          defaultValue: 'black',
          options: [
            { label: 'Black', value: 'black' },
            { label: 'Brand Primary', value: 'brand' },
          ],
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: {
            description: 'Overlay opacity percentage (e.g. 50 for 50%).',
          },
        },
      ],
    },
  ],
}
