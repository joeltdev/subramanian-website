/**
 * Design tokens — JavaScript source of truth.
 *
 * Parallel to globals.css but for JS contexts: Payload config, email
 * templates, server-side inline styles, framer-motion values.
 *
 * Keep in sync with globals.css manually. Convention enforced by code review.
 *
 * NOTE: Option values for Payload select fields are stored in the DB.
 * Changing a `value` string here requires a DB migration for existing content.
 * Use stable human-readable slugs for future iterations.
 */

export const brandPalette = {
  50:  'oklch(97.7% 0.013 236.62)',
  100: 'oklch(95.1% 0.026 236.62)',
  200: 'oklch(90.1% 0.05  237)',
  300: 'oklch(82.8% 0.093 230.59)',
  400: 'oklch(74.6% 0.16  232.66)',
  500: 'oklch(68.5% 0.169 237.32)',
  600: 'oklch(58.8% 0.158 241.97)',
  700: 'oklch(50%   0.134 242.75)',
  800: 'oklch(39.3% 0.095 240.88)',
  900: 'oklch(30.8% 0.066 243.16)',
  950: 'oklch(20.5% 0.037 243.03)',
} as const

export const defaultCustomizableTokens = {
  primaryLight: brandPalette[500],  // --primary in :root
  primaryDark:  brandPalette[400],  // --primary in [data-theme='dark']
  radius:       '0',                // --radius
} as const

/**
 * Curated brand colour presets exposed to content editors.
 * Editors never see raw OKLCH — they pick a named preset.
 *
 * Each preset provides paired light/dark values calibrated for contrast.
 * darkValue is automatically applied in [data-theme='dark'].
 */
export const brandColorPresets = [
  { label: 'Azure (Default)', value: brandPalette[500], darkValue: brandPalette[400] },
  { label: 'Azure Deep',      value: brandPalette[600], darkValue: brandPalette[500] },
  { label: 'Slate',   value: 'oklch(55% 0.05 240)',  darkValue: 'oklch(70% 0.05 240)' },
  { label: 'Emerald', value: 'oklch(55% 0.15 165)',  darkValue: 'oklch(70% 0.15 165)' },
  { label: 'Rose',    value: 'oklch(60% 0.2 10)',    darkValue: 'oklch(75% 0.2 10)' },
] as const

export const radiusPresets = [
  { label: 'Sharp (Default)', value: '0' },
  { label: 'Soft (4px)',      value: '0.25rem' },
  { label: 'Round (8px)',     value: '0.5rem' },
  { label: 'Pill (16px)',     value: '1rem' },
] as const

/** The shape ThemeInjector reads from Payload and injects as :root overrides */
export type CustomizableTokens = {
  primaryLight: string
  primaryDark:  string
  radius:       string
}

/** Strict OKLCH validation — used in ThemeInjector to sanitize custom colour inputs */
export const OKLCH_REGEX = /^oklch\(\s*[\d.]+%\s+[\d.]+\s+[\d.]+\s*\)$/i
