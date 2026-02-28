import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const CaseStudiesHighlight: Block = {
  slug: 'caseStudiesHighlight',
  interfaceName: 'CaseStudiesHighlightBlock',
  labels: { singular: 'Case Studies Highlight', plural: 'Case Studies Highlights' },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: { description: 'Section heading and supporting text' },
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
      name: 'caseStudies',
      type: 'relationship',
      hasMany: true,
      relationTo: 'case-studies',
      required: true,
      admin: { description: 'Case studies to display in the scrolling grid (minimum 3 recommended)' },
    },
  ],
}
