import type { Block } from 'payload'

export const YouTube: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: { singular: 'YouTube Video', plural: 'YouTube Videos' },
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
      label: 'Video Title (optional)',
      admin: {
        description: 'Used for the iframe title attribute (accessibility).',
      },
    },
  ],
}

