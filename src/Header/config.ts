import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo displayed in the header. Falls back to the default logo if not set.',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Shown in the navigation bar.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enableDirectLink',
              type: 'checkbox',
              label: 'Enable Direct Link',
              defaultValue: false,
              admin: {
                width: '50%',
                description: 'Make the tab label a clickable link.',
              },
            },
            {
              name: 'enableDropdown',
              type: 'checkbox',
              label: 'Enable Dropdown',
              defaultValue: false,
              admin: {
                width: '50%',
                description: 'Show a dropdown panel on hover.',
              },
            },
          ],
        },
        link({
          appearances: false,
          overrides: {
            name: 'link',
            admin: {
              hideGutter: true,
              condition: (_, siblingData) => Boolean(siblingData?.enableDirectLink),
            },
          },
        }),
        {
          name: 'description',
          type: 'textarea',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableDropdown),
            description: 'Short description shown in the dropdown panel.',
          },
        },
        {
          name: 'descriptionLinks',
          type: 'array',
          label: 'Description Links',
          maxRows: 4,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableDropdown),
            description: 'Links shown below the description text.',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
        {
          name: 'navItems',
          type: 'array',
          label: 'Nav Items',
          maxRows: 6,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableDropdown),
            description: 'Items displayed in the dropdown panel.',
          },
          fields: [
            {
              name: 'listLinks',
              type: 'group',
              admin: {
                hideGutter: true,
                condition: (_, siblingData) => siblingData?.style === 'list',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  label: 'Tag',
                },
                {
                  name: 'links',
                  type: 'array',
                  fields: [
                    link({
                      appearances: false,
                    }),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'enableMenuCta',
      type: 'checkbox',
      label: 'Enable Menu CTA',
      defaultValue: false,
      admin: {
        description: 'Show a CTA button in the header navigation.',
      },
    },
    link({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'menuCta',
        label: 'Menu CTA',
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.enableMenuCta),
          description: 'Optional CTA button shown in the header navigation.',
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
