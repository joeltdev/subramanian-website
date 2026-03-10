import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionClimate({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Climate Control',
    slug: 'climate-control',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Climate Control',
      richText: rt(
        "A building that's too hot in summer and too cold in winter is losing tenants, not just energy.",
        'iNELS climate control brings room-by-room regulation that responds to occupancy, schedule, and weather — stable comfort with lower energy bills.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Climate Control — iNELS Smart Building Automation',
      description: 'iNELS climate control: room-level thermostats, presence-based setback, and BMS integration for comfortable, efficient buildings.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Climate Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The climate comfort gap',
          'Centralised HVAC treats all rooms the same. Meeting rooms run cold when empty; corner offices overheat all afternoon. The result: tenant complaints, energy waste, and high maintenance costs.',
        ),
        items: [
          { icon: 'Cpu', richText: rt3('Centralised HVAC ignores occupancy', 'One thermostat per floor cannot respond to the real thermal needs of individual rooms.') },
          { icon: 'Zap', richText: rt3('Manual thermostats waste energy', "Residents and staff set thermostats to maximum and forget. Setback doesn't happen.") },
          { icon: 'Users', richText: rt3('Tenant complaints cost money', 'Temperature is the #1 tenant complaint. Persistent issues lead to early lease terminations.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Climate Solution',
        variant: 'split',
        intro: rt(
          'Climate control that adapts to how people actually use spaces',
          'iNELS climate control uses room-level thermostats, presence detection, CO2 sensors, and scheduling to maintain comfort while eliminating waste.',
        ),
        items: [
          { icon: 'Settings', richText: rt3('Room-Level Thermostat Control', 'Independent setpoint per room with programmable day/night/weekend schedules.') },
          { icon: 'Activity', richText: rt3('Presence-Based Setback', 'PIR and CO2 sensors trigger energy-saving setback in unoccupied rooms automatically.') },
          { icon: 'Settings2', richText: rt3('Multi-Zone Scheduling', 'Different temperature profiles for open plan, meeting rooms, server rooms, and reception.') },
          { icon: 'Zap', richText: rt3('Underfloor & Radiator Control', 'KNX actuators for underfloor heating manifolds and radiator valves.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureBento',
        blockName: 'Climate Features',
        variant: 'stats',
        stat: 'Precise climate regulation — every room, every schedule',
        items: [
          { icon: 'Layers', richText: rt3('Heating & Cooling Unified', 'Single controller for heating, cooling, and ventilation per zone.') },
          { icon: 'Cloud', richText: rt3('CO2 Ventilation Trigger', 'Fresh air demand-controlled ventilation triggered by CO2 levels.') },
          { icon: 'Rocket', richText: rt3('Holiday/Away Mode', 'Whole-building energy setback activated with one tap or schedule.') },
          { icon: 'Cpu', richText: rt3('Remote Override', 'Facility managers override any zone remotely from the iNELS app.') },
          { icon: 'BarChart', richText: rt3('Energy Sub-metering', 'Per-zone energy consumption tracked and reported for ESG and billing.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Climate ROI',
        stats: [
          { richText: rt3('Up to 30%', 'HVAC energy saving with room-level control') },
          { richText: rt3('2.5-year payback', 'Typical commercial retrofit ROI') },
          { richText: rt3('200,000+', 'Thermostats deployed by iNELS worldwide') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Climate Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Climate CTA',
        richText: rt('Give every room the climate its occupants deserve.', 'Book a climate control demo or download the thermostat range datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
