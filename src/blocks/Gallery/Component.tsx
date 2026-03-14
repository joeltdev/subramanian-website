import React from 'react'

import type { GalleryBlock as T } from '@/payload-types'
import { GalleryGrid } from './Grid'

export const GalleryBlock: React.FC<T & { disableInnerContainer?: boolean }> = (props) => {
  return <GalleryGrid {...props} />
}
