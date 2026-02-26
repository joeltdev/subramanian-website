import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      maxRows: 6,
      admin: {
        description: 'Footer navigation columns (e.g. Product, Company, Legal)',
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Column Heading',
          required: true,
          admin: {
            description: 'Column title, e.g. "Product" or "Company"',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          maxRows: 10,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      maxRows: 8,
      admin: {
        description: 'Social media links shown in the footer header row',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'X / Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Threads', value: 'threads' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'Full URL to the social profile',
          },
        },
      ],
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      label: 'Newsletter Heading',
      admin: {
        description: 'Label above the newsletter email input, e.g. "Newsletter"',
      },
    },
    {
      name: 'newsletterNote',
      type: 'text',
      label: 'Newsletter Note',
      admin: {
        description: 'Helper text below the email input, e.g. "Don\'t miss any update!"',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      admin: {
        description: 'e.g. "© 2024 Company, All rights reserved"',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
