import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'single',
      label: 'Layout Variant',
      required: true,
      admin: {
        description:
          'Single: title, subtitle and accordion in one column. Split: title and subtitle on the left, accordion on the right.',
      },
      options: [
        { label: 'Single column (one alignment)', value: 'single' },
        { label: 'Split (left intro, right accordion)', value: 'split' },
      ],
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      required: false,
      admin: {
        description:
          'Section heading and supporting text — e.g. "Frequently Asked Questions" and a short description.',
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
      name: 'supportLine',
      type: 'group',
      label: 'Support link / subtitle',
      admin: {
        description:
          'Optional. Add a subtitle below the intro (plain text). When a subtitle is set, you can optionally add a link with its own label (e.g. "visit our support page") that appears in blue after the subtitle.',
      },
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle text',
          required: false,
          admin: {
            description: 'Optional. Plain text shown below the intro, e.g. "You don\'t see what you\'re looking for?"',
          },
        },
        {
          type: 'collapsible',
          label: 'Optional link',
          admin: {
            condition: (_, siblingData) => !!siblingData?.subtitle,
            description: 'Only shown when subtitle above is set. Add a link that appears after the subtitle; the link has its own text (e.g. "visit our support page").',
          },
          fields: [
            {
              name: 'linkLabel',
              type: 'text',
              label: 'Link text',
              required: false,
              admin: {
                description: 'Text shown as the blue, clickable link (e.g. "visit our support page", "customer support team").',
              },
            },
            {
              name: 'type',
              type: 'radio',
              label: 'Link type',
              defaultValue: 'reference',
              options: [
                { label: 'Internal link', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
              ],
              admin: { condition: (_, siblingData) => !!siblingData?.subtitle },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              label: 'Document to link to',
              required: false,
              admin: {
                condition: (_, siblingData) => !!siblingData?.subtitle && siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Custom URL',
              required: false,
              admin: {
                condition: (_, siblingData) => !!siblingData?.subtitle && siblingData?.type === 'custom',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              admin: { condition: (_, siblingData) => !!siblingData?.subtitle },
            },
          ],
        },
      ],
    },
    {
      name: 'groups',
      type: 'array',
      label: 'FAQ categories',
      minRows: 1,
      maxRows: 12,
      admin: {
        description:
          'Group questions by category (e.g. General, Shipping). Each category has a label and a list of Q&A items.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Category name',
          required: false,
          admin: {
            description: 'Optional. e.g. "General", "Shipping". Leave empty to show questions without a category heading.',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Questions & answers',
          minRows: 1,
          maxRows: 20,
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Question',
              required: true,
              admin: {
                description: 'The accordion trigger text',
              },
            },
            {
              name: 'answer',
              type: 'richText',
              label: 'Answer',
              required: false,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
}
