import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; diagram: number; logo: number }

export function platformPage({ hero, diagram, logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Platform',
    slug: 'platform',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Technology Platform',
      richText: rt(
        'One ecosystem. Any building. Any protocol.',
        'The iNELS platform connects field devices, building controllers, cloud services, and third-party systems through a unified architecture — local-first, cloud-enhanced, and open by design.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Download Architecture Whitepaper', url: '/resources/downloads' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Book a Technical Demo', url: '/get-demo' } },
      ],
      mediaPreview: diagram,
    },
    meta: {
      title: 'Platform — iNELS Smart Building Technology',
      description: 'iNELS platform architecture: RF wireless, KNX, BACnet, Modbus, MQTT, cloud, and mobile — the complete smart building technology ecosystem.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Platform Architecture',
        variant: 'centeredGrid',
        intro: rt('Four layers. One unified platform.', 'From the field device to the cloud dashboard, every layer of the iNELS architecture is designed for openness and reliability.'),
        items: [
          { icon: 'Cpu', richText: rt3('Field Devices', 'Switches, sensors, thermostats, meters, and actuators — wired KNX or wireless RF.') },
          { icon: 'Settings2', richText: rt3('Central Unit / Controller', 'iNELS central units process local logic with <10ms response — no cloud dependency.') },
          { icon: 'Cloud', richText: rt3('iNELS Cloud', 'Secure cloud sync for remote management, OTA updates, and analytics.') },
          { icon: 'Globe', richText: rt3('App & Interfaces', 'Mobile app, web dashboard, touch panels, and third-party voice assistants.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Protocol Support',
        variant: 'split',
        intro: rt('Speaks every building language.', 'iNELS supports every major building protocol natively — KNX, BACnet, Modbus, MQTT, DALI, and more.'),
        items: [
          { icon: 'Code', richText: rt3('KNX', 'Full KNX/EIB certified implementation. TP, IP, RF.') },
          { icon: 'Activity', richText: rt3('BACnet', 'BACnet/IP and BACnet MSTP for enterprise HVAC and BMS.') },
          { icon: 'Layers', richText: rt3('Modbus RTU/TCP', 'Industrial-grade Modbus for meters, PLCs, and legacy equipment.') },
          { icon: 'Zap', richText: rt3('MQTT v5', 'Lightweight pub/sub for IoT and cloud integration.') },
        ],
        imageLight: hero,
        imageDark: diagram,
      },
      {
        blockType: 'integrations',
        blockName: 'Platform Integrations',
        variant: 'tiles',
        intro: rt('Connects with your entire stack.', 'iNELS integrates natively with leading BMS, PMS, voice, and smart home ecosystems.'),
        integrations: [
          { logo, link: { label: 'KNX', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'BACnet', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Modbus', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'MQTT', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Amazon Alexa', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Google Home', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Apple HomeKit', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Opera PMS', url: '/solutions/open-integration', type: 'custom' } },
        ],
        centerLogo: logo,
        links: [{ link: { type: 'custom', appearance: 'default', label: 'View all integrations', url: '/solutions/open-integration' } }],
      },
      {
        blockType: 'featureCards',
        blockName: 'Certifications',
        variant: 'floating',
        intro: rt('Certified to the standards that matter.', 'Every iNELS product meets the certifications required for commercial, residential, and industrial deployment.'),
        items: [
          { icon: 'Shield', richText: rt3('KNX Certified', 'Full KNX Association certification for all KNX product lines.') },
          { icon: 'Shield', richText: rt3('CE Marked', 'Compliant with all applicable EU directives for the European market.') },
          { icon: 'Shield', richText: rt3('RoHS Compliant', 'Lead-free and environmentally responsible manufacturing.') },
          { icon: 'Shield', richText: rt3('EN 50090', 'Home and building electronic systems standard compliance.') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Platform CTA',
        richText: rt('Ready to go deeper into the architecture?', 'Download the iNELS technical whitepaper or book a 1:1 with a solutions engineer.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Download Whitepaper', url: '/resources/downloads' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Book Technical Demo', url: '/get-demo' } },
        ],
      },
    ],
  }
}
