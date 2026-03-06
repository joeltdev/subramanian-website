import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; logo: number }

export function productsLandingPage({ hero, logo: _logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Products',
    slug: 'products',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Product Catalogue',
      richText: rt(
        '500+ products. One ecosystem.',
        'Browse the complete iNELS product catalogue — switches, sensors, thermostats, meters, controllers, and accessories for KNX, RF, and Modbus systems.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Browse Products', url: '#products' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Full Catalogue', url: '/resources/downloads' } },
      ],
      mediaPreview: hero,
    },
    meta: {
      title: 'Products — iNELS Smart Building Catalogue',
      description: 'Browse the complete iNELS product catalogue — switches, sensors, thermostats, meters, controllers, and accessories for KNX, RF, and Modbus systems.',
    },
    layout: [
      {
        blockType: 'featureCards',
        blockName: 'Product Categories',
        variant: 'floating',
        intro: rt('Product categories'),
        items: [
          { icon: 'Bolt', richText: rt3('Switches & Controls', 'KNX and RF smart switches, dimmers, and push buttons.') },
          { icon: 'Activity', richText: rt3('Thermostats & HVAC', 'Room thermostats with presence, CO2, and multi-zone support.') },
          { icon: 'BarChart', richText: rt3('Energy Meters', 'DIN-rail Modbus/KNX sub-meters with cloud reporting.') },
          { icon: 'Cpu', richText: rt3('Sensors & Detectors', 'PIR, CO2, temperature, humidity, and multisensors.') },
          { icon: 'Zap', richText: rt3('Lighting Control', 'DALI, 0-10V, and KNX dimming actuators.') },
          { icon: 'Layers', richText: rt3('Shading & Blinds', 'Motorised blind actuators and sun tracking controllers.') },
        ],
      },
      {
        blockType: 'hoverHighlights',
        blockName: 'Product Lines',
        beforeHighlights: 'Explore the iNELS product lines',
        highlights: [
          { text: 'RF Line', mediaTop: hero, mediaBottom: hero, link: { type: 'custom', url: '/products/rf' } },
          { text: 'KNX Line', mediaTop: hero, mediaBottom: hero, link: { type: 'custom', url: '/products/knx' } },
          { text: 'Modbus Line', mediaTop: hero, mediaBottom: hero, link: { type: 'custom', url: '/products/modbus' } },
          { text: 'Cloud Platform', mediaTop: hero, mediaBottom: hero, link: { type: 'custom', url: '/platform' } },
        ],
        afterHighlights: 'One unified ecosystem for every building type.',
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'View full product catalogue', url: '/products' } },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Products CTA',
        richText: rt("Can't find what you need?", 'Our technical team can help specify the right product for your project.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Talk to a Specialist', url: '/get-demo' } },
        ],
      },
    ],
  }
}
