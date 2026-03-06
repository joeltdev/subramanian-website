import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { contactFormId: number }

export function findInstallerPage({ contactFormId }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Find an Installer',
    slug: 'find-installer',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Find a Certified Installer',
      richText: rt(
        'Find a certified iNELS installer near you.',
        'All iNELS certified partners have completed our technical training programme. We\'ll connect you with the right specialist for your project.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Submit Your Project', url: '#installer-form' } },
      ],
    },
    meta: {
      title: 'Find a Certified iNELS Installer Near You',
      description: 'Connect with a certified iNELS installer. All partners have completed our technical training programme and are ready to help with your project.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Installation Process',
        variant: 'centeredGrid',
        intro: rt('What to expect from your iNELS installation'),
        items: [
          { icon: 'MessageCircle', richText: rt3('Free Initial Consultation', 'A certified partner discusses your needs and goals — no commitment required.') },
          { icon: 'Map', richText: rt3('Site Survey', 'On-site assessment of your property and existing infrastructure.') },
          { icon: 'Pencil', richText: rt3('Detailed Proposal', 'Fixed-price proposal with clear scope, timeline, and product specification.') },
          { icon: 'Settings', richText: rt3('Professional Installation', 'Certified installation by an iNELS-trained engineer.') },
          { icon: 'CheckCircle', richText: rt3('Commissioning & Training', 'Full system commissioning and resident or staff training on day of handover.') },
          { icon: 'RefreshCw', richText: rt3('Ongoing Support', 'Warranty, maintenance, and support from your local certified partner.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Installer Stats',
        stats: [
          { richText: rt3('500+', 'Certified installers') },
          { richText: rt3('40+', 'Countries covered') },
          { richText: rt3('< 48h', 'Response time to enquiries') },
          { richText: rt3('5-star avg', 'Partner satisfaction rating') },
        ],
      },
      {
        blockType: 'formBlock',
        blockName: 'Installer Enquiry Form',
        intro: rt('Tell us about your project', 'We\'ll match you with the best certified installer for your needs and location.'),
        form: contactFormId,
      },
      {
        blockType: 'cta',
        blockName: 'Installer CTA',
        richText: rt('Are you an installer?', 'Join the iNELS partner network and access certified installer status, leads, and training.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Become a Partner', url: '/partners' } },
        ],
      },
    ],
  }
}
