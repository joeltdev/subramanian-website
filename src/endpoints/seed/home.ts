import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'
import { rt, rt3, rtp } from './helpers'

type HomeArgs = {
  metaImage: Media
  hero: number
  lighting: number
  shading: number
  climate: number
  energy: number
  remote: number
  integration: number
  smartHome: number
  building: number
  office: number
  hotel: number
  residential: number
  product: number
  logo: number
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
  hero,
  lighting,
  shading,
  climate,
  energy,
  remote,
  integration,
  smartHome,
  building,
  office,
  hotel,
  residential,
  product,
  logo,
}) => {
  return {
    slug: 'home',
    title: 'Home',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Smart Building Automation',
      richText: rt(
        'For homes, hotels and buildings',
        'We are leading manufacturer of automation and controls for lighting, HVAC, shading and energy management with wired and wireless systems.',
        'h1',
      ),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Know more',
            url: '/platform',
          },
        },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'iNELS — Smart Building Automation for Homes, Hotels & Buildings',
      description:
        'iNELS is a leading manufacturer of automation and controls for lighting, HVAC, shading and energy management with wired and wireless systems.',
      image: metaImage.id,
    },
    layout: [
      // ── Parallax Showcase ────────────────────────────────────────────────────
      {
        blockType: 'parallaxShowcase',
        blockName: 'Platform Overview',
        intro: rt(
          'One Platform. Complete Building Control',
          'Control lighting, climate, shading and energy with one integrated iNELS platform.',
        ),
        autoScrollInterval: 5,
        slides: [
          {
            name: 'Lighting',
            content: rt3(
              'Intelligent Lighting Control',
              'Scene-based lighting automation for every room. DALI, 0-10V and KNX dimming built in.',
            ),
            backgroundImage: lighting,
            link: { type: 'custom', url: '/solutions/lighting', label: 'Explore Lighting' },
          },
          {
            name: 'Shading',
            content: rt3(
              'Automated Shading',
              'Motorised blinds and curtains with sun-tracking and scene integration.',
            ),
            backgroundImage: shading,
            link: { type: 'custom', url: '/solutions/shading', label: 'Explore Shading' },
          },
          {
            name: 'Climate',
            content: rt3(
              'Climate & HVAC Control',
              'Room-by-room temperature control with presence-based scheduling and BACnet/Modbus integration.',
            ),
            backgroundImage: climate,
            link: { type: 'custom', url: '/solutions/climate', label: 'Explore Climate' },
          },
          {
            name: 'Energy',
            content: rt3(
              'Energy Management',
              'Real-time sub-metering per circuit, floor and tenant. Reduce waste and automate reporting.',
            ),
            backgroundImage: energy,
            link: { type: 'custom', url: '/solutions/energy-management', label: 'Explore Energy' },
          },
          {
            name: 'Remote',
            content: rt3(
              'Remote Access & Control',
              'Manage your entire building from anywhere with the iNELS mobile app and cloud dashboard.',
            ),
            backgroundImage: remote,
            link: { type: 'custom', url: '/solutions/remote-access', label: 'Explore Remote' },
          },
          {
            name: 'Integrations',
            content: rt3(
              'Open Integrations',
              'KNX, BACnet, Modbus, MQTT, Apple HomeKit, Google Home, Alexa and more — no gateways needed.',
            ),
            backgroundImage: integration,
            link: { type: 'custom', url: '/solutions/integrations', label: 'Explore Integrations' },
          },
        ],
      },

      // ── Media Cards ──────────────────────────────────────────────────────────
      {
        blockType: 'mediaCards',
        blockName: 'Built for Every Space',
        intro: rt(
          'Built for Every Space',
          'We adapt to homes, commercial buildings and hospitality projects.',
        ),
        items: [
          {
            media: smartHome,
            richText: rt3(
              'Home & Apartments',
              'Comfortable living with intelligent lighting, climate and shading control. Easy installation for new homes and retrofit projects.',
            ),
            link: { type: 'custom', url: '/industries/villas-apartments', label: 'Learn more' },
          },
          {
            media: office,
            richText: rt3(
              'Commercial Buildings',
              'Centralised automation for offices, retail and public spaces. Improve efficiency, comfort and operational control.',
            ),
            link: { type: 'custom', url: '/industries/commercial', label: 'Learn more' },
          },
          {
            media: hotel,
            richText: rt3(
              'Hotels & Hospitality',
              'Guest-room automation with energy-saving occupancy logic. Enhance guest comfort and reduce operating costs.',
            ),
            link: { type: 'custom', url: '/industries/grms', label: 'Learn more' },
          },
          {
            media: building,
            richText: rt3(
              'Retrofit Buildings',
              'Upgrade existing buildings without structural changes. iNELS Wireless installs quickly with minimal disruption.',
            ),
            link: { type: 'custom', url: '/solutions/remote-access', label: 'Learn more' },
          },
        ],
      },

      // ── Hover Highlights ─────────────────────────────────────────────────────
      {
        blockType: 'hoverHighlights',
        blockName: 'iNELS Ecosystem',
        beforeHighlights: 'The Complete iNELS Ecosystem,',
        highlights: [
          {
            text: 'Matter',
            mediaTop: product,
            mediaBottom: smartHome,
            link: { type: 'custom', url: '/solutions/integrations' },
          },
          {
            text: 'iNELS Home',
            mediaTop: smartHome,
            mediaBottom: product,
            link: { type: 'custom', url: '/platform' },
          },
          {
            text: 'Wireless Solutions',
            mediaTop: residential,
            mediaBottom: smartHome,
            link: { type: 'custom', url: '/solutions/wireless' },
          },
          {
            text: 'BUS Solution',
            mediaTop: building,
            mediaBottom: product,
            link: { type: 'custom', url: '/solutions/bus' },
          },
          {
            text: 'Intercom',
            mediaTop: product,
            mediaBottom: building,
            link: { type: 'custom', url: '/solutions/intercom' },
          },
          {
            text: 'GRMS',
            mediaTop: hotel,
            mediaBottom: product,
            link: { type: 'custom', url: '/industries/grms' },
          },
        ],
        afterHighlights: 'everything as one system.',
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'See all solutions',
              url: '/solutions',
            },
          },
        ],
      },

      // ── Integrations ─────────────────────────────────────────────────────────
      {
        blockType: 'integrations',
        blockName: 'Integrations',
        variant: 'tiles',
        intro: rt(
          'Integrate with Your Favorite Platforms',
          'Powered by MQTT, iNELS Cloud, and Matter, iNELS ensures secure integration and seamless connectivity across modern ecosystems.',
        ),
        integrations: [
          { logo, link: { label: 'KNX', url: '/integrations/knx', type: 'custom' } },
          { logo, link: { label: 'BACnet', url: '/integrations/bacnet', type: 'custom' } },
          { logo, link: { label: 'Modbus', url: '/integrations/modbus', type: 'custom' } },
          { logo, link: { label: 'MQTT', url: '/integrations/mqtt', type: 'custom' } },
          { logo, link: { label: 'Matter', url: '/integrations/matter', type: 'custom' } },
          { logo, link: { label: 'Apple HomeKit', url: '/integrations/homekit', type: 'custom' } },
          { logo, link: { label: 'Google Home', url: '/integrations/google-home', type: 'custom' } },
          { logo, link: { label: 'Amazon Alexa', url: '/integrations/alexa', type: 'custom' } },
        ],
        centerLogo: logo,
        links: [
          {
            link: {
              type: 'custom',
              appearance: 'default',
              label: 'View all integrations',
              url: '/solutions/integrations',
            },
          },
        ],
      },

      // ── Stats ────────────────────────────────────────────────────────────────
      {
        blockType: 'stats',
        blockName: 'Company Stats',
        intro: rt('Designed and Manufactured in Czech Republic'),
        stats: [
          { richText: rt3('30+', 'Years of innovation') },
          { richText: rt3('50,000+', 'Smart installations worldwide') },
          { richText: rt3('30 M+', 'Connected devices') },
        ],
      },

      // ── Article Grid ─────────────────────────────────────────────────────────
      {
        blockType: 'articleGrid',
        blockName: 'Latest Articles',
        intro: rt(
          'Latest from iNELS',
          'Explore product news, automation insights and project stories.',
        ),
        populateBy: 'collection',
      },

      // ── FAQ ──────────────────────────────────────────────────────────────────
      {
        blockType: 'faq',
        blockName: 'Frequently Asked Questions',
        variant: 'single',
        intro: rt(
          'Frequently Asked Questions',
          'Discover quick and comprehensive answers to common questions about our platform, services, and features.',
        ),
        supportLine: {
          subtitle: "Don't see what you're looking for?",
          linkLabel: 'Contact us',
          type: 'custom',
          url: '/contact',
          newTab: false,
        },
        groups: [
          {
            name: 'General',
            items: [
              {
                question: 'What is the difference between wireless and bus systems?',
                answer: rtp(
                  'A bus system uses physical cables to connect devices along a shared communication line, offering reliable but less flexible connectivity. In contrast, a wireless system transmits data through radio waves, allowing greater mobility and easier installation but is more prone to interference. While bus systems are preferred for stability, wireless systems are ideal for flexible or mobile setups.',
                ),
              },
              {
                question: 'How can I control my heating remotely?',
                answer: rtp(
                  'A bus system uses physical cables to connect devices along a shared communication line, offering reliable but less flexible connectivity. In contrast, a wireless system transmits data through radio waves, allowing greater mobility and easier installation but is more prone to interference. While bus systems are preferred for stability, wireless systems are ideal for flexible or mobile setups.',
                ),
              },
              {
                question: 'Are iNELS products compatible with other smart home systems?',
                answer: rtp(
                  'A bus system uses physical cables to connect devices along a shared communication line, offering reliable but less flexible connectivity. In contrast, a wireless system transmits data through radio waves, allowing greater mobility and easier installation but is more prone to interference. While bus systems are preferred for stability, wireless systems are ideal for flexible or mobile setups.',
                ),
              },
              {
                question: 'Do you offer support for system installation and setup?',
                answer: rtp(
                  'A bus system uses physical cables to connect devices along a shared communication line, offering reliable but less flexible connectivity. In contrast, a wireless system transmits data through radio waves, allowing greater mobility and easier installation but is more prone to interference. While bus systems are preferred for stability, wireless systems are ideal for flexible or mobile setups.',
                ),
              },
            ],
          },
        ],
      },

      // ── CTA ──────────────────────────────────────────────────────────────────
      {
        blockType: 'cta',
        blockName: 'Home CTA',
        richText: rt(
          'Ready to build smarter?',
          'Join 50,000+ installations worldwide. Let our team design the perfect iNELS solution for your next project.',
        ),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Find an Installer', url: '/find-installer' } },
        ],
      },
    ],
  }
}
