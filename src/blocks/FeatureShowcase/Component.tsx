import React from 'react'
import type { FeatureShowcaseBlock as FeatureShowcaseBlockType } from '@/payload-types'
import { SplitFeatureShowcase } from './Split'
import { PerspectiveFeatureShowcase } from './Perspective'

const variants = {
  split: SplitFeatureShowcase,
  perspective: PerspectiveFeatureShowcase,
}

export const FeatureShowcaseBlock: React.FC<FeatureShowcaseBlockType & { disableInnerContainer?: boolean }> = (
  props,
) => {
  const variant = (props.variant ?? 'split') as keyof typeof variants
  const Variant = variants[variant] ?? SplitFeatureShowcase
  return <Variant {...props} />
}
