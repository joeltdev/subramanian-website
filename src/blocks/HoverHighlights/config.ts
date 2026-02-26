import type { Block } from 'payload'
import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'

export const HoverHighlights: Block = {
  slug: 'hoverHighlights',
  interfaceName: 'HoverHighlightsBlock',
  labels: { singular: 'Hover Highlights', plural: 'Hover Highlights' },
  fields: [
    {
      name: 'beforeHighlights',
      type: 'textarea',
      label: 'Before Text',
      admin: { description: 'Short text displayed above the highlights list' },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights',
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Highlight Text',
          required: true,
          admin: { description: 'Large heading-sized label for this highlight' },
        },
        {
          name: 'mediaTop',
          type: 'upload',
          relationTo: 'media',
          label: 'Top Image',
          admin: { description: 'Primary image shown when this highlight is hovered' },
        },
        {
          name: 'mediaBottom',
          type: 'upload',
          relationTo: 'media',
          label: 'Bottom Image',
          admin: { description: 'Secondary image shown offset below the primary' },
        },
        link({ disableLabel: true, appearances: false }),
      ],
    },
    {
      name: 'afterHighlights',
      type: 'textarea',
      label: 'After Text',
      admin: { description: 'Short text displayed below the highlights list' },
    },
    linkGroup({
      overrides: {
        label: 'CTA Button',
        maxRows: 1,
      },
    }),
  ],
}
