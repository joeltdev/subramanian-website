import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Section heading and supporting text',
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
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 1,
      admin: {
        description:
          'First item displays as the large featured card. Remaining items fill the smaller cards.',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Company Logo',
          admin: {
            description: 'Optional company logo shown at the top of the card (SVG or PNG)',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          label: 'Quote',
          admin: {
            description: 'The testimonial quote text',
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
          admin: {
            description: 'Full name of the person giving the testimonial',
          },
        },
        {
          name: 'role',
          type: 'text',
          label: 'Author Role',
          admin: {
            description: 'Job title or role, e.g. "Software Engineer"',
          },
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Author Avatar',
          admin: {
            description: 'Author profile photo',
          },
        },
      ],
    },
  ],
}
