import React from 'react'

import type { Page } from '@/payload-types'

import { Section1Hero } from '@/blocks/Hero/Section1'
import { Section2Hero } from '@/blocks/Hero/Section2'

const heroes = {
  section1: Section1Hero,
  section2: Section2Hero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
