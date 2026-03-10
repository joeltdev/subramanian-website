import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; caseStudyIds: number[] }

export function solutionLighting({ hero, feature, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Lighting Control',
    slug: 'lighting-control',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Lighting Control',
      richText: rt(
        'Lights left on in empty rooms cost thousands every year. iNELS ends that.',
        'Adaptive lighting automation that responds to presence, daylight levels, and schedules — so every space is perfectly lit and no watt is wasted.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Lighting Control — iNELS Smart Building Automation',
      description: 'iNELS adaptive lighting control: scene automation, dimming, daylight harvesting, and presence detection for any building type.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Lighting Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The hidden cost of manual lighting',
          "Commercial buildings waste up to 40% of their lighting energy on unoccupied spaces. Residents forget to dim or switch off. Hotel guests leave rooms fully lit for hours. The fix isn't more switches — it's smarter automation.",
        ),
        items: [
          { icon: 'Bolt', richText: rt3('40% energy wasted', 'Average lighting energy waste in commercial buildings from unoccupied spaces.') },
          { icon: 'Settings', richText: rt3('Manual scheduling fails', "Fixed timers don't adapt to real occupancy, seasons, or weather changes.") },
          { icon: 'Users', richText: rt3('Occupant complaints', 'Too bright, too dim, wrong colour temperature — lighting directly impacts productivity and comfort.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Lighting Solution',
        variant: 'split',
        intro: rt(
          'Lighting that thinks for itself',
          'iNELS lighting control combines DALI, KNX, and 0-10V dimming with presence sensors, daylight harvesting, and scene automation.',
        ),
        items: [
          { icon: 'Activity', richText: rt3('Presence-Adaptive', 'PIR and microwave sensors switch and dim based on real occupancy — not timers.') },
          { icon: 'Sparkles', richText: rt3('Daylight Harvesting', 'Automatic dimming maintains target lux levels as natural light changes throughout the day.') },
          { icon: 'Layers', richText: rt3('Scene Automation', 'One-tap scenes for Morning, Meeting, Presentation, Evening — consistent every time.') },
          { icon: 'Zap', richText: rt3('DALI & 0-10V Native', 'Full compatibility with LED drivers and fixtures from all major manufacturers.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureBento',
        blockName: 'Lighting Features',
        variant: 'stats',
        stat: 'Complete lighting intelligence — from a single room to an entire campus',
        items: [
          { icon: 'Settings', richText: rt3('Zone-Level Control', 'Independent control per room, floor, tenant, or zone.') },
          { icon: 'BarChart', richText: rt3('Energy Reporting', 'Real-time and historical lighting energy data per circuit.') },
          { icon: 'RefreshCw', richText: rt3('Astronomical Clock', 'Sunrise/sunset scheduling adjusts automatically for your latitude.') },
          { icon: 'Shield', richText: rt3('Emergency Lighting', 'DALI-2 emergency circuit monitoring and test scheduling.') },
          { icon: 'Cpu', richText: rt3('Central Management', 'Supervise all zones from a single dashboard or SCADA.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Lighting ROI',
        stats: [
          { richText: rt3('Up to 40%', 'Lighting energy reduction with presence detection') },
          { richText: rt3('2–3 years', 'Typical ROI payback period for commercial retrofit') },
          { richText: rt3('100,000+', 'DALI channels managed by iNELS worldwide') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Lighting Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Lighting CTA',
        richText: rt('Ready to eliminate lighting waste?', 'Talk to a certified iNELS integrator or download the lighting control datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
