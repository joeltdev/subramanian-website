# iNELS Full Website Seed — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Seed all ~32 pages of the iNELS corporate website with realistic marketing content, using existing blocks, following the GTM-reviewed site anatomy from brainstorming.

**Architecture:** Modular seed files per section group (`solutions-*.ts`, `industries-*.ts`, etc.), all wired into the existing `src/endpoints/seed/index.ts` orchestrator. Shared lexical helpers are already in `showcase.ts` — extract into a shared `helpers.ts`. Images use picsum.photos with deterministic seeds. All pages use `_status: 'published'`.

**Tech Stack:** Payload CMS 3.x, TypeScript, `RequiredDataFromCollectionSlug<'pages'>`, existing block types confirmed from `showcase.ts`.

**Block type slugs confirmed from codebase:**
- `logoCloud`, `stats`, `featureCards`, `featureShowcase`, `contentSection`, `featureBento`
- `integrations`, `hoverHighlights`, `mediaCards`, `testimonials`, `caseStudiesHighlight`
- `cta` (CallToAction — slug is `'cta'` not `'callToAction'`)
- `faq`, `form`, `articleGrid`, `parallaxShowcase`, `gallery`, `newsletterSubscription`
- `mediaBlock`, `content`, `banner`
- `productHero`, `productListing`
- Hero is NOT a layout block — it's the `hero` field directly on the page

**Before starting:** Run `pnpm tsc --noEmit` to confirm baseline compiles. Seed runs via `/api/seed` endpoint in admin UI or `pnpm seed`.

---

## Phase 1: Shared Infrastructure

### Task 1: Extract Shared Lexical Helpers

**Files:**
- Create: `src/endpoints/seed/helpers.ts`

The helper functions currently living in `showcase.ts` must be extracted so all new seed files can import them. Do NOT modify `showcase.ts` yet — add imports from helpers.ts in a later step.

**Step 1: Create the helpers file**

```typescript
// src/endpoints/seed/helpers.ts
// Shared lexical rich-text builder helpers for all seed files.

export function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4') {
  return {
    type: 'heading' as const,
    children: [
      { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    tag,
    version: 1,
  }
}

export function lexicalParagraph(text: string) {
  return {
    type: 'paragraph' as const,
    children: [
      { type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

export function richText(...children: ReturnType<typeof lexicalHeading | typeof lexicalParagraph>[]) {
  return {
    root: {
      type: 'root' as const,
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

/** richText with h2 + paragraph — the most common intro pattern */
export function rt(heading: string, paragraph?: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2') {
  const children = paragraph
    ? [lexicalHeading(heading, tag), lexicalParagraph(paragraph)]
    : [lexicalHeading(heading, tag)]
  return richText(...children)
}

/** richText with h3 + paragraph — used for feature item richText */
export function rt3(h3: string, paragraph?: string) {
  return rt(h3, paragraph, 'h3')
}

/** richText with paragraph only */
export function rtp(paragraph: string) {
  return richText(lexicalParagraph(paragraph))
}

/** richText with h3 only */
export function rt3h(h3: string) {
  return rt(h3, undefined, 'h3')
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd /path/to/inels-content-studio && pnpm tsc --noEmit
```
Expected: no errors related to helpers.ts

**Step 3: Commit**

```bash
git add src/endpoints/seed/helpers.ts
git commit -m "feat: add shared lexical helpers for website seed"
```

---

### Task 2: Add New Media Assets to Index

**Files:**
- Modify: `src/endpoints/seed/index.ts`

The new pages need additional images. Add these fetches alongside the existing ones in the `seed` function. Keep the existing fetches untouched — append to the parallel `Promise.all`.

**Step 1: Add new image fetches in `index.ts` after the existing showcase image block**

Add these additional `fetchFileByURL` calls inside the same or a new `Promise.all` block:

```typescript
// Add to index.ts inside the seed function, after the existing media seeding block:

const [
  solutionsHeroBuffer,
  lightingBuffer,
  shadingBuffer,
  climateBuffer,
  energyBuffer,
  remoteBuffer,
  integrationBuffer,
  villaBuffer,
  residentialBuildingBuffer,
  commercialBuffer,
  grmsBuffer,
  hreskBuffer,
  smartCityBuffer,
  factoryBuffer,
  platformDiagramBuffer,
  teamBuffer,
  partnerBuffer,
  downloadBuffer,
] = await Promise.all([
  fetchFileByURL('https://picsum.photos/seed/solutions-hero/1400/900'),
  fetchFileByURL('https://picsum.photos/seed/lighting-control/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/shading-blinds/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/climate-hvac/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/energy-meter/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/remote-mobile/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/open-integration/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/villa-exterior/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/apartment-block/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/commercial-office/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/hotel-room/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/hotel-energy/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/smart-city-night/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/factory-floor/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/platform-diagram/1400/900'),
  fetchFileByURL('https://picsum.photos/seed/team-office/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/partner-handshake/1200/800'),
  fetchFileByURL('https://picsum.photos/seed/download-center/800/600'),
])

// Then create media docs for each:
const [
  solutionsHeroDoc,
  lightingDoc,
  shadingDoc,
  climateDoc,
  energyDoc,
  remoteDoc,
  integrationDoc,
  villaDoc,
  residentialBuildingDoc,
  commercialDoc,
  grmsDoc,
  hreskDoc,
  smartCityDoc,
  factoryDoc,
  platformDiagramDoc,
  teamDoc,
  partnerDoc,
  downloadDoc,
] = await Promise.all([
  payload.create({ collection: 'media', data: { alt: 'iNELS solutions overview' }, file: solutionsHeroBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Lighting control scene' }, file: lightingBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Automated shading blinds' }, file: shadingBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Climate HVAC control' }, file: climateBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Energy meter dashboard' }, file: energyBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Remote mobile control' }, file: remoteBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Open integration ecosystem' }, file: integrationBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Luxury villa exterior' }, file: villaBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Apartment residential building' }, file: residentialBuildingBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Commercial office building' }, file: commercialBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Hotel guest room' }, file: grmsBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Hotel energy management' }, file: hreskBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Smart city at night' }, file: smartCityBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Smart factory floor' }, file: factoryBuffer }),
  payload.create({ collection: 'media', data: { alt: 'iNELS platform architecture diagram' }, file: platformDiagramBuffer }),
  payload.create({ collection: 'media', data: { alt: 'iNELS team in office' }, file: teamBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Partner handshake' }, file: partnerBuffer }),
  payload.create({ collection: 'media', data: { alt: 'Download center resources' }, file: downloadBuffer }),
])
```

**Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

**Step 3: Commit**

```bash
git add src/endpoints/seed/index.ts
git commit -m "feat: add media assets for full website seed"
```

---

## Phase 2: Solutions Section

### Task 3: Solutions Hub Page

**Files:**
- Create: `src/endpoints/seed/solutions-hub.ts`

This is the `/solutions` landing page — a navigator page that routes buyers into the 6 solution sub-pages.

```typescript
// src/endpoints/seed/solutions-hub.ts
import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rt3h, rtp } from './helpers'

type Args = { hero: number; logo: number }

export function solutionsHub({ hero, logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Solutions',
    slug: 'solutions',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Intelligent Building Solutions',
      richText: rt(
        'Every building need. One integrated platform.',
        'iNELS delivers end-to-end automation for lighting, climate, shading, energy, remote access, and open integration — engineered to work together from day one.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Explore Solutions', url: '#solutions' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Book a Demo', url: '/get-demo' } },
      ],
      mediaPreview: hero,
    },
    meta: {
      title: 'Solutions — iNELS Smart Building Automation',
      description: 'Explore iNELS lighting, shading, climate, energy, remote control, and open integration solutions for any building type.',
    },
    layout: [
      {
        blockType: 'featureCards',
        blockName: 'Solutions Grid',
        variant: 'floating',
        intro: rt('Six solutions. One ecosystem.', 'Choose the capabilities you need — or deploy them all for complete building intelligence.'),
        items: [
          { icon: 'Zap', richText: rt3('Lighting Control', 'Scenes, dimming, presence-adaptive automation. Create the perfect light for every moment.'), link: { type: 'custom', url: '/solutions/lighting-control' } },
          { icon: 'Layers', richText: rt3('Shading Automation', 'Sun-tracking blinds and curtains that protect comfort, privacy, and energy efficiency.'), link: { type: 'custom', url: '/solutions/shading-automation' } },
          { icon: 'Thermometer', richText: rt3('Climate Control', 'Room-by-room heating and cooling that adapts to occupancy and schedule.'), link: { type: 'custom', url: '/solutions/climate-control' } },
          { icon: 'BarChart', richText: rt3('Energy Management', 'Monitor, analyse, and optimise energy consumption across every zone.'), link: { type: 'custom', url: '/solutions/energy-management' } },
          { icon: 'Smartphone', richText: rt3('Remote Control', 'Manage any building from mobile, cloud, or touch panel — wherever you are.'), link: { type: 'custom', url: '/solutions/remote-control' } },
          { icon: 'Code', richText: rt3('Open Integration', 'KNX, BACnet, MQTT, REST API. iNELS connects with any BMS, PMS, or third-party platform.'), link: { type: 'custom', url: '/solutions/open-integration' } },
        ],
      },
      {
        blockType: 'stats',
        blockName: 'Platform Impact',
        stats: [
          { richText: rt3('50,000+', 'Smart installations worldwide') },
          { richText: rt3('40+', 'Countries deployed') },
          { richText: rt3('30%', 'Average energy cost reduction') },
          { richText: rt3('500+', 'Certified integration partners') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Solutions CTA',
        richText: rt('Not sure which solution fits your project?', 'Talk to an iNELS solutions engineer — free 30-minute consultation.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Free Consultation', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Find an Installer', url: '/find-installer' } },
        ],
      },
    ],
  }
}
```

**Step: Verify TypeScript compiles, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/solutions-hub.ts
git commit -m "feat: add solutions hub seed page"
```

---

### Task 4: Solution Pages — Lighting Control

**Files:**
- Create: `src/endpoints/seed/solution-lighting.ts`

This is the TEMPLATE page. All 6 solution pages follow this exact structure. Read this carefully before implementing the other 5.

**7-section formula (must follow for every solution page):**
1. Hero — pain-point headline
2. Problem statement — ContentSection
3. How iNELS solves it — FeatureShowcase split
4. Feature depth — FeatureBento
5. ROI stats — Stats block
6. Case study reference — CaseStudiesHighlight
7. Dual CTA — `cta` block

```typescript
// src/endpoints/seed/solution-lighting.ts
import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rt3h, rtp } from './helpers'

type Args = { hero: number; feature: number; logo: number; caseStudyIds: number[] }

export function solutionLighting({ hero, feature, logo, caseStudyIds }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Lighting Control',
    slug: 'lighting-control',
    _status: 'published',
    hero: {
      type: 'section2',
      badgeLabel: 'Lighting Control',
      richText: rt(
        'Lights left on in empty rooms cost thousands every year. iNELS ends that.',
        'Adaptive lighting automation that responds to presence, daylight levels, and schedules — so every space is perfectly lit and no watt is wasted.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
      ],
      backgroundImage: hero,
    },
    meta: {
      title: 'Lighting Control — iNELS Smart Building Automation',
      description: 'iNELS adaptive lighting control: scene automation, dimming, daylight harvesting, and presence detection for any building type.',
    },
    layout: [
      // 1. Problem statement
      {
        blockType: 'contentSection',
        blockName: 'The Lighting Problem',
        variant: 'centeredGrid',
        intro: rt(
          'The hidden cost of manual lighting',
          'Commercial buildings waste up to 40% of their lighting energy on unoccupied spaces. Residents forget to dim or switch off. Hotel guests leave rooms fully lit for hours. The fix isn\'t more switches — it\'s smarter automation.',
        ),
        items: [
          { icon: 'AlertTriangle', richText: rt3('40% energy wasted', 'Average lighting energy waste in commercial buildings from unoccupied spaces.') },
          { icon: 'Clock', richText: rt3('Manual scheduling fails', 'Fixed timers don\'t adapt to real occupancy, seasons, or weather changes.') },
          { icon: 'Users', richText: rt3('Occupant complaints', 'Too bright, too dim, wrong colour temperature — lighting directly impacts productivity and comfort.') },
        ],
      },
      // 2. How iNELS solves it
      {
        blockType: 'featureShowcase',
        blockName: 'Lighting Solution',
        variant: 'split',
        intro: rt(
          'Lighting that thinks for itself',
          'iNELS lighting control combines DALI, KNX, and 0-10V dimming with presence sensors, daylight harvesting, and scene automation.',
        ),
        items: [
          { icon: 'Activity', richText: rt3('Presence-Adaptive', 'PIR and microwave sensors switch and dim based on real occupancy — not timers.') },
          { icon: 'Sun', richText: rt3('Daylight Harvesting', 'Automatic dimming maintains target lux levels as natural light changes throughout the day.') },
          { icon: 'Layers', richText: rt3('Scene Automation', 'One-tap scenes for Morning, Meeting, Presentation, Evening — consistent every time.') },
          { icon: 'Zap', richText: rt3('DALI & 0-10V Native', 'Full compatibility with LED drivers and fixtures from all major manufacturers.') },
          { icon: 'Smartphone', richText: rt3('App & Voice Control', 'iNELS mobile app, Alexa, Google Home, and Apple HomeKit — residents choose their interface.') },
        ],
        imageLight: feature,
        imageDark: feature,
      },
      // 3. Feature depth
      {
        blockType: 'featureBento',
        blockName: 'Lighting Features',
        variant: 'stats',
        stat: 'Complete lighting intelligence — from a single room to an entire campus',
        items: [
          { icon: 'Settings', richText: rt3('Zone-Level Control', 'Independent control per room, floor, tenant, or zone.') },
          { icon: 'BarChart', richText: rt3('Energy Reporting', 'Real-time and historical lighting energy data per circuit.') },
          { icon: 'RefreshCw', richText: rt3('Astronomical Clock', 'Sunrise/sunset scheduling adjusts automatically for your latitude.') },
          { icon: 'Shield', richText: rt3('Emergency Lighting', 'DALI-2 emergency circuit monitoring and test scheduling.') },
          { icon: 'Cpu', richText: rt3('Central Management', 'Supervise all zones from a single dashboard or SCADA.') },
        ],
      },
      // 4. ROI stats
      {
        blockType: 'stats',
        blockName: 'Lighting ROI',
        stats: [
          { richText: rt3('Up to 40%', 'Lighting energy reduction with presence detection') },
          { richText: rt3('2–3 years', 'Typical ROI payback period for commercial retrofit') },
          { richText: rt3('100,000+', 'DALI channels managed by iNELS worldwide') },
          { richText: rt3('< 1 day', 'Commissioning time per floor with iNELS tooling') },
        ],
      },
      // 5. Case study reference
      {
        blockType: 'caseStudiesHighlight',
        blockName: 'Lighting Case Studies',
        intro: rt('Real results from real deployments'),
        caseStudies: caseStudyIds.slice(0, 2),
      },
      // 6. Dual CTA
      {
        blockType: 'cta',
        blockName: 'Lighting CTA',
        richText: rt('Ready to eliminate lighting waste?', 'Talk to a certified iNELS integrator or download the lighting control datasheet.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Download Datasheet', url: '/resources/downloads' } },
        ],
      },
    ],
  }
}
```

**Step: Verify TypeScript compiles, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/solution-lighting.ts
git commit -m "feat: add lighting control solution seed page"
```

---

### Task 5: Solution Pages — Shading Automation, Climate, Energy, Remote, Open Integration

**Files:**
- Create: `src/endpoints/seed/solution-shading.ts`
- Create: `src/endpoints/seed/solution-climate.ts`
- Create: `src/endpoints/seed/solution-energy.ts`
- Create: `src/endpoints/seed/solution-remote.ts`
- Create: `src/endpoints/seed/solution-integration.ts`

**Follow the EXACT same 6-section structure as Task 4.** Export name pattern: `solutionShading`, `solutionClimate`, etc.

**Content specification per page — fill into the template:**

#### solution-shading.ts — `solutionShading`
- slug: `shading-automation`
- Hero headline: `"Glare, overheating, and fading furniture cost more than motorised blinds ever will."`
- Hero sub: `"iNELS shading automation tracks sun position and weather in real time — protecting comfort, privacy, and thermal efficiency without manual intervention."`
- Problem items: `"Solar gain overheats rooms"`, `"Manual blinds reduce productivity"`, `"Fixed schedules ignore weather"`
- FeatureShowcase heading: `"Shading that follows the sun"`
- Feature items: `"Sun Position Tracking"`, `"Wind & Rain Safety Retraction"`, `"Privacy Mode Scheduling"`, `"Daylight & Glare Control"`, `"Integrated with Lighting Scenes"`
- FeatureBento stat: `"Automated shading — precision solar control for every facade"`
- Bento items: `"Facade Zone Control"`, `"Astronomical Scheduling"`, `"Weather Station Integration"`, `"Central BMS Override"`, `"Energy Reporting"`
- Stats: `"Up to 25% cooling load reduction"`, `"3-year payback"`, `"10,000+ motorised channels deployed"`, `"< 2h per zone commissioning"`
- CTA headline: `"Stop fighting the sun. Work with it."`

#### solution-climate.ts — `solutionClimate`
- slug: `climate-control`
- Hero headline: `"A building that's too hot in summer and too cold in winter is losing tenants, not just energy."`
- Hero sub: `"iNELS climate control brings room-by-room regulation that responds to occupancy, schedule, and weather — stable comfort with lower energy bills."`
- Problem items: `"Centralised HVAC ignores room occupancy"`, `"Manual thermostats waste energy"`, `"Tenant complaints from inconsistent temperatures"`
- FeatureShowcase heading: `"Climate control that adapts to how people actually use spaces"`
- Feature items: `"Room-Level Thermostat Control"`, `"Presence-Based Setback"`, `"Multi-Zone Scheduling"`, `"Underfloor & Radiator Control"`, `"BACnet/Modbus BMS Integration"`
- FeatureBento stat: `"Precise climate regulation — every room, every schedule"`
- Bento items: `"Heating & Cooling Unified"`, `"CO2 Ventilation Trigger"`, `"Holiday/Away Mode"`, `"Remote Override"`, `"Energy Sub-metering"`
- Stats: `"Up to 30% HVAC energy saving"`, `"2.5-year payback typical"`, `"200,000+ thermostats deployed"`, `"±0.5°C accuracy"`
- CTA headline: `"Give every room the climate its occupants deserve."`

#### solution-energy.ts — `solutionEnergy`
- slug: `energy-management`
- Hero headline: `"You can't manage what you can't measure. Most buildings are flying blind on energy."`
- Hero sub: `"iNELS energy management monitors consumption per room, floor, tenant, and circuit — then automates logic to cut waste and improve reporting."`
- Problem items: `"No per-zone visibility"`, `"Manual meter reading is error-prone"`, `"ESG reporting requires granular data"`
- FeatureShowcase heading: `"Energy visibility that drives action"`
- Feature items: `"Real-Time Sub-Metering"`, `"Automated Load Shedding"`, `"Tenant Billing Reports"`, `"ESG Dashboard"`, `"Anomaly Alerts"`
- FeatureBento stat: `"Complete energy visibility — from socket to building total"`
- Bento items: `"DIN-Rail Modbus Meters"`, `"Cloud Dashboards"`, `"Historical Trending"`, `"API Data Export"`, `"Multi-tariff Tracking"`
- Stats: `"Up to 35% energy cost reduction"`, `"ROI in 18 months typical"`, `"500,000+ metering points"`, `"5-min data resolution"`
- CTA headline: `"Turn your energy data into savings."`

#### solution-remote.ts — `solutionRemote`
- slug: `remote-control`
- Hero headline: `"Your building shouldn't require you to be on-site to manage it."`
- Hero sub: `"iNELS remote access gives facility managers, owners, and residents real-time control and alerts from any device, anywhere in the world."`
- Problem items: `"On-site presence required for routine changes"`, `"Delayed response to faults increases damage"`, `"Guests and residents expect instant mobile control"`
- FeatureShowcase heading: `"Full building control in your pocket"`
- Feature items: `"iNELS Mobile App (iOS & Android)"`, `"Cloud Supervision Dashboard"`, `"Touch Panel Integration"`, `"Push Alerts & Fault Notifications"`, `"Multi-site Management"`
- FeatureBento stat: `"Remote control — instant access from anywhere"`
- Bento items: `"Role-Based Access"`, `"Guest App Provisioning"`, `"VPN-Free Secure Cloud"`, `"Offline Local Fallback"`, `"API for Third-Party Apps"`
- Stats: `"< 200ms response time"`, `"99.9% cloud uptime SLA"`, `"150,000+ app users"`, `"5-min setup per unit"`
- CTA headline: `"Take control. From anywhere."`

#### solution-integration.ts — `solutionIntegration`
- slug: `open-integration`
- Hero headline: `"A smart building shouldn't be a walled garden. iNELS is open by design."`
- Hero sub: `"Connect iNELS with any BMS, PMS, or third-party platform via KNX, BACnet, Modbus, MQTT, REST API, and cloud connectors — unified control, zero lock-in."`
- Problem items: `"Proprietary systems block interoperability"`, `"Integrators waste weeks on custom glue code"`, `"PMS/BMS data silos prevent operational insight"`
- FeatureShowcase heading: `"The protocol-native open platform"`
- Feature items: `"KNX & BACnet Native"`, `"Modbus RTU/TCP"`, `"MQTT Broker"`, `"REST API & Webhooks"`, `"Hotel PMS Connectors (Opera, Protel)"`
- Integrations block (use `integrations` blockType):
  - intro: `"Every major protocol. Every major ecosystem."` / `"iNELS connects natively — no gateways, no middleware."`
  - integrations list: KNX, BACnet, Modbus, MQTT, REST API, Opera PMS, Google Home, Amazon Alexa, Apple HomeKit, DALI-2, Zigbee, Z-Wave
- FeatureBento stat: `"Open by design — integrate anything, lock into nothing"`
- Bento items: `"Certified KNX Partner"`, `"BACnet/IP & MSTP"`, `"MQTT v5 Broker"`, `"Cloud REST API"`, `"SDK & Developer Docs"`
- Stats: `"12+ open protocols supported"`, `"< 1 day integration time typical"`, `"200+ third-party certified integrations"`, `"API response < 50ms"`
- CTA headline: `"Your building. Your ecosystem. Your rules."`
- **Note:** This page gets an extra `integrations` block before FeatureBento. Use `blockType: 'integrations'`, `variant: 'tiles'`.

**Step: Implement all 5, verify each compiles, commit all together**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/solution-*.ts
git commit -m "feat: add 5 solution seed pages (shading, climate, energy, remote, integration)"
```

---

## Phase 3: Industries Section

### Task 6: Industries Hub Page

**Files:**
- Create: `src/endpoints/seed/industries-hub.ts`

```typescript
// src/endpoints/seed/industries-hub.ts
import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rtp } from './helpers'

type Args = {
  hero: number
  villa: number; residentialBuilding: number; commercial: number
  grms: number; hresk: number; smartCity: number; factory: number
}

export function industriesHub(args: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Industries',
    slug: 'industries',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'Industries We Serve',
      richText: rt(
        'Smart buildings for every sector.',
        'From a private villa to a smart city district — iNELS delivers automation solutions tailored to the specific demands of each industry.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Find Your Industry', url: '#industries' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Talk to an Expert', url: '/get-demo' } },
      ],
      mediaPreview: args.hero,
    },
    meta: {
      title: 'Industries — iNELS Smart Building Automation',
      description: 'iNELS smart building solutions for villas, residential buildings, commercial, hospitality (GRMS/HRESK), smart cities, and smart factories.',
    },
    layout: [
      {
        blockType: 'mediaCards',
        blockName: 'Industry Cards',
        intro: rt('Choose your industry', 'Explore solutions designed around your sector\'s specific challenges and regulations.'),
        items: [
          { media: args.villa, richText: rt3('Villas & Apartments', 'Luxury automation for private residences and multi-unit developments.'), link: { type: 'custom', url: '/industries/villas-apartments' } },
          { media: args.residentialBuilding, richText: rt3('Residential Buildings', 'Scalable smart home deployment across entire apartment blocks.'), link: { type: 'custom', url: '/industries/residential-buildings' } },
          { media: args.commercial, richText: rt3('Commercial', 'HVAC, lighting, and access control for offices, retail, and mixed-use.'), link: { type: 'custom', url: '/industries/commercial' } },
          { media: args.grms, richText: rt3('GRMS — Hotel Guest Rooms', 'Guest Room Management Systems that improve experience and cut energy.'), link: { type: 'custom', url: '/industries/grms' } },
          { media: args.hresk, richText: rt3('HRESK — Hotel Energy', 'Hotel Room Energy Saving Kits with measurable ROI per room.'), link: { type: 'custom', url: '/industries/hresk' } },
          { media: args.smartCity, richText: rt3('Smart Cities', 'District-scale infrastructure automation from street lighting to utilities.'), link: { type: 'custom', url: '/industries/smart-cities' } },
          { media: args.factory, richText: rt3('Smart Factories', 'Industrial automation with open protocols, safety integration, and OT/IT convergence.'), link: { type: 'custom', url: '/industries/smart-factories' } },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Industries CTA',
        richText: rt("Don't see your use case?", 'iNELS has deployed in 40+ countries across dozens of verticals. Tell us your challenge.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Contact an Expert', url: '/get-demo' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Read Case Studies', url: '/resources/case-studies' } },
        ],
      },
    ],
  }
}
```

**Step: Compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/industries-hub.ts
git commit -m "feat: add industries hub seed page"
```

---

### Task 7: Industry Pages — All 7

**Files:**
- Create: `src/endpoints/seed/industry-villas.ts`
- Create: `src/endpoints/seed/industry-residential.ts`
- Create: `src/endpoints/seed/industry-commercial.ts`
- Create: `src/endpoints/seed/industry-grms.ts`
- Create: `src/endpoints/seed/industry-hresk.ts`
- Create: `src/endpoints/seed/industry-smart-cities.ts`
- Create: `src/endpoints/seed/industry-smart-factories.ts`

**All industry pages follow this 6-section structure:**
1. Hero (section2 with background image)
2. Challenge statement — `contentSection centeredGrid` with 3 pain point items
3. iNELS answer — `featureShowcase split` with 4–5 capability items
4. Applicable solutions — `featureCards floating` linking to solution pages
5. Stats — `stats` block with 4 ROI/deployment numbers
6. Dual CTA — `cta` block

**Content specification per industry page:**

#### industry-villas.ts — `industryVillas`
- slug: `villas-apartments` (parent: `industries`)
  **Note on slugs:** Payload nested pages use a `breadcrumbs` or parent relationship. Check if the `pages` collection supports parent. If not, use flat slug `villas-apartments`.
- Hero headline: `"Your home should work as hard as you do — without you lifting a finger."`
- Hero sub: `"iNELS delivers whole-home automation for villas and premium apartments: lighting scenes, climate comfort, security, shading, and AV — all from one app."`
- Challenge items: `"Complexity of multi-system integration"`, `"Retrofit constraints in existing properties"`, `"Residents demand app control and voice commands"`
- FeatureShowcase heading: `"Premium living, intelligently automated"`
- Feature items: `"Whole-Home Scene Control"`, `"Multi-Room AV Integration"`, `"Security & Access"`, `"Guest Mode Provisioning"`, `"RF Retrofit — No New Cabling"`
- Solution cards: Lighting Control, Shading, Climate, Remote Control
- Stats: `"40% energy saving vs unautomated homes"`, `"1-day commissioning for a 4-bed villa"`, `"10,000+ premium residences"`, `"5-year product availability guarantee"`
- CTA: `"Design your perfect home automation."` / `"Speak to a certified residential integrator near you."`

#### industry-residential.ts — `industryResidential`
- slug: `residential-buildings`
- Hero headline: `"Deploy smart home technology across an entire apartment block — in days, not months."`
- Hero sub: `"iNELS RF and KNX solutions scale from a single unit to hundreds, with centralised management for the building manager and individual app control for every resident."`
- Challenge items: `"Per-unit rollout is too slow for developers"`, `"Building managers need centralised oversight"`, `"Residents expect modern smart home features"`
- FeatureShowcase heading: `"Scalable smart home deployment for developers"`
- Feature items: `"Central Building Management Console"`, `"Per-Unit App Access"`, `"Energy Sub-Metering per Unit"`, `"RF Wireless — No Rework"`, `"Intercom & Access Control"`
- Solution cards: Lighting, Climate, Energy Management, Remote Control
- Stats: `"80 units commissioned in 3 days (Novák Residences)"`, `"40% faster vs previous project"`, `"€150 per unit hardware cost typical"`, `"Zero callbacks in first 6 months"`
- CTA: `"Scale smart home across your entire development."`

#### industry-commercial.ts — `industryCommercial`
- slug: `commercial`
- Hero headline: `"Office buildings that waste energy and frustrate tenants don't retain them."`
- Hero sub: `"iNELS delivers HVAC control, tenant sub-metering, lighting automation, and access management for commercial buildings — reducing OpEx while improving occupant satisfaction."`
- Challenge items: `"High energy costs from centralised HVAC"`, `"Tenants demand granular billing transparency"`, `"ESG reporting requires metered data"`
- FeatureShowcase heading: `"Commercial building automation that pays for itself"`
- Feature items: `"Tenant-Level Sub-Metering"`, `"BACnet/KNX HVAC Control"`, `"Access Control Integration"`, `"ESG Reporting Dashboard"`, `"BMS/SCADA Integration"`
- Solution cards: Energy Management, Climate, Lighting, Open Integration
- Stats: `"30% HVAC energy reduction (Penta Tower case study)"`, `"12 floors, 40 tenants metered"`, `"3-year payback period"`, `"Full ESG reporting from day 1"`
- CTA: `"Make your building a better tenant proposition."`

#### industry-grms.ts — `industryGrms`
- slug: `grms`
- **Special focus: Revenue and guest experience FIRST, then features**
- Hero headline: `"Every minute a guest room sits at full climate while empty costs you money."`
- Hero sub: `"iNELS GRMS (Guest Room Management System) automates presence-based climate, lighting, and DND/MUR signalling — improving guest experience and cutting room energy costs by up to 40%."`
- Challenge items: `"Rooms left at full climate between guests"`, `"Manual DND/MUR signalling slows housekeeping"`, `"Guests expect seamless lighting and climate on arrival"`
- FeatureShowcase heading: `"GRMS that checks in before the guest does"`
- Feature items: `"Presence-Based HVAC Setback"`, `"DND/MUR Panel Integration"`, `"Welcome Scene on Key Card Insert"`, `"PMS Sync (Opera, Protel)"`, `"Centralised Housekeeping Dashboard"`
- Solution cards: Climate Control, Remote Control, Energy Management, Open Integration
- Stats: `"Up to 40% room energy saving"`, `"< €200 per room hardware cost"`, `"250 rooms deployed: Grand Hotel Praha"`, `"PMS integration in < 1 day"`
- CTA headline: `"Make every room smarter and every stay more comfortable."` — CTAs: `"Download GRMS Datasheet"`, `"Book a Hotel Demo"`

#### industry-hresk.ts — `industryHresk`
- slug: `hresk`
- **Revenue-impact-first content**
- Hero headline: `"A 250-room hotel wasting 30% of room energy is burning €60,000 a year. The iNELS HRESK kit pays back in 18 months."`
- Hero sub: `"iNELS HRESK (Hotel Room Energy Saving Kit) is a rapid-deploy package — key card holder, presence sensor, room controller — that cuts room energy without replacing your existing systems."`
- Challenge items: `"High per-room energy cost"`, `"Existing infrastructure can't be ripped out"`, `"Long payback periods deter investment"`
- FeatureShowcase heading: `"The fastest ROI in hotel energy management"`
- Feature items: `"Key Card Holder Energy Cut-off"`, `"Presence Sensor for Climate Setback"`, `"Retrofit — No New Wiring"`, `"Central Energy Reporting"`, `"Compatible with All Major PMS"`
- Stats: `"18-month payback period"`, `"40% room energy reduction"`, `"< 2 hours per room installation"`, `"Deployed in 50+ hotels across Europe"`
- Solution cards: Energy Management, Climate, Remote Control, Open Integration
- CTA headline: `"Calculate your hotel's HRESK payback."` — CTAs: `"Download ROI Calculator"`, `"Book a Hotel Demo"`

#### industry-smart-cities.ts — `industrySmartCities`
- slug: `smart-cities`
- Hero headline: `"Cities that automate their infrastructure spend less and serve citizens better."`
- Hero sub: `"iNELS smart city solutions manage street lighting, public building automation, utility metering, and district energy from a unified platform — scalable from a district to a metropolis."`
- Challenge items: `"Street lighting energy is the largest municipal OpEx"`, `"Siloed systems prevent unified management"`, `"Citizens expect data-driven, responsive services"`
- FeatureShowcase heading: `"District-scale automation on open protocols"`
- Feature items: `"Adaptive Street Lighting"`, `"Public Building BMS"`, `"District Energy Metering"`, `"Central SCADA Dashboard"`, `"Open Data API for City Platforms"`
- Stats: `"50% street lighting energy saving"`, `"20+ smart city deployments"`, `"Open REST API & MQTT"`, `"Central dashboard for 10,000+ points"`
- Solution cards: Lighting, Energy Management, Open Integration, Remote Control
- CTA: `"Bring intelligence to your city infrastructure."`

#### industry-smart-factories.ts — `industrySmartFactories`
- slug: `smart-factories`
- Hero headline: `"Industrial facilities that can't monitor and automate are losing competitive ground."`
- Hero sub: `"iNELS industrial automation bridges OT and IT — open protocols for SCADA integration, energy sub-metering by production line, and environmental control for precision manufacturing."`
- Challenge items: `"No per-line energy visibility"`, `"Legacy PLCs don't talk to modern IT systems"`, `"Environmental deviations affect product quality"`
- FeatureShowcase heading: `"Industrial automation that speaks every protocol"`
- Feature items: `"Modbus RTU/TCP for PLC Integration"`, `"Production-Line Sub-Metering"`, `"Environmental Monitoring (Temp/Humidity/CO2)"`, `"OT/IT Bridge via MQTT"`, `"SCADA Integration"`
- Stats: `"35% energy visibility improvement"`, `"Modbus, BACnet, MQTT native"`, `"ISO 50001 reporting ready"`, `"< 1 day per zone commissioning"`
- Solution cards: Energy Management, Climate, Open Integration, Remote Control
- CTA: `"Bring your factory into the intelligent era."`

**Step: Implement all 7, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/industry-*.ts
git commit -m "feat: add 7 industry seed pages"
```

---

## Phase 4: Core Company Pages

### Task 8: Platform / Technology Overview Page

**Files:**
- Create: `src/endpoints/seed/platform.ts`

This page explains the iNELS ecosystem architecture. It's the most important page for technical buyers and specifiers.

```typescript
// src/endpoints/seed/platform.ts
import type { RequiredDataFromCollectionSlug } from 'payload'
import { rt, rt3, rt3h, rtp } from './helpers'

type Args = { hero: number; diagram: number; logo: number }

export function platformPage({ hero, diagram, logo }: Args): RequiredDataFromCollectionSlug<'pages'> {
  return {
    title: 'Platform',
    slug: 'platform',
    _status: 'published',
    hero: {
      type: 'section1',
      badgeLabel: 'iNELS Technology Platform',
      richText: rt(
        'One ecosystem. Any building. Any protocol.',
        'The iNELS platform connects field devices, building controllers, cloud services, and third-party systems through a unified architecture — local-first, cloud-enhanced, and open by design.',
        'h1',
      ),
      links: [
        { link: { type: 'custom', appearance: 'default', label: 'Download Architecture Whitepaper', url: '/resources/downloads' } },
        { link: { type: 'custom', appearance: 'outline', label: 'Book a Technical Demo', url: '/get-demo' } },
      ],
      mediaPreview: diagram,
    },
    meta: {
      title: 'Platform — iNELS Smart Building Technology',
      description: 'iNELS platform architecture: RF wireless, KNX, BACnet, Modbus, MQTT, cloud, and mobile — the complete smart building technology ecosystem.',
    },
    layout: [
      // How it works — 4 layer architecture
      {
        blockType: 'contentSection',
        blockName: 'Platform Architecture',
        variant: 'centeredGrid',
        intro: rt('Four layers. One unified platform.', 'From the field device to the cloud dashboard, every layer of the iNELS architecture is designed for openness and reliability.'),
        items: [
          { icon: 'Cpu', richText: rt3('Field Devices', 'Switches, sensors, thermostats, meters, and actuators — wired KNX or wireless RF.') },
          { icon: 'Settings2', richText: rt3('Central Unit / Controller', 'iNELS central units process local logic with <10ms response — no cloud dependency.') },
          { icon: 'Cloud', richText: rt3('iNELS Cloud', 'Secure cloud sync for remote management, OTA updates, and analytics.') },
          { icon: 'Smartphone', richText: rt3('App & Interfaces', 'Mobile app, web dashboard, touch panels, and third-party voice assistants.') },
        ],
      },
      // Protocol support
      {
        blockType: 'featureShowcase',
        blockName: 'Protocol Support',
        variant: 'split',
        intro: rt('Speaks every building language.', 'iNELS supports every major building protocol natively — KNX, BACnet, Modbus, MQTT, DALI, and more.'),
        items: [
          { icon: 'Code', richText: rt3('KNX', 'Full KNX/EIB certified implementation. TP, IP, RF.') },
          { icon: 'Activity', richText: rt3('BACnet', 'BACnet/IP and BACnet MSTP for enterprise HVAC and BMS.') },
          { icon: 'Layers', richText: rt3('Modbus RTU/TCP', 'Industrial-grade Modbus for meters, PLCs, and legacy equipment.') },
          { icon: 'Zap', richText: rt3('MQTT v5', 'Lightweight pub/sub for IoT and cloud integration.') },
          { icon: 'Globe', richText: rt3('REST API & Webhooks', 'Full API for third-party software, custom dashboards, and integrations.') },
        ],
        imageLight: hero,
        imageDark: diagram,
      },
      // Integrations block
      {
        blockType: 'integrations',
        blockName: 'Platform Integrations',
        variant: 'tiles',
        intro: rt('Connects with your entire stack.', 'iNELS integrates natively with leading BMS, PMS, voice, and smart home ecosystems.'),
        integrations: [
          { logo, link: { label: 'KNX', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'BACnet', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Modbus', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'MQTT', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Amazon Alexa', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Google Home', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Apple HomeKit', url: '/solutions/open-integration', type: 'custom' } },
          { logo, link: { label: 'Opera PMS', url: '/solutions/open-integration', type: 'custom' } },
        ],
        centerLogo: logo,
        links: [{ link: { type: 'custom', appearance: 'default', label: 'View all integrations', url: '/solutions/open-integration' } }],
      },
      // Certifications
      {
        blockType: 'featureCards',
        blockName: 'Certifications',
        variant: 'floating',
        intro: rt('Certified to the standards that matter.', 'Every iNELS product meets the certifications required for commercial, residential, and industrial deployment.'),
        items: [
          { icon: 'Shield', richText: rt3('KNX Certified', 'Full KNX Association certification for all KNX product lines.') },
          { icon: 'Shield', richText: rt3('CE Marked', 'Compliant with all applicable EU directives for the European market.') },
          { icon: 'Shield', richText: rt3('RoHS Compliant', 'Lead-free and environmentally responsible manufacturing.') },
          { icon: 'Shield', richText: rt3('EN 50090', 'Home and building electronic systems standard compliance.') },
        ],
      },
      {
        blockType: 'cta',
        blockName: 'Platform CTA',
        richText: rt('Ready to go deeper into the architecture?', 'Download the iNELS technical whitepaper or book a 1:1 with a solutions engineer.'),
        links: [
          { link: { type: 'custom', appearance: 'default', label: 'Download Whitepaper', url: '/resources/downloads' } },
          { link: { type: 'custom', appearance: 'outline', label: 'Book Technical Demo', url: '/get-demo' } },
        ],
      },
    ],
  }
}
```

**Step: Compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/platform.ts
git commit -m "feat: add platform technology seed page"
```

---

### Task 9: Get a Demo Page (Conversion Page)

**Files:**
- Create: `src/endpoints/seed/get-demo.ts`

This is the primary conversion page. No nav distractions — just form, social proof, trust signals. Use the existing `contactForm` ID.

```typescript
// src/endpoints/seed/get-demo.ts
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
          { richText: rt3('< 24h', 'Response time guaranteed') },
        ],
      },
      {
        blockType: 'form',
        blockName: 'Demo Request Form',
        form: contactFormId,
        enableIntro: true,
        introContent: rt('What happens next?', 'After submitting, a solutions engineer will contact you within one business day to schedule your personalised demo session.'),
      },
      {
        blockType: 'testimonials',
        blockName: 'Demo Social Proof',
        intro: rt('What others say after their demo'),
        testimonials: [
          { logo, richText: rtp('The demo was the most useful 30 minutes in our entire procurement process. We had answers to every technical question.'), author: 'Markus Weber', role: 'Senior BMS Engineer, TechBuild GmbH', avatar: logo },
          { logo, richText: rtp('Within a week of the demo we had a proposal and a site assessment booked. iNELS made it easy.'), author: 'Katarína Horáčková', role: 'Facility Manager, Penta Group', avatar: logo },
        ],
      },
    ],
  }
}
```

**Step: Compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/get-demo.ts
git commit -m "feat: add get-demo conversion page seed"
```

---

### Task 10: About Page

**Files:**
- Create: `src/endpoints/seed/about.ts`

Sections: origin story → leadership → global presence → certifications → CTA.

**Content specification (implement as a single exported function `aboutPage`):**
- slug: `about`
- Hero type: `section1`
- Hero headline: `"Building intelligence has been our mission since 1993."`
- Hero sub: `"iNELS is the smart building brand of Elko EP — a Czech manufacturer with 30+ years of experience delivering automation to 40+ countries."`
- Hero CTA: `"Meet the Team"` + `"Partner with Us"`

**Layout sections:**
1. `contentSection splitImage` — Company story: `"Born in Brno. Built for the world."` / `"Elko EP was founded in 1993 with a single mission: make buildings smarter. Today, iNELS products automate everything from luxury villas to 250-room hotels and smart city districts across Europe, Asia, and the Americas."` — use `teamDoc`
2. `stats` — `"1993 — founded"`, `"30+ years of innovation"`, `"40+ countries"`, `"500+ certified partners"`, `"2M+ connected devices"`, `"500+ product SKUs"`
3. `featureCards floating` — Why iNELS: `"European Manufacturing"`, `"10-Year Product Availability"`, `"Open Protocol Commitment"`, `"Dedicated Technical Support"`, `"CE & KNX Certified"`, `"Sustainability-First Design"`
4. `logoCloud` — Partner ecosystem logos (use `logo` placeholder × 6)
5. `testimonials` — 2 testimonials from different personas
6. `cta` — `"Join 500+ partners building smarter."` / CTAs: `"Become a Partner"`, `"Contact Us"`

**Step: Implement, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/about.ts
git commit -m "feat: add about page seed"
```

---

### Task 11: Partners Page

**Files:**
- Create: `src/endpoints/seed/partners.ts`

This is a GTM-critical page. iNELS sells through installers and integrators — this page recruits them.

**Content specification (export `partnersPage`):**
- slug: `partners`
- Hero headline: `"Grow your business with iNELS. We grow when you grow."`
- Hero sub: `"Join 500+ certified iNELS partners across 40 countries. Get leads, training, technical support, and co-marketing from the team behind Europe's most complete smart building platform."`
- Hero CTA: `"Become a Partner"` (→ form) + `"Download Partner Pack"` (→ downloads)

**Layout sections:**
1. `featureCards floating` — Partner benefits (6 cards):
   - `"Qualified Leads"` — inbound leads routed to your region
   - `"Technical Training"` — online + on-site certification programmes
   - `"Dedicated Support"` — priority phone and on-site technical support
   - `"Co-Marketing"` — joint case studies, PR, and event presence
   - `"Competitive Margins"` — transparent tiered pricing
   - `"Product Roadmap Access"` — early access to new products and beta programmes
2. `contentSection centeredGrid` — Partner tiers: `"Authorised Partner"`, `"Certified Partner"`, `"Premium Partner"` (3 items with icon + description)
3. `stats` — `"500+ active partners"`, `"40+ countries"`, `"3-level certification"`, `"< 5 days onboarding"`
4. `testimonials` — 2 testimonials from partners
5. `form` — Partner application form (use `contactFormId`)
6. `cta` — `"Already a partner? Access the portal."` → external URL `/partner-portal`

**Step: Implement, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/partners.ts
git commit -m "feat: add partners page seed"
```

---

### Task 12: Find an Installer Page

**Files:**
- Create: `src/endpoints/seed/find-installer.ts`

Simple page for end customers who need to find a certified local installer.

**Content specification (export `findInstallerPage`):**
- slug: `find-installer`
- Hero headline: `"Find a certified iNELS installer near you."`
- Hero sub: `"All iNELS certified partners have completed our technical training programme. We'll connect you with the right specialist for your project."`
- Hero CTA: `"Submit Your Project"` → form

**Layout sections:**
1. `contentSection centeredGrid` — What to expect: `"Free Initial Consultation"`, `"Site Survey"`, `"Detailed Proposal"`, `"Professional Installation"`, `"Commissioning & Training"`, `"Ongoing Support"`
2. `stats` — `"500+ certified partners"`, `"40+ countries covered"`, `"< 48h response time"`, `"5-star average rating"`
3. `form` — Contact form (use `contactFormId`) with intro: `"Tell us about your project and location"`
4. `cta` — `"Are you an installer? Join the partner network."` → `/partners`

**Step: Implement, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/find-installer.ts
git commit -m "feat: add find-installer page seed"
```

---

### Task 13: Careers Page

**Files:**
- Create: `src/endpoints/seed/careers.ts`

**Content specification (export `careersPage`):**
- slug: `careers`
- Hero headline: `"Build the future of intelligent buildings with us."`
- Hero sub: `"iNELS and Elko EP are growing. We're looking for engineers, product managers, sales specialists, and technical support professionals who want to make buildings smarter."`
- Hero CTA: `"See Open Positions"` + `"Learn About Our Culture"`

**Layout sections:**
1. `contentSection splitImage` — Culture: `"We build things that last."` / `"Our products sit inside buildings for 15+ years. We take quality, documentation, and reliability as seriously as our engineers take protocol compliance."` — use `teamDoc`
2. `featureCards floating` — Benefits: `"Hybrid Work"`, `"Continuous Learning Budget"`, `"Health Insurance"`, `"Annual Team Retreats"`, `"Open Source Contributions"`, `"Hardware Discounts"`
3. `stats` — `"150+ employees"`, `"12 nationalities"`, `"30 years of stability"`, `"3 offices across Europe"`
4. `cta` — `"Ready to build something that matters?"` / `"Send us your CV and tell us what you'd build."` → form (use `contactFormId`)

**Step: Implement, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/careers.ts
git commit -m "feat: add careers page seed"
```

---

## Phase 5: Products

### Task 14: Products Landing Page

**Files:**
- Create: `src/endpoints/seed/products-landing.ts`

**Content specification (export `productsLandingPage`):**
- slug: `products`
- Hero headline: `"500+ products. One ecosystem."`
- Hero sub: `"Browse the complete iNELS product catalogue — switches, sensors, thermostats, meters, controllers, and accessories for KNX, RF, and Modbus systems."`
- Hero CTA: `"Browse Products"` + `"Download Full Catalogue"`

**Layout sections:**
1. `featureCards floating` — Product categories (6 cards with icons):
   - `"Switches & Controls"` — `"KNX and RF smart switches, dimmers, and push buttons."`
   - `"Thermostats & HVAC"` — `"Room thermostats with presence, CO2, and multi-zone."`
   - `"Energy Meters"` — `"DIN-rail Modbus/KNX sub-meters with cloud reporting."`
   - `"Sensors & Detectors"` — `"PIR, CO2, temperature, humidity, and multisensors."`
   - `"Lighting Control"` — `"DALI, 0-10V, and KNX dimming actuators."`
   - `"Shading & Blinds"` — `"Motorised blind actuators and sun tracking controllers."`
2. `hoverHighlights` — Product lines:
   - beforeHighlights: `"From a single smart switch"`
   - highlights: `"iNELS RF Line"`, `"iNELS KNX Line"`, `"iNELS Modbus Line"`, `"iNELS Cloud Platform"`
   - afterHighlights: `"...to a fully connected building."`
3. `productListing` block — Leave with default/empty config (product data comes from product seed)
4. `cta` — `"Can't find what you need?"` / `"Our technical team can help specify the right product for your project."` → `/get-demo`

**Step: Implement, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/products-landing.ts
git commit -m "feat: add products landing page seed"
```

---

## Phase 6: Resources Section

### Task 15: Resources Hub Page

**Files:**
- Create: `src/endpoints/seed/resources-hub.ts`

**Content specification (export `resourcesHubPage`):**
- slug: `resources`
- Hero headline: `"Everything you need to specify, install, and manage iNELS."`
- Hero sub: `"Technical datasheets, installation manuals, case studies, whitepapers, training videos, and webinars — all in one place."`
- Hero CTA: `"Browse Resources"` + `"Request a Custom Datasheet"`

**Layout sections:**
1. `mediaCards` — Resource types (4 cards):
   - `"Case Studies"` — `"Real deployments, real ROI numbers."` → `/resources/case-studies`
   - `"Technical Downloads"` — `"Datasheets, manuals, BIM files."` → `/resources/downloads`
   - `"Blog & Articles"` — `"Industry insights and technical guides."` → `/articles`
   - `"Training & Webinars"` — `"Online certification and video courses."` → `/resources/training`
2. `articleGrid` — Latest articles (leave as auto-populated from posts collection)
3. `newsletterSubscription` — `"Get the iNELS technical digest"` — monthly datasheets, new products, and deployment tips
4. `cta` — `"Looking for something specific?"` → `/get-demo`

**Step: Implement, compile, commit**

---

### Task 16: Support Page

**Files:**
- Create: `src/endpoints/seed/support.ts`

**Content specification (export `supportPage`):**
- slug: `support`
- Hero headline: `"We're here when you need us."`
- Hero sub: `"Technical support for certified iNELS partners and end customers — by phone, email, and on-site."`

**Layout sections:**
1. `featureCards floating` — Support channels: `"Phone Support"`, `"Email Support"`, `"Partner Portal"`, `"On-Site Support"`, `"Training Academy"`, `"Documentation"`
2. `faq` — 6 FAQ items:
   - `"What protocols does iNELS support?"` — `"KNX, BACnet, Modbus, MQTT, DALI, 0-10V, REST API, and Zigbee. See the platform page for a full list."`
   - `"Is iNELS available in my country?"` — `"iNELS is deployed in 40+ countries. Find a certified partner near you on the Find an Installer page."`
   - `"How long does commissioning take?"` — `"A typical residential project takes 1–3 days. Hotel projects vary from 1 day per floor to 1 week for a full GRMS rollout."`
   - `"Does iNELS work without internet?"` — `"Yes. All iNELS central units process logic locally. Cloud is optional and enhances — not replaces — local operation."`
   - `"What is the product availability guarantee?"` — `"iNELS guarantees product and spare part availability for 10 years from product launch."`
   - `"How do I become a certified partner?"` — `"Apply on the Partners page. Certification training takes 2–5 days depending on product line."`
3. `form` — Support request form (use `contactFormId`) with intro: `"Submit a support request"`
4. `cta` — `"Need urgent support?"` → phone number / `"Submit a Ticket"`

---

### Task 17: Press / Newsroom Page

**Files:**
- Create: `src/endpoints/seed/press.ts`

**Content specification (export `pressPage`):**
- slug: `press`
- Hero headline: `"iNELS in the news."`
- Hero sub: `"Press releases, media assets, and contact information for journalists covering smart building technology."`

**Layout sections:**
1. `articleGrid` — Latest press releases (leave auto-populated)
2. `contentSection centeredGrid` — Media pack: `"Press Kit Download"`, `"High-Res Logo Pack"`, `"Spokesperson Availability"` — with contact email
3. `cta` — `"Media enquiry?"` → `press@inels.com` (use external URL link)

---

### Task 18: Legal Pages — Terms, Privacy, Cookies

**Files:**
- Create: `src/endpoints/seed/legal-pages.ts`

These use the `content` blockType (rich text content block). Export three functions.

**Content specification:**

#### `termsPage` — slug: `terms`
- Hero: `none` type
- layout: one `content` block with a heading `"Terms & Conditions"` and 3-paragraph placeholder text covering: acceptance of terms, use of the platform, limitation of liability.

#### `privacyPage` — slug: `privacy`
- Hero: `none` type
- layout: one `content` block: `"Privacy Policy"` + GDPR-compliant structure covering: data we collect, how we use it, your rights, contact DPO.

#### `cookiePage` — slug: `cookies`
- Hero: `none` type
- layout: one `content` block: `"Cookie Policy"` + categories of cookies, how to opt out.

**Step: Implement all 3, compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/legal-pages.ts
git commit -m "feat: add legal pages seed (terms, privacy, cookies)"
```

---

## Phase 7: Wire Everything Into index.ts

### Task 19: Update Main Seed Orchestrator

**Files:**
- Modify: `src/endpoints/seed/index.ts`

**Steps:**

**Step 1: Add all imports at the top of index.ts**

```typescript
import { solutionsHub } from './solutions-hub'
import { solutionLighting } from './solution-lighting'
import { solutionShading } from './solution-shading'
import { solutionClimate } from './solution-climate'
import { solutionEnergy } from './solution-energy'
import { solutionRemote } from './solution-remote'
import { solutionIntegration } from './solution-integration'
import { industriesHub } from './industries-hub'
import { industryVillas } from './industry-villas'
import { industryResidential } from './industry-residential'
import { industryCommercial } from './industry-commercial'
import { industryGrms } from './industry-grms'
import { industryHresk } from './industry-hresk'
import { industrySmartCities } from './industry-smart-cities'
import { industrySmartFactories } from './industry-smart-factories'
import { platformPage } from './platform'
import { getDemoPage } from './get-demo'
import { aboutPage } from './about'
import { partnersPage } from './partners'
import { findInstallerPage } from './find-installer'
import { careersPage } from './careers'
import { productsLandingPage } from './products-landing'
import { resourcesHubPage } from './resources-hub'
import { supportPage } from './support'
import { pressPage } from './press'
import { termsPage, privacyPage, cookiePage } from './legal-pages'
```

**Step 2: Add all page creates in the pages seeding section**

After the existing `home` and `contact` page creates, add:

```typescript
payload.logger.info(`— Seeding solutions pages...`)
await Promise.all([
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionsHub({ hero: solutionsHeroDoc.id, logo: logoDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionLighting({ hero: lightingDoc.id, feature: lightingDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id, caseStudy2.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionShading({ hero: shadingDoc.id, feature: shadingDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id, caseStudy2.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionClimate({ hero: climateDoc.id, feature: climateDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy2.id, caseStudy3.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionEnergy({ hero: energyDoc.id, feature: energyDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy2.id, caseStudy3.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionRemote({ hero: remoteDoc.id, feature: remoteDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id, caseStudy3.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: solutionIntegration({ hero: integrationDoc.id, feature: integrationDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id, caseStudy2.id] }) }),
])

payload.logger.info(`— Seeding industry pages...`)
await Promise.all([
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industriesHub({ hero: solutionsHeroDoc.id, villa: villaDoc.id, residentialBuilding: residentialBuildingDoc.id, commercial: commercialDoc.id, grms: grmsDoc.id, hresk: hreskDoc.id, smartCity: smartCityDoc.id, factory: factoryDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industryVillas({ hero: villaDoc.id, feature: villaDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy3.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industryResidential({ hero: residentialBuildingDoc.id, feature: residentialBuildingDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy3.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industryCommercial({ hero: commercialDoc.id, feature: officeDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy2.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industryGrms({ hero: grmsDoc.id, feature: hotelDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industryHresk({ hero: hreskDoc.id, feature: hotelDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy1.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industrySmartCities({ hero: smartCityDoc.id, feature: buildingDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy2.id] }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: industrySmartFactories({ hero: factoryDoc.id, feature: industrialDoc.id, logo: logoDoc.id, caseStudyIds: [caseStudy2.id] }) }),
])

payload.logger.info(`— Seeding company pages...`)
await Promise.all([
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: platformPage({ hero: platformDiagramDoc.id, diagram: platformDiagramDoc.id, logo: logoDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: getDemoPage({ contactFormId: contactForm.id, logo: logoDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: aboutPage({ hero: buildingDoc.id, team: teamDoc.id, logo: logoDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: partnersPage({ hero: partnerDoc.id, logo: logoDoc.id, contactFormId: contactForm.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: findInstallerPage({ contactFormId: contactForm.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: careersPage({ hero: teamDoc.id, logo: logoDoc.id, contactFormId: contactForm.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: productsLandingPage({ hero: productDoc.id, logo: logoDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: resourcesHubPage({ hero: downloadDoc.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: supportPage({ logo: logoDoc.id, contactFormId: contactForm.id }) }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: pressPage() }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: termsPage() }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: privacyPage() }),
  payload.create({ collection: 'pages', depth: 0, context: { disableRevalidate: true },
    data: cookiePage() }),
])
```

**Step 3: Compile**

```bash
pnpm tsc --noEmit
```
Expected: no TypeScript errors. Fix any type mismatches before proceeding.

**Step 4: Commit**

```bash
git add src/endpoints/seed/index.ts
git commit -m "feat: wire all new pages into seed orchestrator"
```

---

### Task 20: Update Header Navigation Global

**Files:**
- Modify: `src/endpoints/seed/index.ts` (the `updateGlobal` for header)

Replace the existing minimal header with the full iNELS navigation structure:

```typescript
await payload.updateGlobal({
  slug: 'header',
  data: {
    tabs: [
      {
        label: 'Solutions',
        enableDirectLink: false,
        link: { type: 'custom', label: 'Solutions', url: '/solutions' },
        navItems: [
          { link: { type: 'custom', label: 'Overview', url: '/solutions' } },
          { link: { type: 'custom', label: 'Lighting Control', url: '/solutions/lighting-control' } },
          { link: { type: 'custom', label: 'Shading Automation', url: '/solutions/shading-automation' } },
          { link: { type: 'custom', label: 'Climate Control', url: '/solutions/climate-control' } },
          { link: { type: 'custom', label: 'Energy Management', url: '/solutions/energy-management' } },
          { link: { type: 'custom', label: 'Remote Control', url: '/solutions/remote-control' } },
          { link: { type: 'custom', label: 'Open Integration', url: '/solutions/open-integration' } },
        ],
      },
      {
        label: 'Industries',
        enableDirectLink: false,
        link: { type: 'custom', label: 'Industries', url: '/industries' },
        navItems: [
          { link: { type: 'custom', label: 'Overview', url: '/industries' } },
          { link: { type: 'custom', label: 'Villas & Apartments', url: '/industries/villas-apartments' } },
          { link: { type: 'custom', label: 'Residential Buildings', url: '/industries/residential-buildings' } },
          { link: { type: 'custom', label: 'Commercial', url: '/industries/commercial' } },
          { link: { type: 'custom', label: 'GRMS', url: '/industries/grms' } },
          { link: { type: 'custom', label: 'HRESK', url: '/industries/hresk' } },
          { link: { type: 'custom', label: 'Smart Cities', url: '/industries/smart-cities' } },
          { link: { type: 'custom', label: 'Smart Factories', url: '/industries/smart-factories' } },
        ],
      },
      {
        label: 'Products',
        enableDirectLink: true,
        link: { type: 'custom', label: 'Products', url: '/products' },
      },
      {
        label: 'Platform',
        enableDirectLink: true,
        link: { type: 'custom', label: 'Platform', url: '/platform' },
      },
      {
        label: 'Resources',
        enableDirectLink: false,
        link: { type: 'custom', label: 'Resources', url: '/resources' },
        navItems: [
          { link: { type: 'custom', label: 'All Resources', url: '/resources' } },
          { link: { type: 'custom', label: 'Case Studies', url: '/resources/case-studies' } },
          { link: { type: 'custom', label: 'Downloads', url: '/resources/downloads' } },
          { link: { type: 'custom', label: 'Blog', url: '/articles' } },
          { link: { type: 'custom', label: 'News & Press', url: '/press' } },
        ],
      },
      {
        label: 'Company',
        enableDirectLink: false,
        link: { type: 'custom', label: 'Company', url: '/about' },
        navItems: [
          { link: { type: 'custom', label: 'About iNELS', url: '/about' } },
          { link: { type: 'custom', label: 'Partners', url: '/partners' } },
          { link: { type: 'custom', label: 'Find an Installer', url: '/find-installer' } },
          { link: { type: 'custom', label: 'Careers', url: '/careers' } },
          { link: { type: 'custom', label: 'Support', url: '/support' } },
        ],
      },
    ],
  },
})
```

**Note:** Check the Header config first to confirm the exact field names for `navItems` and `tabs`. File: `src/Header/config.ts`. Adjust field names if they differ.

**Step: Compile, run seed, verify header in admin UI**

```bash
pnpm tsc --noEmit
# Then trigger seed via /api/seed endpoint in admin
```

**Step: Commit**

```bash
git add src/endpoints/seed/index.ts
git commit -m "feat: update header global with full iNELS navigation"
```

---

### Task 21: Update Footer Global

**Files:**
- Modify: `src/endpoints/seed/index.ts` (the `updateGlobal` for footer)

```typescript
await payload.updateGlobal({
  slug: 'footer',
  data: {
    columns: [
      {
        label: 'Solutions',
        navItems: [
          { link: { type: 'custom', label: 'Lighting Control', url: '/solutions/lighting-control' } },
          { link: { type: 'custom', label: 'Shading Automation', url: '/solutions/shading-automation' } },
          { link: { type: 'custom', label: 'Climate Control', url: '/solutions/climate-control' } },
          { link: { type: 'custom', label: 'Energy Management', url: '/solutions/energy-management' } },
          { link: { type: 'custom', label: 'Remote Control', url: '/solutions/remote-control' } },
          { link: { type: 'custom', label: 'Open Integration', url: '/solutions/open-integration' } },
        ],
      },
      {
        label: 'Industries',
        navItems: [
          { link: { type: 'custom', label: 'Villas & Apartments', url: '/industries/villas-apartments' } },
          { link: { type: 'custom', label: 'Residential Buildings', url: '/industries/residential-buildings' } },
          { link: { type: 'custom', label: 'Commercial', url: '/industries/commercial' } },
          { link: { type: 'custom', label: 'GRMS', url: '/industries/grms' } },
          { link: { type: 'custom', label: 'HRESK', url: '/industries/hresk' } },
          { link: { type: 'custom', label: 'Smart Cities', url: '/industries/smart-cities' } },
          { link: { type: 'custom', label: 'Smart Factories', url: '/industries/smart-factories' } },
        ],
      },
      {
        label: 'Company',
        navItems: [
          { link: { type: 'custom', label: 'About', url: '/about' } },
          { link: { type: 'custom', label: 'Platform', url: '/platform' } },
          { link: { type: 'custom', label: 'Partners', url: '/partners' } },
          { link: { type: 'custom', label: 'Find an Installer', url: '/find-installer' } },
          { link: { type: 'custom', label: 'Careers', url: '/careers' } },
          { link: { type: 'custom', label: 'Press', url: '/press' } },
        ],
      },
      {
        label: 'Support & Legal',
        navItems: [
          { link: { type: 'custom', label: 'Support', url: '/support' } },
          { link: { type: 'custom', label: 'Contact', url: '/contact' } },
          { link: { type: 'custom', label: 'Book a Demo', url: '/get-demo' } },
          { link: { type: 'custom', label: 'Terms & Conditions', url: '/terms' } },
          { link: { type: 'custom', label: 'Privacy Policy', url: '/privacy' } },
          { link: { type: 'custom', label: 'Cookie Policy', url: '/cookies' } },
        ],
      },
    ],
  },
})
```

**Note:** Check `src/Footer/config.ts` for exact field names before implementing.

**Step: Compile, commit**

```bash
pnpm tsc --noEmit
git add src/endpoints/seed/index.ts
git commit -m "feat: update footer global with full iNELS navigation"
```

---

## Phase 8: End-to-End Verification

### Task 22: Run Full Seed and Verify

**Step 1: Start the dev server**

```bash
pnpm dev
```

**Step 2: Trigger seed from admin UI**

Navigate to `http://localhost:3000/api/seed` (or the seed endpoint configured in payload.config.ts) and trigger the seed.

**Step 3: Verify pages created**

In the Payload admin (`http://localhost:3000/admin/collections/pages`), confirm these pages exist:
- `home`, `contact`, `showcase` (existing)
- `solutions`, `lighting-control`, `shading-automation`, `climate-control`, `energy-management`, `remote-control`, `open-integration`
- `industries`, `villas-apartments`, `residential-buildings`, `commercial`, `grms`, `hresk`, `smart-cities`, `smart-factories`
- `platform`, `get-demo`, `about`, `partners`, `find-installer`, `careers`
- `products`, `resources`, `support`, `press`, `terms`, `privacy`, `cookies`

**Step 4: Spot-check 3 pages in the frontend**

Visit these in the browser:
- `http://localhost:3000/solutions/lighting-control` — verify 7 sections render
- `http://localhost:3000/industries/grms` — verify revenue-first content order
- `http://localhost:3000/platform` — verify architecture + protocol + integrations blocks

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete iNELS website seed — 30+ pages across solutions, industries, company, resources"
```

---

## Summary

| Phase | Tasks | Pages Created | Files Created/Modified |
|-------|-------|--------------|----------------------|
| 1 — Infrastructure | 1–2 | — | `helpers.ts`, `index.ts` (media) |
| 2 — Solutions | 3–5 | 7 | `solutions-hub.ts`, `solution-*.ts` × 6 |
| 3 — Industries | 6–7 | 8 | `industries-hub.ts`, `industry-*.ts` × 7 |
| 4 — Company | 8–13 | 6 | `platform.ts`, `get-demo.ts`, `about.ts`, `partners.ts`, `find-installer.ts`, `careers.ts` |
| 5 — Products | 14 | 1 | `products-landing.ts` |
| 6 — Resources | 15–17 | 3 | `resources-hub.ts`, `support.ts`, `press.ts` |
| 7 — Legal | 18 | 3 | `legal-pages.ts` |
| 8 — Wire | 19–21 | — | `index.ts` (pages + globals) |
| 9 — Verify | 22 | — | — |

**Total: ~32 pages, 22 tasks, ~25 files**
