import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industrySmartCities({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Smart Cities',
    slug: 'smart-cities',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Smart Cities',
      richText: rt(
        'Cities that automate their infrastructure spend less and serve citizens better.',
        'iNELS smart city solutions manage street lighting, public building automation, utility metering, and district energy from a unified platform — scalable from a district to a metropolis.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a City Consultation', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Smart City Brief', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Smart Cities — iNELS Urban Infrastructure Automation',
      description:
        'iNELS smart city solutions: adaptive street lighting, public building BMS, district energy metering, and central SCADA — scalable from district to metropolis.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Urban Infrastructure Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The urban infrastructure efficiency problem',
          'Street lighting is the largest single energy cost for most municipalities. Public buildings operate on fixed schedules regardless of occupancy. Utility data is siloed and not actionable in real time.',
        ),
        items: [
          {
            icon: 'Bolt',
            richText: rt3(
              'Street lighting is the largest municipal energy cost',
              'Fixed-schedule street lighting runs at full power regardless of traffic, weather, or season.',
            ),
          },
          {
            icon: 'Layers',
            richText: rt3(
              'Siloed systems prevent unified management',
              'Separate systems for lighting, buildings, and utilities require multiple teams and dashboards.',
            ),
          },
          {
            icon: 'Globe',
            richText: rt3(
              'Citizens expect data-driven services',
              'Modern citizens and city councils expect transparency in how public resources are managed.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Smart City Solution',
        variant: 'split',
        intro: rt(
          'District-scale automation on open protocols',
          'iNELS combines DALI street lighting control, KNX building automation, Modbus metering, and open REST APIs on a single SCADA platform.',
        ),
        items: [
          {
            icon: 'Bolt',
            richText: rt3(
              'Adaptive Street Lighting',
              'Traffic, time, and weather-responsive dimming — saving up to 50% of street lighting energy.',
            ),
          },
          {
            icon: 'Settings',
            richText: rt3(
              'Public Building BMS',
              'HVAC, lighting, and access automation for municipal buildings from a central platform.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'District Energy Metering',
              'Utility consumption data per district, zone, and building for budget control and reporting.',
            ),
          },
          {
            icon: 'Map',
            richText: rt3(
              'Central SCADA Dashboard',
              'All infrastructure points on a geographic map with real-time status and fault alerting.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'Smart City Solutions',
        variant: 'floating',
        intro: rt('Key solutions for smart cities'),
        items: [
          {
            icon: 'Bolt',
            richText: rt3('Street Lighting', 'Adaptive DALI street lighting with traffic and weather-responsive dimming.'),
          },
          {
            icon: 'Settings2',
            richText: rt3('Public Building BMS', 'Centralised HVAC, lighting, and access control for all municipal buildings.'),
          },
          {
            icon: 'BarChart',
            richText: rt3('Energy Management', 'District-level metering with real-time dashboards and trend analysis.'),
          },
          {
            icon: 'Code',
            richText: rt3('Open Integration', 'REST API and MQTT for city digital twin, open data, and third-party platforms.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Smart City ROI',
        stats: [
          { richText: rt3('50%', 'Street lighting energy saving') },
          { richText: rt3('20+', 'Smart city deployments worldwide') },
          { richText: rt3('Open API', 'REST API and MQTT native support') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Smart City CTA',
        richText: rt(
          'Bring intelligence to your city infrastructure.',
          'Speak to our smart city team or download the smart city solution brief.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a City Consultation', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Smart City Brief', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
