import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number }

export function resourcesHubPage({ hero }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Resources',
    slug: 'resources',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Resources',
      richText: rt(
        'Everything you need to specify, install, and manage iNELS.',
        'Technical datasheets, installation manuals, case studies, whitepapers, training videos, and webinars — all in one place.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Browse Resources', url: '#resources' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Request a Custom Datasheet', url: '/get-demo' } },
      ],
      mediaPreview: hero,
    },
    meta: {
      title: 'Resources — iNELS Technical Downloads & Training',
      description: 'Technical datasheets, installation manuals, case studies, whitepapers, training videos, and webinars for iNELS smart building systems.',
    },
    layout: [
      {
        blockType: 'mediaCards',
        blockName: 'Resource Types',
        intro: rt('Resource types'),
        items: [
          {
            media: hero,
            richText: rt3('Case Studies', 'Real deployments, real ROI numbers.'),
            link: { type: 'custom', url: '/resources/case-studies' },
          },
          {
            media: hero,
            richText: rt3('Technical Downloads', 'Datasheets, manuals, BIM files.'),
            link: { type: 'custom', url: '/resources/downloads' },
          },
          {
            media: hero,
            richText: rt3('Blog & Articles', 'Industry insights and technical guides.'),
            link: { type: 'custom', url: '/articles' },
          },
          {
            media: hero,
            richText: rt3('Training & Webinars', 'Online certification and video courses.'),
            link: { type: 'custom', url: '/resources/training' },
          },
        ],
      },
      {
        blockType: 'newsletterSubscription',
        blockName: 'Newsletter',
        badge: 'Stay informed',
        intro: rt('Get the iNELS technical digest', 'Monthly datasheets, new products, and deployment tips — straight to your inbox.'),
        submitButtonLabel: 'Subscribe',
      },
      {
        blockType: 'cta',
        blockName: 'Resources CTA',
        richText: rt('Looking for something specific?', 'Our technical team can point you to the right resources for your project.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Contact Technical Support', url: '/support' } },
        ],
      },
    ],
  }
}
