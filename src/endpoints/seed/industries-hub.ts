import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = {
  hero: number
  villa: number
  residentialBuilding: number
  commercial: number
  grms: number
  hresk: number
  smartCity: number
  factory: number
  logo: number
}

export function industriesHub(args: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Industries',
    slug: 'industries',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Industries We Serve',
      richText: rt(
        'Smart buildings for every sector.',
        'From a private villa to a smart city district — iNELS delivers automation solutions tailored to the specific demands of each industry.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Find Your Industry', url: '#industries' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Talk to an Expert', url: '/get-demo' } },
      ],
      mediaPreview: args.hero,
    },
    meta: {
      title: 'Industries — iNELS Smart Building Automation',
      description:
        'iNELS smart building solutions for villas, residential buildings, commercial, hospitality (GRMS/HRESK), smart cities, and smart factories.',
    },
    layout: [
      {
        blockType: 'mediaCards',
        blockName: 'Industry Cards',
        intro: rt(
          'Choose your industry',
          "Explore solutions designed around your sector's specific challenges and regulations.",
        ),
        items: [
          {
            media: args.villa,
            richText: rt3('Villas & Apartments', 'Luxury automation for private residences and multi-unit developments.'),
            link: { type: 'custom', url: '/industries/villas-apartments' },
          },
          {
            media: args.residentialBuilding,
            richText: rt3('Residential Buildings', 'Scalable smart home deployment across entire apartment blocks.'),
            link: { type: 'custom', url: '/industries/residential-buildings' },
          },
          {
            media: args.commercial,
            richText: rt3('Commercial', 'HVAC, lighting, and access control for offices, retail, and mixed-use.'),
            link: { type: 'custom', url: '/industries/commercial' },
          },
          {
            media: args.grms,
            richText: rt3(
              'GRMS — Hotel Guest Rooms',
              'Guest Room Management Systems that improve experience and cut energy.',
            ),
            link: { type: 'custom', url: '/industries/grms' },
          },
          {
            media: args.hresk,
            richText: rt3('HRESK — Hotel Energy', 'Hotel Room Energy Saving Kits with measurable ROI per room.'),
            link: { type: 'custom', url: '/industries/hresk' },
          },
          {
            media: args.smartCity,
            richText: rt3(
              'Smart Cities',
              'District-scale infrastructure automation from street lighting to utilities.',
            ),
            link: { type: 'custom', url: '/industries/smart-cities' },
          },
          {
            media: args.factory,
            richText: rt3(
              'Smart Factories',
              'Industrial automation with open protocols, safety integration, and OT/IT convergence.',
            ),
            link: { type: 'custom', url: '/industries/smart-factories' },
          },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Industries CTA',
        richText: rt(
          "Don't see your use case?",
          'iNELS has deployed in 40+ countries across dozens of verticals. Tell us your challenge.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Contact an Expert', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Read Case Studies', url: '/resources/case-studies' } },
        ],
      },
    ],
  }
}
