import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const Manifesto: Block = {
  slug: 'manifesto',
  interfaceName: 'ManifestoBlock',
  labels: {
    singular: 'Manifesto Section',
    plural: 'Manifesto Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'textLeft',
      label: 'Layout Variant',
      admin: {
        description: 'Choose which side the text appears on.',
      },
      options: [
        { label: 'Text Left (Image Right)', value: 'textLeft' },
        { label: 'Text Right (Image Left)', value: 'textRight' },
      ],
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      label: 'Section Theme',
      admin: {
        description: 'Controls the background and text color contrast.',
      },
      options: [
        { label: 'Light (White)', value: 'light' },
        { label: 'Dark (Navy)', value: 'dark' },
        { label: 'Brand (Azure)', value: 'brand' },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Section Intro',
      admin: {
        description: 'Primary heading for this document section.',
      },
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
      name: 'content',
      type: 'richText',
      label: 'Main Content (Malayalam)',
      required: true,
      admin: {
        description: 'The long-form Malayalam text content.',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF Cover Mockup',
      admin: {
        description: 'Image of the document cover page.',
      },
    },
    {
      name: 'linkTitle',
      type: 'text',
      label: 'Download Section Title',
      defaultValue: 'Download PDF',
      admin: {
        description: 'Small label shown above the download button.',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 1,
        admin: {
          description: 'Link to the PDF file for download.',
        },
      },
    }),
  ],
}
