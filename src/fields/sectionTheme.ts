import type { Field } from 'payload'

export const sectionTheme: Field = {
  name: 'sectionTheme',
  type: 'select',
  label: 'Section Background',
  defaultValue: 'default',
  admin: {
    position: 'sidebar',
    description: 'Override the section background. "Default" inherits from the page theme.',
  },
  options: [
    { label: 'Default (inherit)', value: 'default' },
    { label: 'Light',  value: 'light' },
    { label: 'Dark',   value: 'dark' },
    { label: 'Brand',  value: 'brand' },
  ],
}
