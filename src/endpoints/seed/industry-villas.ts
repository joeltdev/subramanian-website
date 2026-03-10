import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industryVillas({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Villas & Apartments',
    slug: 'villas-apartments',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Villas & Apartments',
      richText: rt(
        'Your home should work as hard as you do — without you lifting a finger.',
        'iNELS delivers whole-home automation for villas and premium apartments: lighting scenes, climate comfort, security, shading, and AV — all from one app.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Find an Installer', url: '/find-installer' } },
      ],
    },
    meta: {
      title: 'Villas & Apartments — iNELS Smart Home Automation',
      description:
        'iNELS whole-home automation for villas and premium apartments: lighting, climate, security, shading, and AV — all from one app.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Residential Challenges',
        variant: 'centeredGrid',
        intro: rt(
          'The complexity trap in luxury residential',
          'High-end properties require seamless integration of dozens of systems. Without a unified platform, each system works in isolation — and residents end up managing four different apps and three remotes.',
        ),
        items: [
          {
            icon: 'Layers',
            richText: rt3(
              'Complexity of multi-system integration',
              'Lighting, climate, AV, security, shading — each from a different supplier with no integration.',
            ),
          },
          {
            icon: 'Settings',
            richText: rt3(
              'Retrofit constraints in existing properties',
              'Rewiring a finished villa is impractical. Most automation systems require extensive cabling.',
            ),
          },
          {
            icon: 'Globe',
            richText: rt3(
              'Residents demand app control and voice commands',
              'Premium residents expect Apple HomeKit, Google Home, or Alexa. Proprietary apps are not acceptable.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Villa Solution',
        variant: 'split',
        intro: rt(
          'Premium living, intelligently automated',
          'iNELS RF wireless technology enables whole-home automation without rewiring — installed in days, not weeks.',
        ),
        items: [
          {
            icon: 'Sparkles',
            richText: rt3(
              'Whole-Home Scene Control',
              'One tap sets the perfect environment for morning, dinner, movie night, or sleep.',
            ),
          },
          {
            icon: 'Activity',
            richText: rt3(
              'Multi-Room AV Integration',
              'iNELS connects with leading AV systems for unified music and video control.',
            ),
          },
          {
            icon: 'Shield',
            richText: rt3(
              'Security & Access',
              'Smart locks, video intercom, cameras, and alarm — all in the iNELS app.',
            ),
          },
          {
            icon: 'IdCard',
            richText: rt3(
              'Guest Mode Provisioning',
              'Temporary app access for housekeepers, guests, or contractors — expires automatically.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'Villa Solutions',
        variant: 'floating',
        intro: rt('Key solutions for villas & apartments'),
        items: [
          {
            icon: 'Bolt',
            richText: rt3('Lighting Control', 'Scene-based lighting automation across every room and outdoor zone.'),
          },
          {
            icon: 'Layers',
            richText: rt3('Shading Automation', 'Motorised blinds and curtains integrated with sun tracking and scenes.'),
          },
          {
            icon: 'Settings2',
            richText: rt3('Climate Control', 'Individual room thermostats with presence-based scheduling.'),
          },
          {
            icon: 'Globe',
            richText: rt3('Remote Control', 'Full home control from anywhere via the iNELS mobile app.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Villa ROI',
        stats: [
          { richText: rt3('40%', 'Energy saving vs unautomated homes') },
          { richText: rt3('1 day', 'Commissioning for a 4-bed villa') },
          { richText: rt3('10,000+', 'Premium residences automated') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Villa CTA',
        richText: rt(
          'Design your perfect home automation.',
          'Speak to a certified residential integrator or book a showroom demonstration.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Find an Installer', url: '/find-installer' } },
        ],
      },
    ],
  }
}
