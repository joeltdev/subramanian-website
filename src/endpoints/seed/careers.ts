import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { hero: number; logo: number; contactFormId: number }

export function careersPage({ hero, logo, contactFormId: _contactFormId }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Careers',
    slug: 'careers',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Join the iNELS Team',
      richText: rt(
        'Build the future of intelligent buildings with us.',
        'iNELS and Elko EP are growing. We\'re looking for engineers, product managers, sales specialists, and technical support professionals who want to make buildings smarter.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'See Open Positions', url: '#positions' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Learn About Our Culture', url: '#culture' } },
      ],
      mediaPreview: hero,
    },
    meta: {
      title: 'Careers at iNELS — Build the Future of Smart Buildings',
      description: 'Join iNELS and Elko EP. We\'re hiring engineers, product managers, and technical specialists who want to make buildings smarter.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Company Culture',
        variant: 'splitImage',
        intro: rt(
          'We build things that last.',
          'Our products sit inside buildings for 15+ years. We take quality, documentation, and reliability as seriously as our engineers take protocol compliance. Every new hire inherits a 30-year culture of doing the right thing.',
        ),
        imageLight: hero,
        imageDark: hero,
      },
      {
        blockType: 'featureCards',
        blockName: 'Why Join iNELS',
        variant: 'floating',
        intro: rt('Why people join iNELS'),
        items: [
          { icon: 'Globe', richText: rt3('Hybrid Work', 'Work from our offices in Brno and Prague, or from home — your choice.') },
          { icon: 'Sparkles', richText: rt3('Learning Budget', 'Annual training and conference budget for every team member.') },
          { icon: 'Shield', richText: rt3('Health Benefits', 'Comprehensive health insurance and wellness support.') },
          { icon: 'Star', richText: rt3('Team Retreats', 'Annual team off-sites and regular team events.') },
          { icon: 'Zap', richText: rt3('Hardware Discounts', 'Staff discounts on iNELS products for your own home.') },
          { icon: 'Rocket', richText: rt3('Real Impact', 'Your work ends up in buildings used by thousands of people every day.') },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Team Stats',
        stats: [
          { richText: rt3('150+', 'Team members') },
          { richText: rt3('12', 'Nationalities represented') },
          { richText: rt3('30 years', 'Of company stability') },
          { richText: rt3('3', 'Offices across Europe') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Careers CTA',
        richText: rt('Ready to build something that matters?', 'Send us your CV and a note about what you\'d build if you joined us.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Get in Touch', url: '/contact' } },
        ],
      },
    ],
  }
}
