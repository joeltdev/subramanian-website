import React from 'react'
import type { FeatureCardsBlock as FeatureCardsBlockType } from '@/payload-types'
import { FloatingFeatureCards } from './Floating'
import { OutlinedFeatureCards } from './Outlined'
import { GridFeatureCards } from './Grid'

const variants = {
  floating: FloatingFeatureCards,
  outlined: OutlinedFeatureCards,
  grid: GridFeatureCards,
}

export const FeatureCardsBlock: React.FC<FeatureCardsBlockType & { disableInnerContainer?: boolean }> = (
  props,
) => {
  const variant = (props.variant ?? 'floating') as keyof typeof variants
  const Variant = variants[variant] ?? FloatingFeatureCards
  return <Variant {...props} />
}
