import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industryResidential({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Residential Buildings',
    slug: 'residential-buildings',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Residential Buildings',
      richText: rt(
        'Deploy smart home technology across an entire apartment block — in days, not months.',
        'iNELS RF and KNX solutions scale from a single unit to hundreds, with centralised management for the building manager and individual app control for every resident.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Developer Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Spec Pack', url: '/resources/downloads' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'Residential Buildings — iNELS Smart Building Automation',
      description:
        'iNELS RF and KNX smart home solutions for residential developers: scalable per-unit deployment, centralised management, and resident app control.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Residential Developer Challenges',
        variant: 'centeredGrid',
        intro: rt(
          'The developer deployment problem',
          'Per-unit rollout at traditional speed adds weeks to project timelines and costs. Meanwhile, modern buyers expect smart home features as standard — not as a paid upgrade.',
        ),
        items: [
          {
            icon: 'Settings',
            richText: rt3(
              'Per-unit rollout is too slow',
              'Traditional wired smart home requires days per apartment. That multiplies across 80 units.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Building managers need centralised oversight',
              'Individual unit systems provide no building-level view of energy, faults, or access.',
            ),
          },
          {
            icon: 'Users',
            richText: rt3(
              'Residents expect modern features',
              'App control, voice commands, and energy monitoring are now expected by buyers, not desired.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Residential Solution',
        variant: 'split',
        intro: rt(
          'Scalable smart home deployment for developers',
          'iNELS RF wireless modules commission in minutes per unit. Central building tools give managers full visibility while residents enjoy independent app control.',
        ),
        items: [
          {
            icon: 'Database',
            richText: rt3(
              'Central Building Management Console',
              'Monitor energy, access, and faults across all units from a single dashboard.',
            ),
          },
          {
            icon: 'Globe',
            richText: rt3(
              'Per-Unit App Access',
              'Every resident gets their own iNELS app profile — independent control, shared infrastructure.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Energy Sub-Metering per Unit',
              'Individual energy data per apartment for accurate billing and reporting.',
            ),
          },
          {
            icon: 'Zap',
            richText: rt3(
              'RF Wireless — No Rework',
              'iNELS RF modules install behind existing switches — no new wiring, no rework.',
            ),
          },
          {
            icon: 'Fingerprint',
            richText: rt3(
              'Intercom & Access Control',
              'Building-wide video intercom and smart access integrated into the resident app.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'Residential Solutions',
        variant: 'floating',
        intro: rt('Key solutions for residential buildings'),
        items: [
          {
            icon: 'Bolt',
            richText: rt3('Lighting Control', 'Per-unit scene automation and presence-based control for every apartment.'),
          },
          {
            icon: 'Settings2',
            richText: rt3('Climate Control', 'Individual thermostats per unit with centralised building-level monitoring.'),
          },
          {
            icon: 'BarChart',
            richText: rt3('Energy Management', 'Sub-metering per unit with automated monthly billing reports.'),
          },
          {
            icon: 'Fingerprint',
            richText: rt3('Access Control', 'Smart entry, video intercom, and resident access management.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Residential ROI',
        stats: [
          { richText: rt3('80 units in 3 days', 'Novák Residences deployment record') },
          { richText: rt3('40% faster', 'vs previous project timeline') },
          { richText: rt3('€150', 'Per unit hardware cost') },
          { richText: rt3('Zero callbacks', 'In first 6 months post-deployment') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Residential CTA',
        richText: rt(
          'Scale smart home across your entire development.',
          'Talk to our residential development team or download the developer specification pack.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Developer Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Spec Pack', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
