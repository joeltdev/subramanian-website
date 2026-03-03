// src/blocks/ParallaxShowcase/Component.tsx
import React from 'react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import { ParallaxShowcaseCarousel } from './index'

export const ParallaxShowcaseBlockComponent: React.FC<
  ParallaxShowcaseBlock & { disableInnerContainer?: boolean }
> = (props) => {
  return <ParallaxShowcaseCarousel {...props} />
}
