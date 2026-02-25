import React from 'react'

import type { IntegrationsBlock as IntegrationsBlockType } from '@/payload-types'
import { GridIntegrations } from './Grid'
import { TilesIntegrations } from './Tiles'
import { SliderIntegrations } from './Slider'

const variants = {
  grid: GridIntegrations,
  tiles: TilesIntegrations,
  slider: SliderIntegrations,
}

export const IntegrationsBlock: React.FC<IntegrationsBlockType & { disableInnerContainer?: boolean }> = (
  props,
) => {
  const variant = (props.variant ?? 'grid') as keyof typeof variants
  const Variant = variants[variant] ?? GridIntegrations
  return <Variant {...props} />
}
