import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = {
  hero: number
  logo: number
  lighting: number
  shading: number
  climate: number
  energy: number
  remote: number
  integration: number
}

export function solutionsHub(args: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Solutions',
    slug: 'solutions',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Intelligent Building Solutions',
      richText: rt(
        'Every building need. One integrated platform.',
        'iNELS delivers end-to-end automation for lighting, climate, shading, energy, remote access, and open integration — engineered to work together from day one.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Explore Solutions', url: '#solutions' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Book a Demo', url: '/get-demo' } },
      ],
      mediaPreview: args.hero,
    },
    meta: {
      title: 'Solutions — iNELS Smart Building Automation',
      description: 'Explore iNELS lighting, shading, climate, energy, remote control, and open integration solutions for any building type.',
    },
    layout: [
      {
        blockType: 'mediaCards',
        blockName: 'Solutions Grid',
        intro: rt('Six solutions. One ecosystem.', 'Choose the capabilities you need — or deploy them all for complete building intelligence.'),
        items: [
          { media: args.lighting, richText: rt3('Lighting Control', 'Scenes, dimming, presence-adaptive automation. Create the perfect light for every moment.'), link: { type: 'custom', url: '/solutions/lighting-control' } },
          { media: args.shading, richText: rt3('Shading Automation', 'Sun-tracking blinds and curtains that protect comfort, privacy, and thermal efficiency.'), link: { type: 'custom', url: '/solutions/shading-automation' } },
          { media: args.climate, richText: rt3('Climate Control', 'Room-by-room heating and cooling that adapts to occupancy and schedule.'), link: { type: 'custom', url: '/solutions/climate-control' } },
          { media: args.energy, richText: rt3('Energy Management', 'Monitor, analyse, and optimise energy consumption across every zone.'), link: { type: 'custom', url: '/solutions/energy-management' } },
          { media: args.remote, richText: rt3('Remote Control', 'Manage any building from mobile, cloud, or touch panel — wherever you are.'), link: { type: 'custom', url: '/solutions/remote-control' } },
          { media: args.integration, richText: rt3('Open Integration', 'KNX, BACnet, MQTT, REST API. iNELS connects with any BMS, PMS, or third-party platform.'), link: { type: 'custom', url: '/solutions/open-integration' } },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Platform Impact',
        stats: [
          { richText: rt3('50,000+', 'Smart installations worldwide') },
          { richText: rt3('40+', 'Countries deployed') },
          { richText: rt3('30%', 'Average energy cost reduction') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Solutions CTA',
        richText: rt('Not sure which solution fits your project?', 'Talk to an iNELS solutions engineer — free 30-minute consultation.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Free Consultation', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Find an Installer', url: '/find-installer' } },
        ],
      },
    ],
  }
}
