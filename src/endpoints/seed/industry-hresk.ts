import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3 } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function industryHresk({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'HRESK',
    slug: 'hresk',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'HRESK — Hotel Energy Saving',
      richText: rt(
        'A 250-room hotel wasting 30% of room energy is burning €60,000 a year. The iNELS HRESK kit pays back in 18 months.',
        'iNELS HRESK (Hotel Room Energy Saving Kit) is a rapid-deploy package — key card holder, presence sensor, room controller — that cuts room energy without replacing your existing systems.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Download ROI Calculator', url: '/resources/downloads' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Book a Hotel Demo', url: '/get-demo' } },
      ],
    },
    meta: {
      title: 'HRESK Hotel Energy Saving — iNELS Hotel Automation',
      description:
        'iNELS HRESK: rapid-deploy hotel room energy saving kit with 18-month ROI, key card cut-off, presence-based HVAC setback, and central energy reporting.',
    },
    layout: [
      {
        blockType: 'contentSection',
        blockName: 'Hotel Energy ROI Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The hotel energy ROI problem',
          'Hotels want to cut energy but cannot afford long payback periods or disruptive installation. HRESK was designed to deliver measurable ROI with minimal disruption to operations.',
        ),
        items: [
          {
            icon: 'Zap',
            richText: rt3(
              'High per-room energy cost',
              'Climate and lighting left running between guests and during long guest absences drives 30-40% waste.',
            ),
          },
          {
            icon: 'Settings',
            richText: rt3(
              'Existing infrastructure cannot be replaced',
              'Full room replacement is not feasible during operation. The solution must work with what is already installed.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Long payback periods deter investment',
              'Hotel owners need to see ROI within 2 years to justify the capital expenditure.',
            ),
          },
        ],
      },
      {
        blockType: 'featureShowcase',
        blockName: 'HRESK Solution',
        variant: 'split',
        intro: rt(
          'The fastest ROI in hotel energy management',
          'The HRESK kit installs in under 2 hours per room, works with existing systems, and starts delivering savings from day one.',
        ),
        items: [
          {
            icon: 'IdCard',
            richText: rt3(
              'Key Card Holder Energy Cut-off',
              'All non-essential loads cut when the guest removes their key card — zero energy waste between stays.',
            ),
          },
          {
            icon: 'Activity',
            richText: rt3(
              'Presence Sensor for Climate Setback',
              'Room climate returns to setback temperature within minutes of the guest leaving.',
            ),
          },
          {
            icon: 'Zap',
            richText: rt3(
              'Retrofit — No New Wiring',
              'HRESK components fit into existing room infrastructure — no rewiring, no downtime.',
            ),
          },
          {
            icon: 'BarChart',
            richText: rt3(
              'Central Energy Reporting',
              'Per-room energy data aggregated to a central dashboard for management reporting.',
            ),
          },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      {
        blockType: 'featureCards',
        blockName: 'HRESK Solutions',
        variant: 'floating',
        intro: rt('Key solutions in the HRESK kit'),
        items: [
          {
            icon: 'IdCard',
            richText: rt3('Key Card Energy Cut-off', 'Automatic all-loads cut-off when the key card is removed from the holder.'),
          },
          {
            icon: 'Activity',
            richText: rt3('Presence-Based Setback', 'HVAC setback triggered by absence detection for maximum energy saving.'),
          },
          {
            icon: 'BarChart',
            richText: rt3('Energy Reporting', 'Per-room energy monitoring with central dashboard and export.'),
          },
          {
            icon: 'Database',
            richText: rt3('PMS Integration', 'Automated room management linked to check-in and check-out events.'),
          },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'HRESK ROI',
        stats: [
          { richText: rt3('18 months', 'Payback period for HRESK deployment') },
          { richText: rt3('40%', 'Room energy reduction after installation') },
          { richText: rt3('< 2 hours', 'Per room installation time') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'HRESK CTA',
        richText: rt(
          'Calculate your hotel energy savings.',
          'Download the ROI calculator or speak to our hotel energy team.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Download ROI Calculator', url: '/resources/downloads' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Book a Hotel Demo', url: '/get-demo' } },
        ],
      },
    ],
  }
}
