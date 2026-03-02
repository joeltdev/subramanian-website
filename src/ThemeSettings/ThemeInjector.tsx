import { getCachedGlobal } from '@/utilities/getGlobals'
import { brandColorPresets, defaultCustomizableTokens, OKLCH_REGEX } from '@/tokens/design-tokens'
import type { ThemeSetting } from '@/payload-types'

/**
 * ThemeInjector — Server Component, no client JS.
 *
 * Reads ThemeSettings global, generates CSS custom property overrides,
 * and injects a <style> tag into <head>. Runs at request time, cached
 * via Next.js unstable_cache and invalidated when Payload saves changes.
 *
 * SECURITY: Custom colour inputs are validated against OKLCH_REGEX before
 * injection. Invalid values fall back to the selected preset or defaults.
 *
 * PERFORMANCE: Returns null (no <style> tag) when settings match defaults.
 * The common case — sites that never touch ThemeSettings — has zero overhead.
 */
export async function ThemeInjector() {
  const settings = (await getCachedGlobal('theme-settings', 0)()) as ThemeSetting | null

  const primaryLight = resolveLight(settings)
  const primaryDark  = resolveDark(settings)
  const radius       = settings?.radiusPreset ?? defaultCustomizableTokens.radius

  const hasOverrides =
    primaryLight !== defaultCustomizableTokens.primaryLight ||
    primaryDark  !== defaultCustomizableTokens.primaryDark  ||
    radius       !== defaultCustomizableTokens.radius

  if (!hasOverrides) return null

  const css = [
    `:root { --primary: ${primaryLight}; --ring: ${primaryLight}; --radius: ${radius}; }`,
    `[data-theme='dark'] { --primary: ${primaryDark}; --ring: ${primaryDark}; }`,
  ].join('\n')

  return <style id="cms-theme-overrides" dangerouslySetInnerHTML={{ __html: css }} />
}

function resolveLight(settings: ThemeSetting | null): string {
  if (settings?.enableCustomPrimary && settings?.customPrimaryLight) {
    // Sanitize: only inject if it's a valid OKLCH value
    if (OKLCH_REGEX.test(settings.customPrimaryLight)) {
      return settings.customPrimaryLight
    }
  }
  if (settings?.primaryColorPreset) return settings.primaryColorPreset
  return defaultCustomizableTokens.primaryLight
}

function resolveDark(settings: ThemeSetting | null): string {
  if (settings?.enableCustomPrimary && settings?.customPrimaryDark) {
    if (OKLCH_REGEX.test(settings.customPrimaryDark)) {
      return settings.customPrimaryDark
    }
  }
  if (settings?.primaryColorPreset) {
    const preset = brandColorPresets.find(p => p.value === settings.primaryColorPreset)
    if (preset) return preset.darkValue
  }
  return defaultCustomizableTokens.primaryDark
}
