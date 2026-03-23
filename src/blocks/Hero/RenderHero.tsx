import React from 'react'

import type { Page } from '@/payload-types'

import { Section1Hero } from '@/blocks/Hero/Section1'
import { Section2Hero } from '@/blocks/Hero/Section2'
import { ManifestoHero } from '@/blocks/Hero/Manifesto'

const heroes = {
  section1: Section1Hero,
  section2: Section2Hero,
  manifesto: ManifestoHero,
}

export const RenderHero: React.FC<Page['hero'] & { slug?: string }> = (props) => {
  const { type, slug } = props || {}

  let HeroToRender = type && type !== 'none' ? heroes[type] : null

  // Force ManifestoHero for the Tharoor Manifesto page if no specific hero is set or if it's the default
  if (slug === 'tharoor-manifesto' && (!type || type === 'section1')) {
    HeroToRender = ManifestoHero
  }

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
