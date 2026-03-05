import React, { Fragment } from 'react'
import type { Product } from '@/payload-types'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { FeatureCardsBlock } from '@/blocks/FeatureCards/Component'
import { FeatureShowcaseBlock } from '@/blocks/FeatureShowcase/Component'
import { ContentSectionBlock } from '@/blocks/ContentSection/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ArticleGridBlock } from '@/blocks/ArticleGrid/Component'
import { YouTubeBlock } from '@/blocks/YouTube/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'

const blockComponents = {
  cta: CallToActionBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  logoCloud: LogoCloudBlock,
  featureCards: FeatureCardsBlock,
  featureShowcase: FeatureShowcaseBlock,
  contentSection: ContentSectionBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  articleGrid: ArticleGridBlock,
  youtube: YouTubeBlock,
  gallery: GalleryBlock,
}

export const RenderProductBlocks: React.FC<{
  blocks: NonNullable<Product['layout']>
}> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (Block) {
            return (
              <div key={index}>
                {/* @ts-expect-error block union types */}
                <Block {...block} disableInnerContainer />
              </div>
            )
          }
        }
        return null
      })}
    </Fragment>
  )
}
