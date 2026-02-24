import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ICON_OPTIONS } from '@/blocks/shared/featureIcons'

export const FeatureBento: Block = {
  slug: 'featureBento',
  interfaceName: 'FeatureBentoBlock',
  labels: { singular: 'Feature Bento', plural: 'Feature Bentos' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'stats',
      label: 'Variant',
      required: true,
      options: [
        { label: 'Stats & Icons', value: 'stats' },
        { label: 'Map & Metrics', value: 'metrics' },
        { label: 'Image Panels', value: 'panels' },
        { label: 'Accordion Gallery', value: 'accordion' },
      ],
    },
    // ── Stat text (stats + metrics variants) ──────────────────────────────────
    {
      name: 'stat',
      type: 'text',
      label: 'Stat / Uptime Text',
      admin: {
        description: "Key metric to highlight — e.g. '99.9% Uptime', '10 000+ Connected Devices', '30% Energy Savings'",
        condition: (_, s) => ['stats', 'metrics'].includes(s?.variant),
      },
    },
    // ── Intro (accordion variant only) ────────────────────────────────────────
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: {
        description: "Section heading and supporting text — e.g. 'Smart automation for modern buildings'",
        condition: (_, s) => s?.variant === 'accordion',
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
    // ── Items array (stats variant — section8) ────────────────────────────────
    {
      name: 'items',
      type: 'array',
      label: 'Feature Items',
      minRows: 1,
      maxRows: 5,
      admin: {
        condition: (_, s) => s?.variant === 'stats',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: "Short feature label — e.g. 'Remote Control', 'KNX Integration', 'Energy Monitoring'",
          },
        },
        {
          name: 'description',
          type: 'richText',
          admin: {
            description: "One or two sentences — e.g. 'Manage every INELS device from a single dashboard, anywhere in the world.'",
          },
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
    // ── Panel items (metrics variant — section9) ──────────────────────────────
    {
      name: 'panelItems',
      type: 'array',
      label: 'Panel Items',
      maxRows: 3,
      admin: {
        description: 'Up to 3 panels shown beside map / chart decorations',
        condition: (_, s) => s?.variant === 'metrics',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: "Badge text — e.g. 'Real-time device tracking'",
          },
        },
        {
          name: 'heading',
          type: 'richText',
          admin: {
            description: "Panel heading — e.g. 'Live device status across all sites'",
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
      ],
    },
    // ── Image panels (panels variant — section11) ─────────────────────────────
    {
      name: 'imagePanels',
      type: 'array',
      label: 'Image Panels',
      maxRows: 4,
      admin: {
        condition: (_, s) => s?.variant === 'panels',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: "Short feature label — e.g. 'Remote Control', 'KNX Integration'",
          },
        },
        {
          name: 'description',
          type: 'richText',
          admin: {
            description: "One or two sentences — e.g. 'Manage every INELS device from a single dashboard, anywhere in the world.'",
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
          name: 'imageDark',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image shown in dark mode' },
        },
        {
          name: 'imageLight',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image shown in light mode' },
        },
      ],
    },
    // ── Accordion items (accordion variant — section12) ───────────────────────
    {
      name: 'accordionItems',
      type: 'array',
      label: 'Accordion Items',
      minRows: 1,
      maxRows: 6,
      admin: {
        condition: (_, s) => s?.variant === 'accordion',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: ICON_OPTIONS,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: "Short feature label — e.g. 'Remote Control', 'KNX Integration'",
          },
        },
        {
          name: 'description',
          type: 'richText',
          admin: {
            description: "One or two sentences — e.g. 'Manage every INELS device from a single dashboard, anywhere in the world.'",
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Preview image shown when this item is active' },
        },
      ],
    },
  ],
}
