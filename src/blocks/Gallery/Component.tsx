import React from 'react'

import type { GalleryBlock as T } from '@/payload-types'
import { ParallaxGallery } from './Parallax'
import { ScrollableGallery } from './Scrollable'
import { AppleGallery } from './Apple'

const sections = {
  parallax: ParallaxGallery,
  scrollable: ScrollableGallery,
  apple: AppleGallery,
}

export const GalleryBlock: React.FC<T & { disableInnerContainer?: boolean }> = (props) => {
  const Section = sections[props.variant as keyof typeof sections]
  if (!Section) return null
  return <Section {...props} />
}
