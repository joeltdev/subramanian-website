import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'scrollable',
      label: 'Variant',
      required: true,
      admin: {
        description: 'Choose the visual style of the gallery.',
      },
      options: [
        { label: 'Scrollable Gallery', value: 'scrollable' },
        { label: 'Parallax Carousel', value: 'parallax' },
        { label: 'Apple Cards Carousel', value: 'apple' },
      ],
    },
    // Shared: section intro (scrollable + apple)
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: 'Section heading and supporting text',
        condition: (_, siblingData) => ['scrollable', 'apple'].includes(siblingData?.variant),
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
    // Scrollable only: header CTA link
    linkGroup({
      overrides: {
        name: 'cta',
        label: 'Header CTA Link',
        maxRows: 1,
        admin: {
          initCollapsed: true,
          description: 'Optional link displayed next to the section heading (e.g. "Book a demo")',
          condition: (_, siblingData) => siblingData?.variant === 'scrollable',
        },
      },
    }),
    // Scrollable only: gallery items
    {
      name: 'galleryItems',
      type: 'array',
      label: 'Gallery Items',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'scrollable',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            description:
              'Item title and summary — use h3/h4 for the title, then a paragraph for the summary',
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
        link({ appearances: false }),
      ],
    },
    // Parallax only: slides
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'parallax',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Background image for this slide' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Slide heading text' },
        },
        link({ appearances: false }),
      ],
    },
    // Apple only: cards
    {
      name: 'appleItems',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'apple',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Card background image' },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description:
              'Short category label shown above the card title (e.g. "Product", "Case Study")',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Card title text' },
        },
        {
          name: 'expandedContent',
          type: 'richText',
          label: 'Expanded Content',
          admin: {
            description: 'Content shown in the expanded panel when the card is clicked',
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
      ],
    },
  ],
}
