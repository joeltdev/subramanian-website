import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industrySmartFactories({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Smart Factories',
    slug: 'smart-factories',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Smart Factories',
      richText: rt(
        'Industrial facilities that cannot monitor and automate are losing competitive ground.',
        'iNELS industrial automation bridges OT and IT — open protocols for SCADA integration, energy sub-metering by production line, and environmental control for precision manufacturing.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book an Industrial Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Industrial Datasheet', url: '/resources/downloads' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'Smart Factories — iNELS Industrial Automation',
      description:
        'iNELS industrial automation: Modbus/BACnet/MQTT integration, production-line sub-metering, environmental monitoring, and SCADA integration for smart factories.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Industrial Visibility Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The industrial visibility and integration problem',
          'Legacy factory infrastructure was not designed to be connected. Energy is metered at the building level, not the production line. Environmental deviations go undetected until product quality suffers.',
        ),
        items: [
          {
            icon: 'BarChart',
            richText: rt3(
              'No per-line energy visibility',
              'Building-level meters cannot identify which machine or line is driving energy peaks.',
            ),
          },
          {
            icon: 'Cpu',
            richText: rt3(
              'Legacy PLCs are isolated',
              'Older PLCs do not communicate with modern IT systems — creating data silos that prevent optimisation.',
            ),
          },
          {
            icon: 'Activity',
            richText: rt3(
              'Environmental deviations affect quality',
              'Temperature and humidity excursions in precision manufacturing cause scrap and rework.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Smart Factory Solution',
        variant: 'split',
        intro: rt(
          'Industrial automation that speaks every protocol',
          'iNELS supports Modbus RTU/TCP, BACnet, KNX, and MQTT natively — connecting legacy PLCs, modern sensors, and cloud platforms without middleware.',
        ),
        items: [
          {
            icon: 'Code',
            richText: rt3(
              'Modbus RTU/TCP for PLC Integration',
              'Direct Modbus connectivity to legacy and modern PLCs without additional gateways.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Production-Line Sub-Metering',
              'Per-machine and per-line energy data for peak identification and ISO 50001 reporting.',
            ),
          },
          {
            icon: 'Activity',
            richText: rt3(
              'Environmental Monitoring (Temp/Humidity/CO2)',
              'Continuous monitoring with automated alerts for deviations from manufacturing tolerances.',
            ),
          },
          {
            icon: 'Cloud',
            richText: rt3(
              'OT/IT Bridge via MQTT',
              'MQTT broker connects operational technology data to IT platforms, ERP, and cloud analytics.',
            ),
          },
          {
            icon: 'Database',
            richText: rt3(
              'SCADA Integration',
              'iNELS integrates with major SCADA platforms via OPC-UA, Modbus, and REST API.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'Smart Factory Solutions',
        variant: 'floating',
        intro: rt('Key solutions for smart factories'),
        items: [
          {
            icon: 'BarChart',
            richText: rt3('Energy Sub-Metering', 'Per-line and per-machine energy monitoring for ISO 50001 compliance.'),
          },
          {
            icon: 'Activity',
            richText: rt3('Environmental Monitoring', 'Temperature, humidity, and CO2 monitoring with deviation alerts.'),
          },
          {
            icon: 'Code',
            richText: rt3('Protocol Integration', 'Modbus, BACnet, KNX, MQTT, and OPC-UA — all native.'),
          },
          {
            icon: 'Database',
            richText: rt3('SCADA Integration', 'Connect iNELS data to existing SCADA and MES platforms.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Smart Factory ROI',
        stats: [
          { richText: rt3('35%', 'Energy visibility improvement after deployment') },
          { richText: rt3('Native protocols', 'Modbus, BACnet, and MQTT out of the box') },
          { richText: rt3('ISO 50001', 'Reporting-ready from commissioning') },
          { richText: rt3('< 1 day', 'Per zone commissioning time') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Smart Factory CTA',
        richText: rt(
          'Bring your factory into the intelligent era.',
          'Speak to our industrial automation team or download the industrial datasheet.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book an Industrial Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Industrial Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
