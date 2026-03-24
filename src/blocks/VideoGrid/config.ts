import type { Block } from 'payload'

export const VideoGrid: Block = {
  slug: 'videoGrid',
  interfaceName: 'VideoGridBlock',
  labels: {
    singular: 'Video Grid',
    plural: 'Video Grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (Optional)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description (Optional)',
    },
    {
      name: 'videos',
      type: 'array',
      label: 'Videos',
      minRows: 1,
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'YouTube URL',
          required: true,
          admin: {
            description: 'Paste any YouTube link (watch, share, embed, shorts).',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Video Title',
          required: true,
        },
      ],
    },
  ],
}
