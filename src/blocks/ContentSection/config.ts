import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'
import { ICON_OPTIONS } from '@/blocks/shared/featureIcons'

const DARK_LIGHT_IMAGE_VARIANTS = ['splitImage', 'overlayFeatures']
const SINGLE_IMAGE_VARIANTS = ['wideImageCta', 'centeredGrid']
const ITEMS_VARIANTS = ['overlayFeatures', 'centeredGrid']
const LINKS_VARIANTS = ['wideImageCta', 'textCta']

export const ContentSection: Block = {
  slug: 'contentSection',
  interfaceName: 'ContentSectionBlock',
  labels: { singular: 'Content Section', plural: 'Content Sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'splitImage',
      label: 'Variant',
      required: true,
      options: [
        { label: 'Split with Image', value: 'splitImage' },
        { label: 'Overlay with Features', value: 'overlayFeatures' },
        { label: 'Wide Image + CTA', value: 'wideImageCta' },
        { label: 'Text + CTA', value: 'textCta' },
        { label: 'Centered Grid', value: 'centeredGrid' },
      ],
    },
    /*
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'brand',
      label: 'Section Theme',
      admin: {
        description: 'Controls the overlay and text color contrast (Overlay with Features variant).',
        condition: (_, siblingData) => siblingData?.variant === 'overlayFeatures',
      },
      options: [
        { label: 'Brand (Primary)', value: 'brand' },
        { label: 'Dark (Navy)', value: 'dark' },
        { label: 'Light (White)', value: 'light' },
      ],
    },
    */
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
      name: 'imageDark',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (Dark Mode)',
      admin: {
        description: 'Image displayed in dark mode',
        condition: (_, siblingData) =>
          DARK_LIGHT_IMAGE_VARIANTS.includes(siblingData?.variant),
      },
    },
    {
      name: 'imageDarkMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (Dark Mode - Mobile)',
      admin: {
        description: 'Optional image displayed in dark mode on mobile devices',
        condition: (_, siblingData) => siblingData?.variant === 'overlayFeatures',
      },
    },
    {
      name: 'imageLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (Light Mode)',
      admin: {
        description: 'Image displayed in light mode',
        condition: (_, siblingData) =>
          DARK_LIGHT_IMAGE_VARIANTS.includes(siblingData?.variant),
      },
    },
    /*
    {
      name: 'imageLightMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Image (Light Mode - Mobile)',
      admin: {
        description: 'Optional image displayed in light mode on mobile devices',
        condition: (_, siblingData) => siblingData?.variant === 'overlayFeatures',
      },
    },
    */
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: {
        description: 'Section image',
        condition: (_, siblingData) =>
          SINGLE_IMAGE_VARIANTS.includes(siblingData?.variant),
      },
    },
    {
      name: 'quote',
      type: 'richText',
      label: 'Quote',
      admin: {
        description: 'Blockquote body text — Split with Image variant',
        condition: (_, siblingData) => siblingData?.variant === 'splitImage',
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
      name: 'quoteAuthor',
      type: 'text',
      label: 'Quote Author',
      admin: {
        description: 'Author citation, e.g. "Jane Smith, CTO"',
        condition: (_, siblingData) => siblingData?.variant === 'splitImage',
      },
    },
    {
      name: 'quoteLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Quote Logo',
      admin: {
        description: 'Company logo shown below the quote',
        condition: (_, siblingData) => siblingData?.variant === 'splitImage',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Feature Items',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => ITEMS_VARIANTS.includes(siblingData?.variant),
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            description:
              'Item heading and body — e.g. "### Fast\\nBuilt for speed from the ground up."',
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
    linkGroup({
      overrides: {
        label: 'CTA Button',
        maxRows: 1,
        admin: {
          condition: (_, siblingData) => LINKS_VARIANTS.includes(siblingData?.variant),
        },
      },
    }),
  ],
}
