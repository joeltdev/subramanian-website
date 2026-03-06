import type { RequiredDataFromCollectionSlug } from 'payload'
import { richText, lexicalHeading, lexicalParagraph } from './helpers'

function legalContent(...nodes: Array<ReturnType<typeof lexicalHeading> | ReturnType<typeof lexicalParagraph>>) {
  return richText(...nodes)
}

export function termsPage(): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Terms & Conditions',
    slug: 'terms',
    _status: 'published',
    hero: {
      type: 'none',
    },
    meta: {
      title: 'Terms & Conditions — iNELS',
      description: 'Terms and conditions for using the iNELS website and services.',
    },
    layout: [
      {
        blockType: 'content',
        blockName: 'Terms Content',
        columns: [
          {
            size: 'full',
            richText: legalContent(
              lexicalHeading('Terms & Conditions', 'h2'),
              lexicalParagraph('By accessing and using the iNELS website and services, you accept and agree to be bound by these terms and conditions. Please read them carefully before using our services.'),
              lexicalParagraph('iNELS products and services are provided subject to the terms outlined herein. We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any revised terms.'),
              lexicalParagraph('For questions regarding these terms, please contact legal@inels.com.'),
            ),
          },
        ],
      },
    ],
  }
}

export function privacyPage(): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Privacy Policy',
    slug: 'privacy',
    _status: 'published',
    hero: {
      type: 'none',
    },
    meta: {
      title: 'Privacy Policy — iNELS',
      description: 'How iNELS collects, uses, and protects your personal data in accordance with GDPR.',
    },
    layout: [
      {
        blockType: 'content',
        blockName: 'Privacy Content',
        columns: [
          {
            size: 'full',
            richText: legalContent(
              lexicalHeading('Privacy Policy', 'h2'),
              lexicalParagraph('iNELS (Elko EP s.r.o.) is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR) and applicable national laws.'),
              lexicalParagraph('We collect personal data you provide directly (name, email, company, project details) for the purpose of responding to enquiries, delivering services, and improving our platform. We do not sell your data to third parties.'),
              lexicalParagraph('You have the right to access, correct, delete, or port your personal data at any time. Contact our Data Protection Officer at dpo@inels.com.'),
            ),
          },
        ],
      },
    ],
  }
}

export function cookiePage(): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Cookie Policy',
    slug: 'cookies',
    _status: 'published',
    hero: {
      type: 'none',
    },
    meta: {
      title: 'Cookie Policy — iNELS',
      description: 'How iNELS uses cookies to ensure functionality, improve performance, and analyse usage.',
    },
    layout: [
      {
        blockType: 'content',
        blockName: 'Cookie Content',
        columns: [
          {
            size: 'full',
            richText: legalContent(
              lexicalHeading('Cookie Policy', 'h2'),
              lexicalParagraph('This website uses cookies to ensure basic functionality, improve performance, and analyse usage. By continuing to use this site, you consent to our use of cookies as described in this policy.'),
              lexicalParagraph('We use three categories of cookies: Essential (required for site operation), Analytics (anonymous usage data to improve the site), and Marketing (to show relevant content). You can manage your cookie preferences at any time via the cookie settings panel.'),
              lexicalParagraph('For more information, contact privacy@inels.com.'),
            ),
          },
        ],
      },
    ],
  }
}
