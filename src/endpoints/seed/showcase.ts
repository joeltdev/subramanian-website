import type { RequiredDataFromCollectionSlug } from 'payload'

type ShowcaseImages = {
  heroImg: number
  smartHome: number
  building: number
  office: number
  hotel: number
  datacenter: number
  product: number
  residential: number
  healthcare: number
  industrial: number
  retail: number
  logo: number
}

// ─── Lexical helpers ─────────────────────────────────────────────────────────

function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return {
    type: 'heading' as const,
    children: [
      {
        type: 'text' as const,
        detail: 0,
        format: 0,
        mode: 'normal' as const,
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: 1,
  }
}

function lexicalParagraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [
      {
        type: 'text' as const,
        detail: 0,
        format: 0,
        mode: 'normal' as const,
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function richTextHeadingParagraph(headingText: string, paragraphText: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  return {
    root: {
      type: 'root' as const,
      children: [lexicalHeading(headingText, tag), lexicalParagraph(paragraphText)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richTextHeadingOnly(headingText: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  return {
    root: {
      type: 'root' as const,
      children: [lexicalHeading(headingText, tag)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richTextParagraphOnly(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [lexicalParagraph(text)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richTextH3Paragraph(h3Text: string, paragraphText: string) {
  return {
    root: {
      type: 'root' as const,
      children: [lexicalHeading(h3Text, 'h3'), lexicalParagraph(paragraphText)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function richTextH3Only(h3Text: string) {
  return richTextHeadingOnly(h3Text, 'h3')
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function showcasePageData(
  images: ShowcaseImages,
  caseStudyIds: [number, number, number],
  contactFormId: number,
): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'iNELS Platform — Block Showcase',
    slug: 'showcase',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Introducing iNELS Cloud 3.0',
      richText: {
        root: {
          type: 'root',
          children: [
            lexicalHeading('The Intelligent Building Platform for Every Scale', 'h1'),
            lexicalParagraph(
              'iNELS delivers end-to-end smart building solutions — from a single smart switch to a fully integrated campus-wide automation network.',
            ),
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Request a Demo', url: '/contact' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Explore Products', url: '/products' } },
      ],
      mediaPreview: images.heroImg,
    },
    layout: [
      // ── Block 1: logoCloud section1 ────────────────────────────────────────
      {
        blockType: 'logoCloud',
        blockName: 'Trusted Integrators',
        type: 'section1',
        heading: "Trusted by the world's leading integrators",
        logos: [
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
        ],
      },

      // ── Block 2: stats ─────────────────────────────────────────────────────
      {
        blockType: 'stats',
        blockName: 'Platform Stats',
        stats: [
          {
            richText: richTextH3Paragraph('15+', 'Years of innovation'),
          },
          {
            richText: richTextH3Paragraph('50,000+', 'Smart installations worldwide'),
          },
          {
            richText: richTextH3Paragraph('40+', 'Countries deployed'),
          },
          {
            richText: richTextH3Paragraph('500+', 'Product SKUs'),
          },
          {
            richText: richTextH3Paragraph('2M+', 'Connected devices managed'),
          },
          {
            richText: richTextH3Paragraph('99.9%', 'Cloud platform uptime'),
          },
        ],
      },

      // ── Block 3: featureCards floating ────────────────────────────────────
      {
        blockType: 'featureCards',
        blockName: 'Three Pillars',
        variant: 'floating',
        intro: richTextHeadingParagraph(
          'Three pillars of intelligent buildings',
          'Whether automating a single apartment or a multi-campus facility, iNELS has the complete solution.',
        ),
        items: [
          {
            icon: 'Sparkles',
            richText: richTextH3Paragraph(
              'Smart Home',
              'Retrofit or new build: intuitive control of lighting, heating, security, and AV systems.',
            ),
          },
          {
            icon: 'Settings2',
            richText: richTextH3Paragraph(
              'Building Automation',
              'HVAC, access control, energy metering, and BMS for commercial spaces of any scale.',
            ),
          },
          {
            icon: 'Cloud',
            richText: richTextH3Paragraph(
              'IoT Cloud Platform',
              'Centralised device management, real-time analytics, and an open API ecosystem.',
            ),
          },
        ],
      },

      // ── Block 4: featureShowcase perspective ──────────────────────────────
      {
        blockType: 'featureShowcase',
        blockName: 'Smart Home Perspective',
        variant: 'perspective',
        intro: richTextHeadingParagraph(
          'Smart Home, Reimagined',
          'iNELS RF and KNX product lines give residents intuitive control over every aspect of their home.',
        ),
        items: [
          {
            icon: 'Zap',
            richText: richTextH3Paragraph(
              'Lighting & Scene Control',
              'Set the perfect ambience with one tap or voice command.',
            ),
          },
          {
            icon: 'Activity',
            richText: richTextH3Paragraph(
              'Climate Management',
              'Multi-zone HVAC scheduling with energy-saving presence detection.',
            ),
          },
          {
            icon: 'Shield',
            richText: richTextH3Paragraph(
              'Security & Access',
              'Smart locks, cameras, and alarms unified in a single app.',
            ),
          },
          {
            icon: 'Cpu',
            richText: richTextH3Paragraph(
              'Mobile & Voice Control',
              'Control everything from the iNELS app, Alexa, or Google Home.',
            ),
          },
          {
            icon: 'Zap',
            richText: richTextH3Paragraph(
              'Energy Monitoring',
              'Real-time consumption graphs and automated load balancing.',
            ),
          },
        ],
        imageForeground: images.smartHome,
        imageDark: images.datacenter,
        imageLight: images.heroImg,
      },

      // ── Block 5: contentSection splitImage ────────────────────────────────
      {
        blockType: 'contentSection',
        blockName: 'Residential Split',
        variant: 'splitImage',
        intro: richTextHeadingParagraph(
          'Automation that speaks to every resident',
          'From first-time smart home owners to seasoned facilities managers, iNELS products are designed to be installed once and loved forever.',
        ),
        imageDark: images.smartHome,
        imageLight: images.smartHome,
        quote: richTextParagraphOnly(
          'iNELS transformed how our residential projects are delivered. Installation time dropped by 40% and our clients haven\'t looked back.',
        ),
        quoteAuthor: 'Jan Novák, Lead Systems Integrator, SmartBuild CZ',
        quoteLogo: images.logo,
      },

      // ── Block 6: featureBento stats ───────────────────────────────────────
      {
        blockType: 'featureBento',
        blockName: 'Smart Home Bento Stats',
        variant: 'stats',
        stat: 'Complete smart home control — zero compromises',
        items: [
          {
            icon: 'Settings',
            richText: richTextH3Paragraph('Scene Scheduling', 'Automate your day from sunrise to sleep.'),
          },
          {
            icon: 'Activity',
            richText: richTextH3Paragraph('Multi-zone HVAC', 'Independent temperature control per room.'),
          },
          {
            icon: 'Layers',
            richText: richTextH3Paragraph(
              'Blind & Shading Control',
              'Motorised blinds integrated with lighting scenes.',
            ),
          },
          {
            icon: 'BarChart',
            richText: richTextH3Paragraph('Energy Dashboards', 'Monitor and optimise energy use in real time.'),
          },
          {
            icon: 'Fingerprint',
            richText: richTextH3Paragraph('Presence Detection', 'PIR and CO2 sensors drive smart automation.'),
          },
        ],
      },

      // ── Block 7: featureShowcase split ────────────────────────────────────
      {
        blockType: 'featureShowcase',
        blockName: 'Building Automation Split',
        variant: 'split',
        intro: richTextHeadingParagraph(
          'Building Automation at Scale',
          'iNELS KNX, BACnet, and Modbus solutions deliver enterprise-grade management for hotels, offices, hospitals, and industrial facilities.',
        ),
        items: [
          {
            icon: 'Code',
            richText: richTextH3Paragraph(
              'Open Protocol Native',
              'KNX, BACnet, and Modbus — no proprietary lock-in.',
            ),
          },
          {
            icon: 'Layers',
            richText: richTextH3Paragraph(
              'Multi-floor Zoning',
              'Independent zone control across every floor and tenant.',
            ),
          },
          {
            icon: 'BarChart',
            richText: richTextH3Paragraph(
              'Tenant Sub-metering',
              'Accurate energy billing per tenant or cost centre.',
            ),
          },
          {
            icon: 'Shield',
            richText: richTextH3Paragraph(
              'Fire & Security Integration',
              'Certified fire panel and access control integration.',
            ),
          },
          {
            icon: 'Cpu',
            richText: richTextH3Paragraph(
              'Central Supervision Console',
              'Full facility overview on a single dashboard.',
            ),
          },
        ],
        imageDark: images.building,
        imageLight: images.office,
      },

      // ── Block 8: integrations tiles ───────────────────────────────────────
      {
        blockType: 'integrations',
        blockName: 'Integration Tiles',
        variant: 'tiles',
        intro: richTextHeadingParagraph(
          'Connects with your entire technology stack',
          'iNELS speaks the language of every major building protocol and consumer ecosystem — no gateways needed.',
        ),
        integrations: [
          { logo: images.logo, link: { label: 'KNX', url: '/integrations/knx', type: 'custom' } },
          { logo: images.logo, link: { label: 'Modbus', url: '/integrations/modbus', type: 'custom' } },
          { logo: images.logo, link: { label: 'BACnet', url: '/integrations/bacnet', type: 'custom' } },
          { logo: images.logo, link: { label: 'MQTT', url: '/integrations/mqtt', type: 'custom' } },
          { logo: images.logo, link: { label: 'Amazon Alexa', url: '/integrations/alexa', type: 'custom' } },
          { logo: images.logo, link: { label: 'Google Home', url: '/integrations/google-home', type: 'custom' } },
          { logo: images.logo, link: { label: 'Apple HomeKit', url: '/integrations/homekit', type: 'custom' } },
          { logo: images.logo, link: { label: 'DALI', url: '/integrations/dali', type: 'custom' } },
        ],
        centerLogo: images.logo,
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'View integration docs', url: '/docs' } },
        ],
      },

      // ── Block 9: featureBento accordion ───────────────────────────────────
      {
        blockType: 'featureBento',
        blockName: 'Product Range Accordion',
        variant: 'accordion',
        intro: richTextHeadingParagraph(
          'Explore the full iNELS product range',
          'Over 500 SKUs engineered for every use case.',
        ),
        accordionItems: [
          {
            icon: 'Settings2',
            title: 'Smart Switches & Controls',
            richText: richTextParagraphOnly(
              'Retrofit-friendly switches and dimmers for KNX and RF systems.',
            ),
            image: images.product,
          },
          {
            icon: 'Activity',
            title: 'Thermostats & HVAC',
            richText: richTextParagraphOnly(
              'Programmable thermostats with presence detection and multi-zone support.',
            ),
            image: images.product,
          },
          {
            icon: 'Lock',
            title: 'Security & Access',
            richText: richTextParagraphOnly('Smart locks, video intercoms, and alarm panel integration.'),
            image: images.product,
          },
          {
            icon: 'Zap',
            title: 'Lighting Control',
            richText: richTextParagraphOnly('DALI and 0-10V drivers for LED and HID lighting.'),
            image: images.product,
          },
          {
            icon: 'Zap',
            title: 'Energy Meters',
            richText: richTextParagraphOnly('DIN-rail Modbus/KNX sub-meters with cloud reporting.'),
            image: images.product,
          },
          {
            icon: 'Cpu',
            title: 'Sensors & Detectors',
            richText: richTextParagraphOnly(
              'Temperature, humidity, CO2, motion, and presence sensors.',
            ),
            image: images.product,
          },
        ],
      },

      // ── Block 10: hoverHighlights ─────────────────────────────────────────
      {
        blockType: 'hoverHighlights',
        blockName: 'Product Line Highlights',
        beforeHighlights: 'From a single smart switch',
        highlights: [
          { text: 'iNELS RF Line', mediaTop: images.product, mediaBottom: images.smartHome, link: { type: 'custom', url: '/products/rf' } },
          { text: 'iNELS KNX Line', mediaTop: images.smartHome, mediaBottom: images.product, link: { type: 'custom', url: '/products/knx' } },
          { text: 'iNELS Cloud', mediaTop: images.datacenter, mediaBottom: images.smartHome, link: { type: 'custom', url: '/products/cloud' } },
          { text: 'Open Integrations', mediaTop: images.product, mediaBottom: images.datacenter, link: { type: 'custom', url: '/integrations' } },
        ],
        afterHighlights: '...to a fully intelligent building.',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'View full product catalogue',
              url: '/products',
            },
          },
        ],
      },

      // ── Block 11: mediaCards ──────────────────────────────────────────────
      {
        blockType: 'mediaCards',
        blockName: 'Environment Cards',
        intro: richTextHeadingParagraph(
          'Built for every environment',
          'From cosy apartments to sprawling campuses, iNELS solutions adapt to any scale and sector.',
        ),
        items: [
          { media: images.residential, richText: richTextH3Only('Residential & Multi-family'), link: { type: 'custom', url: '/solutions/residential' } },
          { media: images.hotel, richText: richTextH3Only('Hotel & Hospitality'), link: { type: 'custom', url: '/solutions/hospitality' } },
          { media: images.office, richText: richTextH3Only('Office & Workplace'), link: { type: 'custom', url: '/solutions/office' } },
          { media: images.healthcare, richText: richTextH3Only('Healthcare Facilities'), link: { type: 'custom', url: '/solutions/healthcare' } },
          { media: images.retail, richText: richTextH3Only('Retail & Commercial'), link: { type: 'custom', url: '/solutions/retail' } },
          { media: images.industrial, richText: richTextH3Only('Industrial & Logistics'), link: { type: 'custom', url: '/solutions/industrial' } },
        ],
      },

      // ── Block 12: contentSection wideImageCta ─────────────────────────────
      {
        blockType: 'contentSection',
        blockName: 'Site Assessment CTA',
        variant: 'wideImageCta',
        intro: richTextHeadingParagraph(
          'Your next project deserves the best',
          'Book a free site assessment with a certified iNELS partner near you.',
        ),
        image: images.building,
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'Book a Site Assessment',
              url: '/contact',
            },
          },
        ],
      },

      // ── Block 13: featureBento metrics ────────────────────────────────────
      {
        blockType: 'featureBento',
        blockName: 'Global Metrics',
        variant: 'metrics',
        stat: 'Active in 40+ countries across 4 continents',
        panelItems: [
          {
            icon: 'Globe',
            label: 'EMEA Headquarters',
            heading: richTextH3Only('Prague, Czech Republic'),
          },
          {
            icon: 'Users',
            label: '500+ Certified Partners',
            heading: richTextH3Only('Across 40+ countries'),
          },
          {
            icon: 'Database',
            label: '24/7 Cloud Operations',
            heading: richTextH3Only('99.9% uptime SLA'),
          },
        ],
      },

      // ── Block 14: featureBento panels ─────────────────────────────────────
      {
        blockType: 'featureBento',
        blockName: 'Sector Image Panels',
        variant: 'panels',
        imagePanels: [
          {
            richText: richTextH3Only('Smart Home'),
            imageDark: images.smartHome,
            imageLight: images.smartHome,
          },
          {
            richText: richTextH3Only('Commercial Office'),
            imageDark: images.building,
            imageLight: images.office,
          },
          {
            richText: richTextH3Only('Hotel Automation'),
            imageDark: images.hotel,
            imageLight: images.hotel,
          },
          {
            richText: richTextH3Only('Industrial Control'),
            imageDark: images.industrial,
            imageLight: images.industrial,
          },
        ],
      },

      // ── Block 15: contentSection centeredGrid ─────────────────────────────
      {
        blockType: 'contentSection',
        blockName: 'Why Integrators Choose iNELS',
        variant: 'centeredGrid',
        intro: richTextHeadingParagraph(
          'Why integrators choose iNELS',
          'The complete ecosystem that makes every project simpler, faster, and more profitable to deliver.',
        ),
        items: [
          {
            icon: 'Code',
            richText: richTextH3Paragraph('Open Protocols', 'KNX, BACnet, Modbus, MQTT — your choice.'),
          },
          {
            icon: 'Cloud',
            richText: richTextH3Paragraph('Local + Cloud', 'Works offline; syncs to cloud when available.'),
          },
          {
            icon: 'Settings',
            richText: richTextH3Paragraph(
              '10-Year Product Availability',
              'Long-term sourcing guarantee for every SKU.',
            ),
          },
          {
            icon: 'MessageCircle',
            richText: richTextH3Paragraph(
              'Dedicated Technical Support',
              'Phone, email, and on-site from certified partners.',
            ),
          },
          {
            icon: 'RefreshCw',
            richText: richTextH3Paragraph(
              'Regular Firmware Updates',
              'OTA updates keep every device current.',
            ),
          },
          {
            icon: 'Star',
            richText: richTextH3Paragraph(
              'CE & KNX Certified',
              'Meets EU standards for commercial and residential use.',
            ),
          },
        ],
      },

      // ── Block 16: testimonials ────────────────────────────────────────────
      {
        blockType: 'testimonials',
        blockName: 'Partner Testimonials',
        intro: richTextHeadingOnly('What our partners say'),
        testimonials: [
          {
            logo: images.logo,
            richText: richTextParagraphOnly(
              'iNELS is the only platform that let us deliver a hotel project in 6 weeks without a single rework.',
            ),
            author: 'Markus Weber',
            role: 'Senior BMS Engineer, TechBuild GmbH',
            avatar: images.logo,
          },
          {
            logo: images.logo,
            richText: richTextParagraphOnly(
              "We've standardised all our residential projects on iNELS RF. Commissioning time is half what it used to be.",
            ),
            author: 'Sofia Eriksson',
            role: 'Lead Integrator, SmartLiving Nordic',
            avatar: images.logo,
          },
          {
            logo: images.logo,
            richText: richTextParagraphOnly(
              'The iNELS energy metering solution paid for itself within 18 months. Truly impressive ROI.',
            ),
            author: 'Tomáš Kratochvíl',
            role: 'Facilities Director, Penta Real Estate',
            avatar: images.logo,
          },
        ],
      },

      // ── Block 17: caseStudiesHighlight ────────────────────────────────────
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Case Studies',
        intro: richTextHeadingParagraph(
          'Real projects. Real results.',
          'Explore how iNELS delivers measurable outcomes across sectors and geographies.',
        ),
        caseStudies: [caseStudyIds[0], caseStudyIds[1], caseStudyIds[2]],
      },

      // ── Block 18: logoCloud section3 ──────────────────────────────────────
      {
        blockType: 'logoCloud',
        blockName: 'Standards & Certifications',
        type: 'section3',
        heading: 'Certified and compatible with leading standards',
        logos: [
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
          { logo: images.logo },
        ],
      },

      // ── Block 19: articleGrid ─────────────────────────────────────────────
      {
        blockType: 'articleGrid',
        blockName: 'Latest Articles',
        intro: richTextHeadingParagraph(
          'Latest from iNELS',
          'Insights, case studies, and product updates from the iNELS team.',
        ),
        populateBy: 'collection',
      },

      // ── Block 20: archive ─────────────────────────────────────────────────
      {
        blockType: 'archive',
        blockName: 'Knowledge Base',
        intro: richTextHeadingParagraph(
          'From the iNELS Knowledge Base',
          'Technical guides, case studies, and product documentation.',
          'h3',
        ),
        populateBy: 'collection',
        relationTo: 'posts',
        limit: 4,
      },

      // ── Block 21: content (3 columns) ─────────────────────────────────────
      {
        blockType: 'content',
        blockName: 'Product Line Overview',
        columns: [
          {
            size: 'oneThird',
            enableLink: false,
            richText: richTextH3Paragraph(
              'RF Line',
              '868 MHz wireless, up to 200 devices per controller, ideal for retrofits.',
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richTextH3Paragraph(
              'KNX Line',
              'International KNX standard, ETS5/6 programming, for new builds.',
            ),
          },
          {
            size: 'oneThird',
            enableLink: false,
            richText: richTextH3Paragraph(
              'Cloud Platform',
              'REST & WebSocket API, OTA updates, role-based access control.',
            ),
          },
        ],
      },

      // ── Block 22: mediaBlock ──────────────────────────────────────────────
      {
        blockType: 'mediaBlock',
        blockName: 'Product Image',
        media: images.product,
      },

      // ── Block 23: cta ─────────────────────────────────────────────────────
      {
        blockType: 'cta',
        blockName: 'Final CTA',
        richText: richTextHeadingParagraph(
          'Ready to build smarter?',
          'Join 50,000+ installations worldwide. Let our team design the perfect iNELS solution for your next project.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/contact' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Contact Sales', url: '/contact' } },
        ],
      },

      // ── Block 24: formBlock ───────────────────────────────────────────────
      {
        blockType: 'formBlock',
        blockName: 'Contact Form',
        intro: richTextHeadingParagraph(
          'Get in touch with our team',
          "Tell us about your project and we'll connect you with a certified iNELS partner in your region.",
        ),
        form: contactFormId,
      },
    ],
  }
}
