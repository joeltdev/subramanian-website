import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionRemote({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Remote Control',
    slug: 'remote-control',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Remote Control',
      richText: rt(
        "Your building shouldn't require you to be on-site to manage it.",
        'iNELS remote access gives facility managers, owners, and residents real-time control and alerts from any device, anywhere in the world.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Remote Control — iNELS Smart Building Automation',
      description: 'iNELS remote access: mobile app, cloud dashboard, push alerts, and multi-site management for facility managers and residents.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Remote Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The cost of on-site dependency',
          "Buildings that require physical presence for routine changes waste management time and delay fault response. In hospitality, guests expect instant control. In commercial, facility managers are stretched across multiple sites.",
        ),
        items: [
          { icon: 'Map', richText: rt3('On-site presence required for routine changes', 'Changing a schedule or checking a fault means sending someone to site. Every time.') },
          { icon: 'Shield', richText: rt3('Delayed fault response increases damage', 'A leak or HVAC failure discovered hours late causes far more damage than one caught in minutes.') },
          { icon: 'Cpu', richText: rt3('Residents expect mobile control', 'Smart home residents and hotel guests now expect app control as standard — not as a premium.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Remote Solution',
        variant: 'split',
        intro: rt(
          'Full building control in your pocket',
          'iNELS remote access works via the iNELS mobile app, cloud dashboard, and touch panels — with role-based access for managers, residents, and guests.',
        ),
        items: [
          { icon: 'Cpu', richText: rt3('iNELS Mobile App (iOS & Android)', 'Control lights, climate, shading, and scenes from anywhere with real-time feedback.') },
          { icon: 'Globe', richText: rt3('Cloud Supervision Dashboard', 'Full building overview for facility managers — all sites, all zones, one screen.') },
          { icon: 'Layers', richText: rt3('Touch Panel Integration', 'Wall-mounted touch panels for local scene control and status.') },
          { icon: 'MessageCircle', richText: rt3('Push Alerts & Fault Notifications', 'Instant push notifications for temperature deviation, access events, and system faults.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureBento',
        blockName: 'Remote Features',
        variant: 'stats',
        stat: 'Remote control — instant access from anywhere',
        items: [
          { icon: 'Shield', richText: rt3('Role-Based Access', 'Granular permissions: residents control their unit; managers control the building.') },
          { icon: 'Lock', richText: rt3('Guest App Provisioning', 'Hotel guests receive temporary app access for their stay, revoked at checkout.') },
          { icon: 'Lock', richText: rt3('VPN-Free Secure Cloud', 'Enterprise-grade encryption without VPN complexity for end users.') },
          { icon: 'Activity', richText: rt3('Offline Local Fallback', 'iNELS central units operate fully offline — cloud enhances, not replaces.') },
          { icon: 'Code', richText: rt3('API for Third-Party Apps', 'REST API enables custom apps and integrations for property management software.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Remote ROI',
        stats: [
          { richText: rt3('< 200ms', 'Command response time via iNELS cloud') },
          { richText: rt3('99.9%', 'Cloud platform uptime SLA') },
          { richText: rt3('150,000+', 'Active iNELS app users worldwide') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Remote Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Remote CTA',
        richText: rt('Take control. From anywhere.', 'Book a remote access demo or download the iNELS app datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
