import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionShading({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Shading Automation',
    slug: 'shading-automation',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Shading Automation',
      richText: rt(
        'Glare, overheating, and fading furniture cost more than motorised blinds ever will.',
        'iNELS shading automation tracks sun position and weather in real time — protecting comfort, privacy, and thermal efficiency without manual intervention.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Shading Automation — iNELS Smart Building Automation',
      description: 'iNELS shading automation: sun tracking, weather-responsive blinds, and integrated lighting scenes for any building type.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Shading Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The hidden cost of uncontrolled sunlight',
          'Solar gain can increase cooling loads by 25%. Glare reduces worker productivity by 20%. Manual blinds are left down all day or ignored entirely. Smart shading automation solves all three.',
        ),
        items: [
          { icon: 'Sparkles', richText: rt3('Solar gain overheats rooms', 'Unshaded south-facing glazing adds significant cooling load — and tenant discomfort.') },
          { icon: 'Shield', richText: rt3('Glare reduces productivity', "Screens become unreadable. Workers close blinds and never open them — wasting daylight and increasing lighting energy.") },
          { icon: 'RefreshCw', richText: rt3('Fixed schedules ignore weather', 'Static timer schedules cannot respond to cloud cover, wind, or seasonal sun angle changes.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Shading Solution',
        variant: 'split',
        intro: rt(
          'Shading that follows the sun',
          'iNELS shading automation uses real-time sun position, weather data, and occupancy to drive motorised blinds, shutters, and curtains.',
        ),
        items: [
          { icon: 'Sparkles', richText: rt3('Sun Position Tracking', 'Astronomical clock drives blinds based on real azimuth and elevation — no manual input.') },
          { icon: 'Cloud', richText: rt3('Wind & Rain Safety Retraction', 'Weather station integration automatically retracts blinds in wind or rain to prevent damage.') },
          { icon: 'RefreshCw', richText: rt3('Privacy Mode Scheduling', 'Scheduled privacy positions for evenings, meetings, and sensitive areas.') },
          { icon: 'Zap', richText: rt3('Daylight & Glare Control', 'Lux sensors trigger partial or full closure when glare threshold is exceeded.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureBento',
        blockName: 'Shading Features',
        variant: 'stats',
        stat: 'Automated shading — precision solar control for every facade',
        items: [
          { icon: 'Settings2', richText: rt3('Facade Zone Control', 'Independent control per window, zone, floor, or building face.') },
          { icon: 'RefreshCw', richText: rt3('Astronomical Scheduling', 'Lat/lon-based sunrise/sunset calculation built in.') },
          { icon: 'Cloud', richText: rt3('Weather Station Integration', 'Wind speed, rain, and temperature sensors drive automation logic.') },
          { icon: 'Cpu', richText: rt3('Central BMS Override', 'Emergency retract and manual override from building management system.') },
          { icon: 'BarChart', richText: rt3('Energy Reporting', 'Measure cooling load reduction and energy savings by zone.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Shading ROI',
        stats: [
          { richText: rt3('Up to 25%', 'Cooling load reduction with automated shading') },
          { richText: rt3('3-year payback', 'Typical ROI for commercial glazing retrofit') },
          { richText: rt3('10,000+', 'Motorised channels deployed by iNELS') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Shading Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Shading CTA',
        richText: rt('Stop fighting the sun. Work with it.', 'Book a shading automation demo or download the product datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
