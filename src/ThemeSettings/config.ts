import type { GlobalConfig } from 'payload'
import { brandColorPresets, radiusPresets } from '@/tokens/design-tokens'
import { revalidateTheme } from './hooks/revalidateTheme'

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme & Brand',
  // read: () => true — intentional. ThemeInjector is a Server Component that
  // reads this global server-side (no auth token). All values are non-sensitive
  // styling data. Write access remains restricted to authenticated admins.
  access: { read: () => true },
  admin: {
    description: 'Control site-wide brand colours, corner radius, and visual appearance.',
    group: 'Site Settings',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Brand Colour',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'primaryColorPreset',
          type: 'select',
          label: 'Brand Colour',
          defaultValue: brandColorPresets[0].value,
          options: brandColorPresets.map(p => ({ label: p.label, value: p.value })),
          admin: {
            description: 'The dark-mode variant is set automatically for each preset.',
          },
        },
        {
          name: 'enableCustomPrimary',
          type: 'checkbox',
          label: 'Use custom OKLCH value instead',
          defaultValue: false,
          admin: { description: 'Advanced — override with a raw OKLCH colour value.' },
        },
        {
          name: 'customPrimaryLight',
          label: 'Custom Primary (Light mode)',
          type: 'text',
          admin: {
            condition: (_, s) => Boolean(s?.enableCustomPrimary),
            placeholder: 'oklch(68.5% 0.169 237.32)',
            description: 'Format: oklch(L% C H) — no deg suffix on hue.',
          },
        },
        {
          name: 'customPrimaryDark',
          label: 'Custom Primary (Dark mode)',
          type: 'text',
          admin: {
            condition: (_, s) => Boolean(s?.enableCustomPrimary),
            placeholder: 'oklch(74.6% 0.16 232.66)',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Corner Radius',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'radiusPreset',
          type: 'select',
          label: 'Corner Radius',
          defaultValue: radiusPresets[0].value,
          options: radiusPresets.map(p => ({ label: p.label, value: p.value })),
          admin: { description: 'Controls border-radius on cards, inputs, and buttons site-wide.' },
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateTheme] },
}
