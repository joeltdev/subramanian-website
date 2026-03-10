import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = { contactFormId: number; logo: number }

export function getDemoPage({ contactFormId, logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Book a Demo',
    slug: 'get-demo',
    _status: 'published',
    hero: {
      type: 'section1',
      richText: rt(
        'See iNELS in action — free 30-minute demo.',
        'Tell us about your project and a certified iNELS solutions engineer will show you exactly how automation can work for your building.',
        'h1',
      ),
      links: [],
    },
    meta: {
      title: 'Book a Demo — iNELS Smart Building Automation',
      description: 'Book a free 30-minute iNELS product demo. See smart lighting, climate, energy, and integration in action for your building type.',
    },
    layout: [
      {
        blockType: 'stats',
        blockName: 'Trust Stats',
        stats: [
          { richText: rt3('500+', 'Certified integration partners') },
          { richText: rt3('40+', 'Countries deployed') },
          { richText: rt3('30 min', 'Focused demo — no sales pitch') },
        ],
      },
      {
        blockType: 'formBlock',
        blockName: 'Demo Request Form',
        form: contactFormId,
        intro: rt('What happens next?', 'After submitting, a solutions engineer will contact you within one business day to schedule your personalised demo session.'),
      },
      {
        blockType: 'testimonials',
        blockName: 'Demo Social Proof',
        intro: rt('What others say after their demo'),
        items: [
          {
            logo,
            richText: rtp('The demo was the most useful 30 minutes in our entire procurement process. We had answers to every technical question.'),
            author: 'Markus Weber',
            role: 'Senior BMS Engineer, TechBuild GmbH',
            avatar: logo,
          },
          {
            logo,
            richText: rtp('Within a week of the demo we had a proposal and a site assessment booked. iNELS made it easy.'),
            author: 'Katarína Horáčková',
            role: 'Facility Manager, Penta Group',
            avatar: logo,
          },
        ],
      },
    ],
  }
}
