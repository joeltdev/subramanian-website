import React from 'react'
import type { FaqBlock as FaqBlockType } from '@/payload-types'
import { SingleFaq } from './Single'
import { SplitFaq } from './Split'

const variants = {
  single: SingleFaq,
  split: SplitFaq,
}

export const FaqBlock: React.FC<FaqBlockType & { disableInnerContainer?: boolean }> = (props) => {
  const variant = (props.variant ?? 'single') as keyof typeof variants
  const Variant = variants[variant] ?? SingleFaq
  return <Variant {...props} />
}
