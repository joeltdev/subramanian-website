import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industryCommercial({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Commercial',
    slug: 'commercial',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Commercial',
      richText: rt(
        "Office buildings that waste energy and frustrate tenants don't retain them.",
        'iNELS delivers HVAC control, tenant sub-metering, lighting automation, and access management for commercial buildings — reducing OpEx while improving occupant satisfaction.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Commercial Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Case Study', url: '/resources/case-studies' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'Commercial Buildings — iNELS Smart Building Automation',
      description:
        'iNELS HVAC control, tenant sub-metering, lighting automation, and access management for commercial buildings — reducing OpEx and improving tenant satisfaction.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Commercial Challenges',
        variant: 'centeredGrid',
        intro: rt(
          'The commercial building efficiency gap',
          'Commercial buildings consume 40% of all energy globally. Without granular control and metering, waste is invisible — and tenants bear the cost through service charges they resent.',
        ),
        items: [
          {
            icon: 'Settings2',
            richText: rt3(
              'High energy costs from centralised HVAC',
              'One thermostat per floor cannot respond to the real occupancy of individual spaces.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Tenants demand billing transparency',
              'Flat-rate service charges are increasingly contested. Tenants want to see what they use.',
            ),
          },
          {
            icon: 'Database',
            richText: rt3(
              'ESG reporting requires metered data',
              'Investors and regulators require granular energy data by floor and tenant. Most buildings cannot provide it.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Commercial Solution',
        variant: 'split',
        intro: rt(
          'Commercial building automation that pays for itself',
          'iNELS KNX and BACnet integration brings HVAC, metering, access, and reporting onto a single platform — with measurable payback in under 3 years.',
        ),
        items: [
          {
            icon: 'BarChart',
            richText: rt3(
              'Tenant-Level Sub-Metering',
              'Individual energy data per tenant for accurate billing and dispute elimination.',
            ),
          },
          {
            icon: 'Settings',
            richText: rt3(
              'BACnet/KNX HVAC Control',
              'Zone-level climate control integrated with occupancy sensors and scheduling.',
            ),
          },
          {
            icon: 'Lock',
            richText: rt3(
              'Access Control Integration',
              'Building-wide access management with audit trails per tenant and floor.',
            ),
          },
          {
            icon: 'ChartBarIncreasing',
            richText: rt3(
              'ESG Reporting Dashboard',
              'Carbon intensity, kWh/m², and trend data for sustainability and investor reporting.',
            ),
          },
          {
            icon: 'Code',
            richText: rt3(
              'BMS/SCADA Integration',
              'Open protocols connect iNELS to existing BMS and SCADA systems without rip-and-replace.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'Commercial Solutions',
        variant: 'floating',
        intro: rt('Key solutions for commercial buildings'),
        items: [
          {
            icon: 'Bolt',
            richText: rt3('Lighting Control', 'Presence-adaptive lighting with DALI and KNX for open-plan and cellular offices.'),
          },
          {
            icon: 'Settings2',
            richText: rt3('Climate Control', 'Per-zone HVAC control with occupancy-based scheduling and BACnet integration.'),
          },
          {
            icon: 'BarChart',
            richText: rt3('Energy Management', 'Tenant sub-metering and ESG reporting from a single cloud dashboard.'),
          },
          {
            icon: 'Lock',
            richText: rt3('Access Control', 'Multi-tenant access management with full audit trails and visitor management.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Commercial ROI',
        stats: [
          { richText: rt3('30%', 'HVAC energy reduction — Penta Tower') },
          { richText: rt3('12 floors, 40 tenants', 'Metered and managed from a single platform') },
          { richText: rt3('3-year', 'Payback period for full deployment') },
          { richText: rt3('Day 1', 'Full ESG reporting from commissioning') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Commercial CTA',
        richText: rt(
          'Make your building a better tenant proposition.',
          'Talk to our commercial team or download the Penta Tower case study.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Commercial Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Case Study', url: '/resources/case-studies' } },
        ],
      },
    ],
  }
}
