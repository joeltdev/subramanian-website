import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionIntegration({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Open Integration',
    slug: 'open-integration',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Open Integration',
      richText: rt(
        "A smart building shouldn't be a walled garden. iNELS is open by design.",
        "Connect iNELS with any BMS, PMS, or third-party platform via KNX, BACnet, Modbus, MQTT, REST API, and cloud connectors — unified control, zero lock-in.",
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
    },
    meta: {
      title: 'Open Integration — iNELS Smart Building Automation',
      description: 'iNELS open integration: KNX, BACnet, Modbus, MQTT, REST API, and hotel PMS connectors for protocol-native building automation.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'The Integration Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The integration trap',
          'Proprietary systems force you to choose between functionality and interoperability. Installers waste weeks writing custom glue code. Building owners end up with islands of automation that cannot share data.',
        ),
        items: [
          { icon: 'Lock', richText: rt3('Proprietary systems block interoperability', "Vendor lock-in means you can't add the best product for each use case.") },
          { icon: 'RefreshCw', richText: rt3('Custom integrations waste project time', 'Bespoke middleware code adds weeks to commissioning and is fragile to maintain.') },
          { icon: 'Database', richText: rt3('PMS/BMS data silos prevent insight', 'Hotel PMS, HVAC BMS, and lighting control that cannot share data deliver less value.') },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'Integration Solution',
        variant: 'split',
        intro: rt(
          'The protocol-native open platform',
          'iNELS supports every major building protocol natively. No gateways. No middleware. KNX, BACnet, Modbus, MQTT, and REST API are all first-class citizens.',
        ),
        items: [
          { icon: 'Code', richText: rt3('KNX & BACnet Native', 'Full KNX/EIB and BACnet/IP certified — connects to any compliant device.') },
          { icon: 'Cpu', richText: rt3('Modbus RTU/TCP', 'Industrial-grade Modbus for meters, PLCs, VFDs, and legacy building equipment.') },
          { icon: 'Cloud', richText: rt3('MQTT Broker', 'Built-in MQTT v5 broker for IoT device integration and cloud pub/sub.') },
          { icon: 'Globe', richText: rt3('REST API & Webhooks', 'Full REST API with webhooks for two-way integration with any software platform.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'integrations',
        blockName: 'Integration Ecosystem',
        variant: 'tiles',
        intro: rt('Every major protocol. Every major ecosystem.', 'iNELS connects natively — no gateways, no middleware.'),
        integrations: [
          { logo, link: { label: 'KNX', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'BACnet', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Modbus', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'MQTT', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'REST API', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Opera PMS', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Google Home', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Amazon Alexa', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Apple HomeKit', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'DALI-2', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Zigbee', url: '/platform', type: 'custom' } },
          { logo, link: { label: 'Z-Wave', url: '/platform', type: 'custom' } },
        ],
        centerLogo: logo,
        links: [{ link: { type: 'custom', appearance: 'outline', label: 'View platform architecture', url: '/platform' } }],
      },
      {
        blockType: 'featureBento',
        blockName: 'Integration Features',
        variant: 'stats',
        stat: 'Open by design — integrate anything, lock into nothing',
        items: [
          { icon: 'Star', richText: rt3('Certified KNX Partner', 'Full KNX Association member with certified products across all product lines.') },
          { icon: 'Activity', richText: rt3('BACnet/IP & MSTP', 'BACnet/IP and BACnet MSTP for enterprise HVAC and fire system integration.') },
          { icon: 'Cloud', richText: rt3('MQTT v5 Broker', 'Native MQTT broker built into iNELS central units — no external broker needed.') },
          { icon: 'Globe', richText: rt3('Cloud REST API', 'Full OpenAPI documentation with sandbox environment for integrators.') },
          { icon: 'Code', richText: rt3('SDK & Developer Docs', 'Integration SDK, Postman collections, and developer portal at docs.inels.com.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Integration ROI',
        stats: [
          { richText: rt3('12+', 'Open protocols supported natively') },
          { richText: rt3('< 1 day', 'Typical integration time for certified protocols') },
          { richText: rt3('200+', 'Certified third-party integrations') },
        ],
      },
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Integration Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      {
        blockType: 'cta',
        blockName: 'Integration CTA',
        richText: rt('Your building. Your ecosystem. Your rules.', 'Book an integration demo or access the developer documentation.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
