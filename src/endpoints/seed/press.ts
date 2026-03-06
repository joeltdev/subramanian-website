import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

export function pressPage(): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Press',
    slug: 'press',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Press',
      richText: rt(
        'iNELS in the news.',
        'Press releases, media assets, and contact information for journalists and analysts covering smart building technology.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Download Press Kit', url: '/resources/downloads' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Media Enquiry', url: '/contact' } },
      ],
    },
    meta: {
      title: 'Press — iNELS Media Resources & Press Kit',
      description: 'Press releases, media assets, and contact information for journalists and analysts covering iNELS smart building technology.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Media Resources',
        variant: 'centeredGrid',
        intro: rt('Media resources'),
        items: [
          { icon: 'Layers', richText: rt3('Press Kit', 'Company fact sheet, product imagery, and brand assets for editorial use.') },
          { icon: 'MessageCircle', richText: rt3('Spokesperson', 'Available for comment on smart building technology, energy efficiency, and building automation.') },
          { icon: 'Pencil', richText: rt3('Media Contact', 'press@inels.com — response within 24 hours for verified media.') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Press CTA',
        richText: rt('Covering smart buildings?', "We'd love to contribute expert commentary or arrange a product briefing for your publication."),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Get in Touch', url: '/contact' } },
        ],
      },
    ],
  }
}
