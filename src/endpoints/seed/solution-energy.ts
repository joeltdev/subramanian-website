import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionEnergy({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Energy Management',
    slug: 'energy-management',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Energy Management',
      richText: rt(
        "You can't manage what you can't measure. Most buildings are flying blind on energy.",
        'iNELS energy management monitors consumption per room, floor, tenant, and circuit — then automates logic to cut waste and improve reporting.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'Energy Management — iNELS Smart Building Automation',
      description: 'iNELS energy management: real-time sub-metering, load shedding, tenant billing, and ESG reporting for commercial buildings.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Energy Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The energy visibility problem',
          'Without granular metering, energy waste is invisible. You receive one utility bill for the whole building and have no way to identify which zones, tenants, or systems are driving costs.',
        ),
        items: [
          { icon: 'Shield', richText: rt3('No per-zone visibility', 'A single building meter tells you nothing about where energy is wasted.') },
          { icon: 'Zap', richText: rt3('Manual meter reading is error-prone', 'Monthly reads miss peaks. Billing disputes with tenants are common and costly.') },
          { icon: 'Database', richText: rt3('ESG reporting requires granular data', 'Investors and regulators demand energy data by floor, zone, and consumption type.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Energy Solution',
        variant: 'split',
        intro: rt(
          'Energy visibility that drives action',
          'iNELS DIN-rail Modbus and KNX sub-meters give you real-time consumption data per circuit, zone, floor, or tenant — with automated alerts and cloud reporting.',
        ),
        items: [
          { icon: 'BarChart', richText: rt3('Real-Time Sub-Metering', '5-minute interval data per circuit from DIN-rail Modbus energy meters.') },
          { icon: 'Zap', richText: rt3('Automated Load Shedding', 'Programmatic load shedding prevents peak demand charges automatically.') },
          { icon: 'Pencil', richText: rt3('Tenant Billing Reports', 'Auto-generated monthly energy statements per tenant or cost centre.') },
          { icon: 'Globe', richText: rt3('ESG Dashboard', 'Carbon intensity, kWh/m², and trend data for sustainability reporting.') },
          { icon: 'MessageCircle', richText: rt3('Anomaly Alerts', 'Consumption spikes trigger instant push notifications to facility managers.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureBento',
        blockName: 'Energy Features',
        variant: 'stats',
        stat: 'Complete energy visibility — from socket to building total',
        items: [
          { icon: 'Cpu', richText: rt3('DIN-Rail Modbus Meters', 'Space-efficient 1-3 phase meters for every circuit type.') },
          { icon: 'Cloud', richText: rt3('Cloud Dashboards', 'Live consumption data accessible from anywhere via iNELS cloud.') },
          { icon: 'BarChart', richText: rt3('Historical Trending', 'Daily, weekly, monthly, and annual consumption comparison.') },
          { icon: 'Code', richText: rt3('API Data Export', 'Raw data export to Excel, BI tools, or third-party energy platforms.') },
          { icon: 'Star', richText: rt3('Multi-tariff Tracking', 'Track peak, off-peak, and renewable consumption separately.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Energy ROI',
        stats: [
          { richText: rt3('Up to 35%', 'Energy cost reduction with sub-metering and automation') },
          { richText: rt3('18 months', 'Typical ROI payback period') },
          { richText: rt3('500,000+', 'Metering points monitored by iNELS') },
          { richText: rt3('5-min resolution', 'Consumption data interval for anomaly detection') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Energy Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Energy CTA',
        richText: rt('Turn your energy data into savings.', 'Book an energy management demo or download the metering product datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
