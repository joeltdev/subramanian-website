import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industryGrms({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'GRMS — Guest Room Management',
    slug: 'grms',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'GRMS — Guest Room Management',
      richText: rt(
        'Every minute a guest room sits at full climate while empty costs you money.',
        'iNELS GRMS (Guest Room Management System) automates presence-based climate, lighting, and DND/MUR signalling — improving guest experience and cutting room energy costs by up to 40%.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Hotel Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download GRMS Datasheet', url: '/resources/downloads' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'GRMS Guest Room Management — iNELS Hotel Automation',
      description:
        'iNELS GRMS: presence-based climate and lighting automation, DND/MUR integration, PMS sync, and housekeeping dashboard for hotels.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Hotel Energy & Experience Gap',
        variant: 'centeredGrid',
        intro: rt(
          'The hotel energy and experience gap',
          'Hotel rooms are conditioned and lit 24 hours regardless of occupancy. Housekeeping workflows are manual and inefficient. Guests arrive to a cold room with the wrong lighting. These are solvable problems.',
        ),
        items: [
          {
            icon: 'Zap',
            richText: rt3(
              'Rooms conditioned while empty',
              'Full climate between guests and during long absences wastes 30-40% of room energy.',
            ),
          },
          {
            icon: 'Settings',
            richText: rt3(
              'Manual DND/MUR slows housekeeping',
              'Staff knock on occupied rooms or miss turndown windows — guest complaints follow.',
            ),
          },
          {
            icon: 'Sparkles',
            richText: rt3(
              'Cold room on arrival disappoints guests',
              'Without key card pre-conditioning, guests wait 15 minutes for the room to reach comfort.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'GRMS Solution',
        variant: 'split',
        intro: rt(
          'GRMS that checks in before the guest does',
          'iNELS GRMS combines presence detection, PMS integration, and DND/MUR panels to deliver a better guest experience at lower cost.',
        ),
        items: [
          {
            icon: 'Activity',
            richText: rt3(
              'Presence-Based HVAC Setback',
              'PIR and door sensors trigger climate setback within minutes of the room being vacated.',
            ),
          },
          {
            icon: 'MessageCircle',
            richText: rt3(
              'DND/MUR Panel Integration',
              'Electronic DND/MUR panels update housekeeping dashboards in real time — no more knocking.',
            ),
          },
          {
            icon: 'IdCard',
            richText: rt3(
              'Welcome Scene on Key Card Insert',
              'Lights, temperature, and curtains set to guest preferences the moment they enter.',
            ),
          },
          {
            icon: 'Database',
            richText: rt3(
              'PMS Sync (Opera, Protel)',
              'Room status, check-in, and check-out events synchronised with PMS for automated room preparation.',
            ),
          },
          {
            icon: 'Users',
            richText: rt3(
              'Centralised Housekeeping Dashboard',
              'Real-time room status — occupied, vacant, DND, clean, dirty — for all floors in one view.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'GRMS Solutions',
        variant: 'floating',
        intro: rt('Key solutions for hotel guest rooms'),
        items: [
          {
            icon: 'Bolt',
            richText: rt3('Lighting Control', 'Scene-based room lighting with welcome, relax, sleep, and all-off modes.'),
          },
          {
            icon: 'Settings2',
            richText: rt3('Climate Control', 'Presence-adaptive HVAC setback for maximum energy saving between stays.'),
          },
          {
            icon: 'IdCard',
            richText: rt3('GRMS Key Card', 'Energy cut-off and welcome scene activation on key card insert and removal.'),
          },
          {
            icon: 'Database',
            richText: rt3('PMS Integration', 'Opera, Protel, and custom PMS integration for automated room management.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'GRMS ROI',
        stats: [
          { richText: rt3('Up to 40%', 'Room energy saving with GRMS') },
          { richText: rt3('< €200', 'Per room hardware cost') },
          { richText: rt3('250 rooms', 'Grand Hotel Praha deployment') },
          { richText: rt3('< 1 day', 'PMS integration commissioning') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'GRMS CTA',
        richText: rt(
          'Make every room smarter and every stay more comfortable.',
          'Download the GRMS datasheet or speak to our hotel automation team.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Download GRMS Datasheet', url: '/resources/downloads' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Book a Hotel Demo', url: '/get-demo' } },
        ],
      },
    ],
  }
}
