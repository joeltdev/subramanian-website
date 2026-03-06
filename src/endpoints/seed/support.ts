import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { logo: number; contactFormId: number }

export function supportPage({ logo: _logo, contactFormId }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Support',
    slug: 'support',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Support',
      richText: rt(
        "We're here when you need us.",
        'Technical support for certified iNELS partners and end customers — by phone, email, and on-site.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Submit a Support Request', url: '#form' } },
      ],
    },
    meta: {
      title: 'Support — iNELS Technical Assistance',
      description: 'Technical support for certified iNELS partners and end customers — by phone, email, and on-site.',
    },
    layout: [
      {
        blockType: 'featureCards',
        blockName: 'Support Options',
        variant: 'floating',
        intro: rt('Ways to get support'),
        items: [
          { icon: 'MessageCircle', richText: rt3('Phone Support', 'Direct line to our technical support team during business hours.') },
          { icon: 'Pencil', richText: rt3('Email Support', 'support@inels.com — response within 4 business hours for certified partners.') },
          { icon: 'IdCard', richText: rt3('Partner Portal', 'Full documentation, firmware downloads, and ticket management.') },
          { icon: 'Map', richText: rt3('On-Site Support', 'Certified engineers available for complex fault diagnosis and commissioning.') },
          { icon: 'Sparkles', richText: rt3('Training Academy', 'Online and in-person training for certified and aspiring partners.') },
          { icon: 'Database', richText: rt3('Documentation', 'Full technical documentation at docs.inels.com.') },
        ],
      },
      {
        blockType: 'faq',
        blockName: 'Support FAQ',
        variant: 'single',
        intro: rt('Frequently asked questions'),
        groups: [
          {
            name: 'General',
            items: [
              {
                question: 'What protocols does iNELS support?',
                answer: rtp('iNELS natively supports KNX, BACnet/IP, BACnet MSTP, Modbus RTU, Modbus TCP, MQTT v5, DALI-2, 0-10V, REST API, and Zigbee. See the platform page for the full list.'),
              },
              {
                question: 'Is iNELS available in my country?',
                answer: rtp('iNELS is deployed in 40+ countries. Find a certified partner near you on the Find an Installer page.'),
              },
              {
                question: 'How long does commissioning take?',
                answer: rtp('A typical residential project takes 1–3 days. Hotel GRMS projects range from 1 day per floor to 1 week for a full rollout.'),
              },
              {
                question: 'Does iNELS work without internet?',
                answer: rtp('Yes. All iNELS central units process automation logic locally. Cloud connectivity is optional and enhances — it does not replace — local operation.'),
              },
              {
                question: 'What is the product availability guarantee?',
                answer: rtp('iNELS guarantees product and spare part availability for 10 years from the date of product launch.'),
              },
              {
                question: 'How do I become a certified partner?',
                answer: rtp('Apply on the Partners page. Certification training takes 2–5 days depending on which product lines you are certifying for.'),
              },
            ],
          },
        ],
      },
      {
        blockType: 'formBlock',
        blockName: 'Support Request Form',
        form: contactFormId,
        intro: rt('Submit a support request', 'Fill in the form below and our technical team will respond within 4 business hours.'),
      },
      {
        blockType: 'cta',
        blockName: 'Support CTA',
        richText: rt('Need urgent support?', 'Call our direct technical support line or email support@inels.com'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Contact Support', url: '/contact' } },
        ],
      },
    ],
  }
}
