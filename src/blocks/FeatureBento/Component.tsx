import React from 'react'
import type { FeatureBentoBlock as FeatureBentoBlockType } from '@/payload-types'
import { StatsFeatureBento } from './Stats'
import { MetricsFeatureBento } from './Metrics'
import { PanelsFeatureBento } from './Panels'
import { AccordionFeatureBento } from './Accordion'

const variants = {
  stats: StatsFeatureBento,
  metrics: MetricsFeatureBento,
  panels: PanelsFeatureBento,
  accordion: AccordionFeatureBento,
}

export const FeatureBentoBlock: React.FC<FeatureBentoBlockType & { disableInnerContainer?: boolean }> = (
  props,
) => {
  const variant = (props.variant ?? 'stats') as keyof typeof variants
  const Variant = variants[variant] ?? StatsFeatureBento
  return <Variant {...props} />
}
