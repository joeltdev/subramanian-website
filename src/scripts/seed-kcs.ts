import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()
process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'temp-secret-for-seed'

import { getPayload } from 'payload'
import config from '../payload.config'

const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('🚀 Starting FINAL KCS Data Restore...')

  // 1. Clear existing data
  payload.logger.info('🧹 Clearing old data...')
  try {
    await payload.db.deleteMany({ collection: 'pages', req: {} as any, where: {} })
    await payload.db.deleteMany({ collection: 'posts', req: {} as any, where: {} })
    await payload.db.deleteMany({ collection: 'media', req: {} as any, where: {} })
  } catch (e) {}

  // 2. Helper to fetch and upload media
  const uploadMedia = async (url: string, alt: string) => {
    try {
      const response = await fetch(url)
      const buffer = Buffer.from(await response.arrayBuffer())
      const filename = url.split('/').pop()?.split('?')[0] || 'image.png'
      
      return await payload.create({
        collection: 'media',
        data: { alt },
        file: {
          data: buffer,
          name: filename,
          mimetype: response.headers.get('content-type') || 'image/jpeg',
          size: buffer.length,
        },
      })
    } catch (e) {
      return null
    }
  }

  payload.logger.info('📸 Fetching Media...')
  const logo = await uploadMedia('https://www.kcsubramanian.in/api/media/file/logoiu.png', 'KCS Logo')
  const heroImg = await uploadMedia('https://www.kcsubramanian.in/api/media/file/llo.jpg', 'K.C. Subramanian Profile')
  const manifestoImg = await uploadMedia('https://www.kcsubramanian.in/api/media/file/ChatGPT%20Image%20Mar%2025%2C%202026%2C%2008_11_17%20PM.png', 'Tharoor Manifesto Poster')
  const activityImg1 = await uploadMedia('https://www.kcsubramanian.in/api/media/file/ledf.jpeg', 'Public Service')
  const activityImg2 = await uploadMedia('https://www.kcsubramanian.in/api/media/file/lop.png', 'Political Life')

  // 3. Create Home Page
  payload.logger.info('🏠 Building Home Page...')
  await payload.create({
    collection: 'pages',
    context: { disableRevalidate: true },
    data: {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      hero: {
        type: 'section1',
        badgeLabel: 'ജനസേവകൻ',
        richText: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h1',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'കെ.സി. സുബ്രഹ്മണ്യൻ', version: 1 }],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'ജനസേവനവും സാമൂഹിക വികസനവും ലക്ഷ്യമാക്കി പ്രവർത്തിക്കുന്ന നേതാവാണ് കെ.സി. സുബ്രഹ്മണ്യൻ. എഞ്ചിനീയറിംഗ് മേഖലയിലും പൊതുജന സേവന രംഗത്തും ദീർഘകാല അനുഭവമുള്ള അദ്ദേഹം, സമൂഹത്തിന്റെ പുരോഗതിക്കും സമത്വത്തിനുമായി നിരന്തരം പ്രവർത്തിച്ചു കൊണ്ടിരിക്കുന്നു.', version: 1 }],
              },
            ],
            direction: 'ltr',
          },
        },
        mediaPreview: heroImg?.id,
      },
      layout: [
        {
          blockType: 'manifestoPromo',
          backgroundImage: manifestoImg?.id,
          title: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'തരൂരിന്റെ വികസന മാനിഫെസ്റ്റോ', version: 1 }],
              }],
              direction: 'ltr',
            },
          },
          description: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'പോസ്റ്ററുകൾ, പ്രചാരണ സാമഗ്രികൾ, മുഴുവൻ മാനിഫെസ്റ്റോ PDF എന്നിവ ഉൾക്കൊള്ളുന്ന സമഗ്ര ദർശന രേഖ.', version: 1 }],
              }],
              direction: 'ltr',
            },
          },
          cta: {
            type: 'custom',
            label: 'Read Manifesto',
            url: '/manifesto',
            appearance: 'default',
          },
        },
        {
          blockType: 'home_slider',
          intro_n_a: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'പ്രധാന പ്രവർത്തനങ്ങൾ', version: 1 }],
              }],
              direction: 'ltr',
            },
          },
          items: [
            {
              tabLabel: 'സേവനവും വികസന',
              title: 'പൊതു സേവനവും വികസന പ്രവർത്തനങ്ങളും',
              description: 'എഞ്ചിനീയറായി പ്രവർത്തിച്ച് ഗ്രാമ, ബ്ലോക്ക്, ജില്ല തലങ്ങളിൽ വികസന പദ്ധതികൾ ആസൂത്രണം ചെയ്തു. ഇറിഗേഷൻയും ലോക്കൽ സെൽഫ് ഗവൺമെന്റ് വകുപ്പിലും സേവനം അനുഷ്ഠിച്ച് സൂപ്രണ്ടിംഗ് എഞ്ചിനീയറായി വിരമിച്ചു.',
              image: activityImg1?.id || heroImg?.id,
            },
            {
              tabLabel: 'ജീവിതം',
              title: 'രാഷ്ട്രീയ ജീവിതം',
              description: 'സ്കൂൾ കാലം മുതൽ തന്നെ അദ്ദേഹം ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസിന്റെ പിന്തുണക്കാരനായിരുന്നു. KSU അംഗമായിരിക്കുമ്പോൾ SSLC ക്ലാസ് ലീഡറായി പ്രവർത്തിച്ചു.',
              image: activityImg2?.id || heroImg?.id,
            },
          ],
        },
        {
          blockType: 'featureCards',
          variant: 'grid',
          intro: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              children: [{
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                version: 1,
                children: [{ type: 'text', text: 'വഹിച്ച സ്ഥാനങ്ങൾ', version: 1 }],
              }],
              direction: 'ltr',
            },
          },
          items: [
            {
              richText: {
                root: {
                  type: 'root',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      type: 'heading',
                      tag: 'h3',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'സ്റ്റേറ്റ് പ്രസിഡന്റ്', version: 1 }],
                    },
                    {
                      type: 'paragraph',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'കേരള ഗസറ്റഡ് ഓഫീസേഴ്സ് യൂണിയൻ (2023–2026)', version: 1 }],
                    },
                  ],
                  direction: 'ltr',
                },
              },
            },
            {
              richText: {
                root: {
                  type: 'root',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      type: 'heading',
                      tag: 'h3',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'ബ്ലോക്ക് പഞ്ചായത്ത് അംഗം', version: 1 }],
                    },
                    {
                      type: 'paragraph',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'വടക്കാഞ്ചേരി ബ്ലോക്ക്, തൃശൂർ (1995–2000)', version: 1 }],
                    },
                  ],
                  direction: 'ltr',
                },
              },
            },
            {
              richText: {
                root: {
                  type: 'root',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      type: 'heading',
                      tag: 'h3',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'മുൻ താലൂക്ക് പ്രസിഡന്റ്', version: 1 }],
                    },
                    {
                      type: 'paragraph',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [{ type: 'text', text: 'മാതൃഭൂമി സ്റ്റഡി സർകിൾ, തലപ്പള്ളി (1991–1995)', version: 1 }],
                    },
                  ],
                  direction: 'ltr',
                },
              },
            },
          ],
        },
      ],
    },
  })

  // 4. Update Globals
  payload.logger.info('⚙️ Configuring Globals...')
  
  await payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      logo: logo?.id,
      tabs: [{ label: 'Home', link: { type: 'custom', url: '/', label: 'Home' } }],
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      logo: logo?.id,
      copyright: `© ${new Date().getFullYear()} K.C. Subramanian. All rights reserved.`,
      socialLinks: [{ platform: 'facebook', url: 'https://facebook.com/kcsubramanian' }],
      columns: [{ heading: 'Quick Links', links: [{ link: { type: 'custom', url: '/', label: 'Home' } }] }],
    },
  })

  await payload.updateGlobal({
    slug: 'theme-settings',
    context: { disableRevalidate: true },
    data: {
      primaryColorPreset: 'oklch(68.5% 0.169 237.32)',
      radiusPreset: '0',
    },
  })

  payload.logger.info('✅ Restore Successful!')
  process.exit(0)
}

seed()
