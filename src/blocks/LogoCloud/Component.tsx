import React from 'react'

import type { LogoCloudBlock as LogoCloudBlockType } from '@/payload-types'
import { Section1LogoCloud } from './Section1'
import { Section3LogoCloud } from './Section3'

const sections = {
  section1: Section1LogoCloud,
  section3: Section3LogoCloud,
}

export const LogoCloudBlock: React.FC<LogoCloudBlockType & { disableInnerContainer?: boolean }> = (
  props,
) => {
  const { type } = props

  if (!type || !(type in sections)) return null

  const Section = sections[type as keyof typeof sections]

  return <Section {...props} />
}
