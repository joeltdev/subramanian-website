import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { FeatureCardsBlock } from '@/blocks/FeatureCards/Component'
import { FeatureShowcaseBlock } from '@/blocks/FeatureShowcase/Component'
import { FeatureBentoBlock } from '@/blocks/FeatureBento/Component'
import { IntegrationsBlock } from '@/blocks/Integrations/Component'
import { ContentSectionBlock } from '@/blocks/ContentSection/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { CaseStudiesHighlightBlock } from '@/blocks/CaseStudiesHighlight/Component'
import { HoverHighlightsBlock } from '@/blocks/HoverHighlights/Component'
import { ArticleGridBlock } from '@/blocks/ArticleGrid/Component'
import { MediaCardsBlock } from '@/blocks/MediaCards/Component'
import { YouTubeBlock } from '@/blocks/YouTube/Component'
import { ParallaxShowcaseBlockComponent } from '@/blocks/ParallaxShowcase/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { FaqBlock } from '@/blocks/Faq/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  logoCloud: LogoCloudBlock,
  featureCards: FeatureCardsBlock,
  featureShowcase: FeatureShowcaseBlock,
  featureBento: FeatureBentoBlock,
  integrations: IntegrationsBlock,
  contentSection: ContentSectionBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  hoverHighlights: HoverHighlightsBlock,
  caseStudiesHighlight: CaseStudiesHighlightBlock,
  articleGrid: ArticleGridBlock,
  mediaCards: MediaCardsBlock,
  youtube: YouTubeBlock,
  parallaxShowcase: ParallaxShowcaseBlockComponent,
  gallery: GalleryBlock,
  faq: FaqBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
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

  return null
}
