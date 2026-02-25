import React from 'react'
import type { ContentSectionBlock as ContentSectionBlockType } from '@/payload-types'
import { SplitImageContentSection } from './SplitImage'
import { OverlayFeaturesContentSection } from './OverlayFeatures'
import { WideImageCtaContentSection } from './WideImageCta'
import { TextCtaContentSection } from './TextCta'
import { CenteredGridContentSection } from './CenteredGrid'

const variants = {
  splitImage: SplitImageContentSection,
  overlayFeatures: OverlayFeaturesContentSection,
  wideImageCta: WideImageCtaContentSection,
  textCta: TextCtaContentSection,
  centeredGrid: CenteredGridContentSection,
}

export const ContentSectionBlock: React.FC<
  ContentSectionBlockType & { disableInnerContainer?: boolean }
> = (props) => {
  const Variant =
    variants[(props.variant ?? 'splitImage') as keyof typeof variants] ?? SplitImageContentSection
  return <Variant {...props} />
}
