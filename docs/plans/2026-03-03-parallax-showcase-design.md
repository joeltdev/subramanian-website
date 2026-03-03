# ParallaxShowcase Block — Design Document

**Date:** 2026-03-03
**Status:** Approved

---

## Overview

A new standalone Payload CMS block (`ParallaxShowcase`) that renders a full-featured interactive carousel with:
- Dual-layer parallax (background + foreground images, scroll and mouse-driven)
- Tab navigation synced to slide names
- Peeking inactive slides on both sides of the active slide
- Auto-scroll with pause-on-hover
- Mouse-tracking Prev/Next badge on inactive slides

This is a **new standalone block**, not a variant of the existing `Gallery` block.

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Block placement | New standalone block | Rich schema differs enough from Gallery; cleaner separation |
| Animation engine | Framer Motion (`motion/react`) | Consistent with `PerspectiveFeatureShowcase`, `apple-cards-carousel` |
| Auto-scroll pause | Pause on hover, resume on mouse leave | Simple, expected UX |
| Slide aspect ratio | 3:2 | Editorial/product photography standard |
| Layout approach | Peeking neighbors (Approach A) | Satisfies visible inactive slides + active max-w-5xl requirement |

---

## File Structure

```
src/blocks/ParallaxShowcase/
  config.ts          ← Payload block schema
  Component.tsx      ← Thin "use server" export + RenderBlocks shim
  index.tsx          ← "use client" — main carousel orchestrator
  Slide.tsx          ← Individual slide with parallax BG/FG layers + mouse badge
```

---

## Payload Schema (`config.ts`)

```typescript
import type { Block } from 'payload'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'

export const ParallaxShowcase: Block = {
  slug: 'parallaxShowcase',
  interfaceName: 'ParallaxShowcaseBlock',
  labels: { singular: 'Parallax Showcase', plural: 'Parallax Showcases' },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro',
      admin: { description: 'Block-level heading and supporting text (shown above the carousel)' },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'autoScrollInterval',
      type: 'number',
      label: 'Auto-scroll Interval (seconds)',
      defaultValue: 5,
      admin: {
        description: 'Seconds between automatic slide advances (2–15). Default: 5.',
        step: 1,
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 2,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Tab label shown in the navigation row' },
        },
        {
          name: 'content',
          type: 'richText',
          admin: { description: 'Top-left slide content — use h3/h4 for heading, paragraph for body' },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Full-slide background. Use 3:2 landscape images (e.g. 1800×1200px)' },
        },
        {
          name: 'foregroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional foreground layer with counter-parallax. PNG with transparency recommended.' },
        },
        link({ appearances: false }),
      ],
    },
  ],
}
```

### Schema Notes
- `foregroundImage` is **optional** — some slides may omit the depth effect
- `link()` helper with `appearances: false` — consistent with Gallery items and MediaCards items
- `autoScrollInterval` stored in CMS so editors can tune it per block instance

---

## Component Architecture

### `Component.tsx` (server component wrapper)

```typescript
import type { ParallaxShowcaseBlock } from '@/payload-types'
import { ParallaxShowcaseCarousel } from './index'

export const ParallaxShowcaseBlockComponent: React.FC<ParallaxShowcaseBlock> = (props) => {
  return <ParallaxShowcaseCarousel {...props} />
}
```

### `index.tsx` — Carousel Orchestrator (`"use client"`)

**State:**
- `currentIndex: number` — initialized to `Math.floor(slides.length / 2)` (middle slide)
- `isPaused: boolean` — controlled by `onMouseEnter`/`onMouseLeave` on the carousel wrapper

**Auto-scroll:**
```typescript
useEffect(() => {
  if (isPaused) return
  const id = setInterval(() => {
    setCurrentIndex(i => (i + 1) % slides.length)
  }, (autoScrollInterval ?? 5) * 1000)
  return () => clearInterval(id)
}, [isPaused, currentIndex, autoScrollInterval, slides.length])
```

**Tab navigation:** `slides.map(s => s.name)` rendered as horizontal pills. Active tab: `bg-primary text-primary-foreground`. Clicking sets `currentIndex`.

**Layout:**
```
<section>
  <div max-w-7xl px-6>
    <RichText intro />
    <TabNav />
  </div>
  <div w-full overflow-x-clip>           ← overflow-x: clip preserves vertical scroll
    <div flex items-center>              ← horizontal track, translates on currentIndex change
      <Slide[] />
    </div>
  </div>
</section>
```

**Track translate logic:**
- Each slide has a fixed rendered width: `max-w-5xl` for active, `85%` of that for inactive
- The track `translateX` is computed as: `(activeIndex - currentIndex) * slideWidth`
- Animated with `motion.div` spring: `type: 'spring', stiffness: 300, damping: 40`

### `Slide.tsx` — Individual Slide (`"use client"`)

**Props:**
```typescript
interface SlideProps {
  slide: ParallaxShowcaseBlock['slides'][0]
  isActive: boolean
  direction: 'prev' | 'next' | 'active'
  onClick: () => void
}
```

**Parallax layers:**

*Scroll-based (both BG and FG):*
```typescript
const { scrollYProgress } = useScroll({ target: slideRef, offset: ['start end', 'end start'] })
const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
const fgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
```

*Mouse-based (active slide only):*
```typescript
const mouseX = useMotionValue(0)
const mouseY = useMotionValue(0)
const bgTranslateX = useTransform(mouseX, [-0.5, 0.5], ['-12px', '12px'])
const bgTranslateY = useTransform(mouseY, [-0.5, 0.5], ['-12px', '12px'])
const fgTranslateX = useTransform(mouseX, [-0.5, 0.5], ['-20px', '20px'])
const fgTranslateY = useTransform(mouseY, [-0.5, 0.5], ['-20px', '20px'])

const handleMouseMove = (e: React.MouseEvent) => {
  if (!isActive) return
  const rect = slideRef.current?.getBoundingClientRect()
  if (!rect) return
  mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
  mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
}
const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }
```

**Slide DOM structure:**
```
<motion.li
  ref={slideRef}
  style={{ scale: isActive ? 1 : 0.85, opacity: isActive ? 1 : 0.7 }}
  className="relative aspect-[3/2] shrink-0 ... rounded-2xl overflow-hidden cursor-pointer"
  onClick={onClick}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  {/* Background layer */}
  <motion.div style={{ y: bgY, x: isActive ? bgTranslateX : 0, ... }}
    className="absolute inset-[-10%] w-[120%] h-[120%]"   ← oversized to allow parallax movement
  >
    <Media resource={backgroundImage} fill imgClassName="object-cover" />
  </motion.div>

  {/* Gradient scrim */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent" />

  {/* Slide content — top-left */}
  <div className="absolute top-6 left-6 z-10 max-w-xs">
    <RichText data={content} enableGutter={false}
      className="[&_h3]:type-headline-3 [&_h3]:text-white [&_h4]:type-title-md [&_h4]:text-white [&_p]:type-body-md [&_p]:text-white/80" />
  </div>

  {/* Foreground image — below content */}
  {foregroundImage && (
    <motion.div style={{ y: fgY, x: isActive ? fgTranslateX : 0, ... }}
      className="absolute bottom-0 left-6 right-6 h-1/2"
    >
      <Media resource={foregroundImage} fill imgClassName="object-contain object-bottom" />
    </motion.div>
  )}

  {/* Next button — bottom-right */}
  <div className="absolute bottom-6 right-6 z-10">
    <button className="... bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 type-label-sm">
      Next →
    </button>
  </div>

  {/* Mouse-tracking badge (inactive slides only) */}
  {!isActive && <MouseBadge direction={direction} />}
</motion.li>
```

**MouseBadge:**
- `position: absolute`, initially `opacity: 0`
- `onMouseEnter` → `opacity: 1`; `onMouseMove` → update `left`/`top` to cursor position relative to slide
- Text: `← Prev` or `Next →`
- Style: `bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 type-label-sm pointer-events-none z-20`
- `pointer-events: none` so it doesn't interfere with slide clicks

---

## Styling Conventions

Inheriting from existing project patterns:

| Token | Usage |
|---|---|
| `type-headline-3`, `type-title-xl` | Block intro heading |
| `type-title-md`, `type-body-md` | Slide content |
| `type-label-sm` | Tab labels, badge text, Next button |
| `text-type-heading`, `text-type-body` | Semantic color on light/dark backgrounds |
| `bg-background/80 backdrop-blur-sm` | Badge/button surfaces (glass effect) |
| `border-border` | Tab active indicator border |
| `text-primary-foreground bg-primary` | Active tab state |
| `rounded-2xl` | Slide corner radius (consistent with apple-cards-carousel) |

---

## Block Registration

After implementation, register in:
1. `src/collections/Pages/index.ts` — add `ParallaxShowcase` to the `blocks` array in the `layout` field
2. `src/blocks/RenderBlocks.tsx` — add `parallaxShowcase: ParallaxShowcaseBlockComponent` to `blockComponents`
3. `src/payload.config.ts` — add `ParallaxShowcase` to the `blocks` array

---

## Acceptance Criteria

- [ ] Payload admin shows: intro RichText + autoScrollInterval + slides array (name, content, backgroundImage, foregroundImage, link)
- [ ] Block-level intro renders above carousel with correct typography tokens
- [ ] Tab nav shows all slide names; active tab highlighted with `bg-primary text-primary-foreground`
- [ ] Carousel starts on the middle slide
- [ ] Auto-scroll advances to next slide every N seconds (default 5s)
- [ ] Auto-scroll pauses on mouse enter, resumes on mouse leave
- [ ] Active slide is `max-w-5xl`, 3:2 aspect ratio, `scale-100`
- [ ] Inactive slides are visible on both sides, `scale-85`, partially clipped
- [ ] Background image parallaxes downward on scroll (+8%), foreground counter-parallaxes (-8%)
- [ ] On active slide hover: BG shifts ±12px per mouse position, FG shifts ±20px (depth effect)
- [ ] Hovering an inactive slide shows a `← Prev` / `Next →` badge that follows the cursor
- [ ] Clicking inactive slide navigates to that slide
- [ ] Clicking slide navigates to `link` (internal ref or custom URL)
- [ ] `"Next →"` button at bottom-right of each active slide also advances the carousel
- [ ] Slide content (RichText) renders top-left with white text on the dark-scrimmed background
- [ ] Foreground image renders below the content with object-contain
- [ ] No layout shift or overflow issues at all viewport widths
- [ ] TypeScript: no `any` casts; all props typed from generated `PayloadTypes`
