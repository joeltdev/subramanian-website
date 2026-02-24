import type { Block } from 'payload'

export const LogoCloud: Block = {
  slug: 'logoCloud',
  interfaceName: 'LogoCloudBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'section1',
      label: 'Style',
      options: [
        { label: 'Static Grid', value: 'section1' },
        { label: 'Infinite Slider', value: 'section3' },
      ],
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description:
          'Label shown above or beside the logos (e.g. "Trusted by leading teams")',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Logo Clouds',
    singular: 'Logo Cloud',
  },
}
