import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { hero: number; logo: number; contactFormId: number }

export function partnersPage({ hero: _hero, logo, contactFormId }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Partners',
    slug: 'partners',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Partner Programme',
      richText: rt(
        'Grow your business with iNELS. We grow when you grow.',
        'Join 500+ certified iNELS partners across 40 countries. Get leads, training, technical support, and co-marketing from the team behind Europe\'s most complete smart building platform.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Become a Partner', url: '#partner-form' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Partner Pack', url: '/resources/downloads' } },
      ],
      mediaPreview: _hero,
    },
    meta: {
      title: 'Partner Programme — iNELS Smart Building',
      description: 'Join 500+ certified iNELS partners. Get leads, training, technical support, and co-marketing from Europe\'s most complete smart building platform.',
    },
    layout: [
      {
        blockType: 'featureCards',
        blockName: 'Partner Benefits',
        variant: 'floating',
        intro: rt('What you get as an iNELS partner'),
        items: [
          { icon: 'Users', richText: rt3('Qualified Leads', 'Inbound project leads from your region routed directly to you.') },
          { icon: 'Sparkles', richText: rt3('Technical Training', 'Online and on-site certification programmes for every product line.') },
          { icon: 'MessageCircle', richText: rt3('Dedicated Support', 'Priority phone and on-site technical support from our engineering team.') },
          { icon: 'Star', richText: rt3('Co-Marketing', 'Joint case studies, press coverage, and trade show presence.') },
          { icon: 'ChartBarIncreasing', richText: rt3('Competitive Margins', 'Transparent tiered pricing with clear rules and no hidden costs.') },
          { icon: 'Rocket', richText: rt3('Product Roadmap Access', 'Early access to new products and beta testing programmes.') },
        ],
      },
      {
        blockType: 'contentSection',
        blockName: 'Partnership Tiers',
        variant: 'centeredGrid',
        intro: rt('Three partnership tiers'),
        items: [
          { icon: 'IdCard', richText: rt3('Authorised Partner', 'Entry level. Access to products, pricing, and basic training.') },
          { icon: 'Shield', richText: rt3('Certified Partner', 'Technical certification complete. Priority support and lead routing.') },
          { icon: 'Star', richText: rt3('Premium Partner', 'Top tier. Co-marketing, dedicated account manager, and roadmap access.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Partner Stats',
        stats: [
          { richText: rt3('500+', 'Active partners worldwide') },
          { richText: rt3('40+', 'Countries in the partner network') },
          { richText: rt3('3-level', 'Certification programme') },
        ],
      },
      {
        blockType: 'testimonials',
        blockName: 'Partner Testimonials',
        intro: rt('What our partners say'),
        items: [
          {
            logo,
            richText: rtp(
              'The iNELS partner programme transformed our business. The lead routing is genuine — we get qualified project enquiries every week.',
            ),
            author: 'Stefan Müller',
            role: 'Managing Director, AutoBuild Solutions GmbH',
            avatar: logo,
          },
          {
            logo,
            richText: rtp(
              'The technical training is world-class. Our team completed certification in three days and we were delivering projects the following week.',
            ),
            author: 'Ondřej Kříž',
            role: 'Technical Director, SmartSystems CZ',
            avatar: logo,
          },
        ],
      },
      {
        blockType: 'formBlock',
        blockName: 'Partner Enquiry Form',
        intro: rt('Ready to become a partner?', 'Fill in your details and our partner team will be in touch within 48 hours.'),
        form: contactFormId,
      },
      {
        blockType: 'cta',
        blockName: 'Partner Portal CTA',
        richText: rt('Already a partner?', 'Access the iNELS partner portal for pricing, documentation, and lead management.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Access Partner Portal', url: '/partner-portal' } },
        ],
      },
    ],
  }
}
