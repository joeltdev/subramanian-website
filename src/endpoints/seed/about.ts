import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { hero: number; team: number; logo: number }

export function aboutPage({ hero: _hero, team, logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'About',
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'About iNELS',
      richText: rt(
        'Building intelligence has been our mission since 1993.',
        'iNELS is the smart building brand of Elko EP — a Czech manufacturer with 30+ years of experience delivering automation to 40+ countries.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Meet the Team', url: '#team' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Partner with Us', url: '/partners' } },
      ],
      mediaPreview: team,
    },
    meta: {
      title: 'About iNELS — Smart Building Automation Since 1993',
      description: 'iNELS is the smart building brand of Elko EP, a Czech manufacturer with 30+ years of experience delivering automation to 40+ countries.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Company Story',
        variant: 'splitImage',
        intro: rt(
          'Born in Brno. Built for the world.',
          'Elko EP was founded in 1993 with a single mission: make buildings smarter. Today, iNELS products automate everything from luxury villas to 250-room hotels and smart city districts across Europe, Asia, and the Americas.',
        ),
        imageLight: team,
        imageDark: team,
        quote: rtp(
          'Thirty years of innovation has taught us that the best automation is the kind that nobody notices — because everything just works.',
        ),
        quoteAuthor: 'Petr Novotný, CEO, Elko EP',
        quoteLogo: logo,
      },
      {
        blockType: 'stats',
        blockName: 'Company Stats',
        stats: [
          { richText: rt3('1993', 'Year founded') },
          { richText: rt3('30+', 'Years of innovation') },
          { richText: rt3('40+', 'Countries deployed') },
        ],
      },
      {
        blockType: 'featureCards',
        blockName: 'Why Choose iNELS',
        variant: 'floating',
        intro: rt('Why integrators and owners choose iNELS'),
        items: [
          { icon: 'Globe', richText: rt3('European Manufacturing', 'Designed and manufactured in the Czech Republic to EU standards.') },
          { icon: 'RefreshCw', richText: rt3('10-Year Product Availability', 'Long-term sourcing guarantee on every SKU in our catalogue.') },
          { icon: 'Code', richText: rt3('Open Protocol Commitment', 'We will never lock you into proprietary protocols. KNX, BACnet, Modbus are first-class.') },
          { icon: 'MessageCircle', richText: rt3('Dedicated Technical Support', 'Phone, email, and on-site support from our certified partner network.') },
          { icon: 'Shield', richText: rt3('CE & KNX Certified', 'Every product meets the certifications required for European commercial deployment.') },
          { icon: 'Sparkles', richText: rt3('Sustainability-First Design', 'RoHS compliant, energy-saving by design, and committed to reducing our carbon footprint.') },
        ],
      },
      {
        blockType: 'logoCloud',
        blockName: 'Partner Logos',
        type: 'section1',
        heading: 'Trusted by leading integrators and technology partners',
        logos: [
          { logo },
          { logo },
          { logo },
          { logo },
          { logo },
          { logo },
        ],
      },
      {
        blockType: 'testimonials',
        blockName: 'Customer Testimonials',
        intro: rt('What our customers say'),
        items: [
          {
            logo,
            richText: rtp(
              'iNELS gave us complete visibility across our building portfolio. The integration with our existing BMS was seamless and the support from the iNELS team was outstanding.',
            ),
            author: 'Markus Weber',
            role: 'BMS Engineer, TechBuild GmbH',
            avatar: logo,
          },
          {
            logo,
            richText: rtp(
              'After switching to iNELS, our energy costs dropped by 22% in the first year. The system is reliable, easy to manage, and our tenants love the app.',
            ),
            author: 'Katarína Horáčková',
            role: 'Facility Manager, Penta Real Estate',
            avatar: logo,
          },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'About CTA',
        richText: rt('Join 500+ partners building smarter.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Become a Partner', url: '/partners' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Contact Us', url: '/contact' } },
        ],
      },
    ],
  }
}
