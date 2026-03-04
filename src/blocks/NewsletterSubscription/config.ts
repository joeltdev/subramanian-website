import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const NewsletterSubscription: Block = {
  slug: 'newsletterSubscription',
  interfaceName: 'NewsletterSubscriptionBlock',
  labels: {
    singular: 'Newsletter Subscription',
    plural: 'Newsletter Subscriptions',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Eyebrow',
      admin: {
        description: 'Small label above the headline, e.g. "News"',
      },
      required: false,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Headline',
      required: false,
      admin: {
        description: 'Main heading, e.g. "Stay informed with iNELS."',
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
      name: 'submitButtonLabel',
      type: 'text',
      label: 'Submit Button Label',
      defaultValue: 'Subscribe',
      admin: {
        description: 'Label for the subscribe button',
      },
    },
    {
      name: 'formActionUrl',
      type: 'text',
      label: 'Form Action URL',
      required: false,
      admin: {
        description: 'Optional URL to POST the form to (e.g. newsletter API). Leave empty to handle client-side.',
      },
    },
    {
      type: 'collapsible',
      label: 'Image',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right-hand Image',
          required: false,
          admin: {
            description: 'Image shown on the right side of the block',
          },
        },
      ],
    },
  ],
}
