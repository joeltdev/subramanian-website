# ParallaxShowcase Block — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new standalone `ParallaxShowcase` Payload CMS block with a peeking-neighbor parallax carousel, dual-layer scroll+mouse parallax, tab navigation, auto-scroll, and mouse-tracking Prev/Next badges.

**Architecture:** Four files under `src/blocks/ParallaxShowcase/` — a Payload schema (`config.ts`), a server-side React wrapper (`Component.tsx`), the client-side carousel orchestrator (`index.tsx`), and the individual slide component (`Slide.tsx`). After creating the files, the block is registered in `RenderBlocks.tsx` and `Pages/index.ts`, then types are regenerated.

**Tech Stack:** Payload CMS 3.x, Next.js 15, `motion/react` (Framer Motion), TailwindCSS v4, TypeScript, `@/fields/link`, `@/components/RichText`, `@/components/Media`, `@/components/Link` (CMSLink)

---

## Reference Files (read before implementing)

- `src/blocks/Gallery/config.ts` — schema pattern (link field, richText field, array field)
- `src/blocks/Gallery/Apple/index.tsx` — how a "use client" block component consumes Payload types
- `src/blocks/MediaCards/Component.tsx` — how `CMSLink` is used with the link field
- `src/blocks/FeatureShowcase/Perspective/index.tsx` — Framer Motion scroll parallax (`useScroll`, `useTransform`)
- `src/components/ui/aceternity-parallax-carousel.tsx` — mouse-tracking `rAF` pattern (for reference only; we use Framer Motion instead)
- `src/blocks/RenderBlocks.tsx` — where to register the component
- `src/collections/Pages/index.ts` — where to register the config

---

## Task 1: Create the Payload Schema (`config.ts`)

**Files:**
- Create: `src/blocks/ParallaxShowcase/config.ts`

**Step 1: Create the file**

```typescript
// src/blocks/ParallaxShowcase/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

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
      admin: {
        description: 'Block-level heading and supporting text (shown above the carousel)',
      },
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
          admin: {
            description:
              'Top-left slide content — use h3/h4 for heading, paragraph for body text',
          },
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
          admin: {
            description: 'Full-slide background. Use 3:2 landscape images (e.g. 1800×1200px)',
          },
        },
        {
          name: 'foregroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional foreground layer with counter-parallax. PNG with transparency recommended.',
          },
        },
        link({ appearances: false }),
      ],
    },
  ],
}
```

**Step 2: Verify TypeScript compiles (no types yet — expect type error on import)**

```bash
cd /Users/nithin/Code/Gigs/inels-payload/inels-content-studio
pnpm tsc --noEmit 2>&1 | head -30
```

Expected: Possibly zero errors (config.ts imports only `payload` types, which exist). If there are errors they will be in other files unrelated to this task.

**Step 3: Commit**

```bash
git add src/blocks/ParallaxShowcase/config.ts
git commit -m "feat(parallax-showcase): add Payload block schema"
```

---

## Task 2: Register the Block and Regenerate Types

**Files:**
- Modify: `src/collections/Pages/index.ts:90`
- Modify: `src/blocks/RenderBlocks.tsx:24,44`
- Read-only output: `src/payload-types.ts` (auto-generated)

**Step 1: Add import and registration in `Pages/index.ts`**

In `src/collections/Pages/index.ts`, add the import at the top (after the `Gallery` import on line 23):

```typescript
import { ParallaxShowcase } from '../../blocks/ParallaxShowcase/config'
```

Then in the `blocks` array on line 90, append `ParallaxShowcase` at the end:

```typescript
blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, LogoCloud, FeatureCards, FeatureShowcase, FeatureBento, Integrations, ContentSection, Stats, Testimonials, HoverHighlights, CaseStudiesHighlight, ArticleGrid, MediaCards, YouTube, Gallery, ParallaxShowcase],
```

**Step 2: Add stub import + entry in `RenderBlocks.tsx`**

Add import after the `GalleryBlock` import (line 23):

```typescript
import { ParallaxShowcaseBlockComponent } from '@/blocks/ParallaxShowcase/Component'
```

Add entry to `blockComponents` after `gallery`:

```typescript
parallaxShowcase: ParallaxShowcaseBlockComponent,
```

> **Note:** `Component.tsx` does not exist yet — this will cause a TypeScript error until Task 3 creates it. That's expected. The import is staged now so Task 3 just needs to export the right name.

**Step 3: Run type generation**

```bash
pnpm payload generate:types
```

Expected output: `Generated types to src/payload-types.ts` (or similar). This creates the `ParallaxShowcaseBlock` TypeScript interface that all components depend on.

**Step 4: Verify the generated type exists**

```bash
grep -n "ParallaxShowcaseBlock" src/payload-types.ts | head -5
```

Expected: Lines showing the `ParallaxShowcaseBlock` interface with `intro`, `autoScrollInterval`, `slides` fields.

**Step 5: Commit**

```bash
git add src/collections/Pages/index.ts src/blocks/RenderBlocks.tsx src/payload-types.ts
git commit -m "feat(parallax-showcase): register block and regenerate payload types"
```

---

## Task 3: Create the Slide Component (`Slide.tsx`)

**Files:**
- Create: `src/blocks/ParallaxShowcase/Slide.tsx`

This component renders a single slide with dual-layer parallax. It is imported by `index.tsx`.

**Step 1: Create the file**

```typescript
// src/blocks/ParallaxShowcase/Slide.tsx
'use client'

import React, { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useSpring,
} from 'motion/react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Slide = NonNullable<ParallaxShowcaseBlock['slides']>[number]

interface SlideProps {
  slide: Slide
  isActive: boolean
  direction: 'prev' | 'next' | 'active'
  onClick: () => void
  onAdvance: () => void
}

export const ParallaxSlide: React.FC<SlideProps> = ({
  slide,
  isActive,
  direction,
  onClick,
  onAdvance,
}) => {
  const slideRef = useRef<HTMLLIElement>(null)
  const [badgePos, setBadgePos] = useState({ x: 0, y: 0 })
  const [badgeVisible, setBadgeVisible] = useState(false)

  // ── Scroll parallax ──────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: slideRef,
    offset: ['start end', 'end start'],
  })
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const fgScrollY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  // ── Mouse parallax (active slide only) ──────────────────────────────────
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // Spring-smooth the mouse values for a fluid feel
  const mouseX = useSpring(rawMouseX, { stiffness: 120, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 120, damping: 20 })

  const bgMouseX = useTransform(mouseX, [-0.5, 0.5], ['-12px', '12px'])
  const bgMouseY = useTransform(mouseY, [-0.5, 0.5], ['-12px', '12px'])
  const fgMouseX = useTransform(mouseX, [-0.5, 0.5], ['-20px', '20px'])
  const fgMouseY = useTransform(mouseY, [-0.5, 0.5], ['-20px', '20px'])

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (isActive) {
      const rect = slideRef.current?.getBoundingClientRect()
      if (!rect) return
      rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    } else {
      // Update badge position for inactive slides
      const rect = slideRef.current?.getBoundingClientRect()
      if (!rect) return
      setBadgePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    rawMouseX.set(0)
    rawMouseY.set(0)
    setBadgeVisible(false)
  }

  const handleMouseEnter = () => {
    if (!isActive) setBadgeVisible(true)
  }

  const { name: _name, content, backgroundImage, foregroundImage, link } = slide

  const hasBg = backgroundImage && typeof backgroundImage === 'object'
  const hasFg = foregroundImage && typeof foregroundImage === 'object'
  const hasLink = link && (link.url || (link.type === 'reference' && link.reference))

  const slideInner = (
    <motion.li
      ref={slideRef}
      className={cn(
        'relative aspect-[3/2] shrink-0 rounded-2xl overflow-hidden cursor-pointer',
        'w-full transition-[opacity,transform] duration-500',
        isActive ? 'opacity-100 scale-100 z-10' : 'opacity-60 scale-[0.85] z-0',
      )}
      onClick={isActive ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* ── Background image layer ───────────────────────────────────── */}
      {hasBg && (
        <motion.div
          className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none"
          style={{
            y: bgScrollY,
            x: isActive ? bgMouseX : undefined,
          }}
        >
          <Media
            resource={backgroundImage}
            fill
            imgClassName="object-cover"
          />
        </motion.div>
      )}

      {/* ── Gradient scrim ───────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/20 to-transparent pointer-events-none" />

      {/* ── Slide content — top-left ─────────────────────────────────── */}
      {content && (
        <div className="absolute top-6 left-6 z-10 max-w-xs">
          <RichText
            data={content}
            enableGutter={false}
            className={cn(
              '[&_h3]:type-headline-3 [&_h3]:text-white [&_h3]:mb-2',
              '[&_h4]:type-title-md [&_h4]:text-white [&_h4]:mb-2',
              '[&_p]:type-body-md [&_p]:text-white/80 [&_p]:leading-snug',
            )}
          />
        </div>
      )}

      {/* ── Foreground image layer ───────────────────────────────────── */}
      {hasFg && (
        <motion.div
          className="absolute bottom-0 left-6 right-6 h-1/2 pointer-events-none"
          style={{
            y: fgScrollY,
            x: isActive ? fgMouseX : undefined,
          }}
        >
          <Media
            resource={foregroundImage}
            fill
            imgClassName="object-contain object-bottom"
          />
        </motion.div>
      )}

      {/* ── Next button — bottom-right (active slide only) ───────────── */}
      {isActive && (
        <div className="absolute bottom-6 right-6 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdvance()
            }}
            className={cn(
              'bg-background/80 backdrop-blur-sm border border-border',
              'rounded-full px-4 py-2 type-label-sm text-foreground',
              'hover:bg-background/95 transition-colors duration-150',
            )}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Mouse-tracking badge (inactive slides only) ──────────────── */}
      {!isActive && (
        <div
          className={cn(
            'absolute pointer-events-none z-20 transition-opacity duration-150',
            'bg-background/80 backdrop-blur-sm border border-border',
            'rounded-full px-3 py-1.5 type-label-sm text-foreground',
            '-translate-x-1/2 -translate-y-1/2',
            badgeVisible ? 'opacity-100' : 'opacity-0',
          )}
          style={{ left: badgePos.x, top: badgePos.y }}
        >
          {direction === 'prev' ? '← Prev' : 'Next →'}
        </div>
      )}
    </motion.li>
  )

  // Wrap the whole slide in CMSLink if there's a valid link
  if (hasLink && isActive) {
    return (
      <CMSLink
        type={link.type}
        url={link.url}
        reference={link.reference as any}
        newTab={link.newTab}
        className="block"
      >
        {slideInner}
      </CMSLink>
    )
  }

  return slideInner
}
```

**Step 2: Check TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | grep "ParallaxShowcase\|Slide" | head -20
```

Expected: Errors only from `Component.tsx` not existing yet (imported in `RenderBlocks.tsx`). No errors in `Slide.tsx` itself.

**Step 3: Commit**

```bash
git add src/blocks/ParallaxShowcase/Slide.tsx
git commit -m "feat(parallax-showcase): add Slide component with dual-layer parallax and mouse badge"
```

---

## Task 4: Create the Carousel Orchestrator (`index.tsx`)

**Files:**
- Create: `src/blocks/ParallaxShowcase/index.tsx`

This is the main `"use client"` carousel component. It manages state, auto-scroll, tab nav, and the slide track layout.

**Step 1: Create the file**

```typescript
// src/blocks/ParallaxShowcase/index.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { ParallaxSlide } from './Slide'

// Width constants — must match Tailwind max-w values in pixels
// max-w-5xl = 64rem = 1024px; inactive slides render at 85% of that
const ACTIVE_SLIDE_WIDTH = 1024  // px — max-w-5xl
const INACTIVE_SCALE = 0.85
const SLIDE_GAP = 24             // px — gap between slides

interface Props extends ParallaxShowcaseBlock {
  disableInnerContainer?: boolean
}

export const ParallaxShowcaseCarousel: React.FC<Props> = ({
  intro,
  autoScrollInterval,
  slides,
}) => {
  const safeSlides = slides ?? []
  const middle = Math.floor(safeSlides.length / 2)

  const [currentIndex, setCurrentIndex] = useState(middle)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || safeSlides.length <= 1) return
    const interval = Math.max(2, autoScrollInterval ?? 5) * 1000
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % safeSlides.length)
    }, interval)
    return () => clearInterval(id)
  }, [isPaused, autoScrollInterval, safeSlides.length])

  const advance = () =>
    setCurrentIndex((i) => (i + 1) % safeSlides.length)

  // ── Track translation ─────────────────────────────────────────────────────
  // Each slide occupies ACTIVE_SLIDE_WIDTH (active) or ACTIVE_SLIDE_WIDTH*INACTIVE_SCALE (inactive).
  // We center the active slide in the viewport using translateX.
  // This is a viewport-relative offset: how far left to shift the track.
  //
  // Simple approach: all slides are rendered at ACTIVE_SLIDE_WIDTH; CSS scale handles
  // the visual size. The track translateX centers slide[currentIndex].
  const translateX = -(currentIndex * (ACTIVE_SLIDE_WIDTH + SLIDE_GAP))

  return (
    <section
      className="relative py-12 md:py-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Block intro + tab nav ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 mb-10 space-y-8">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className={cn(
              '[&_h2]:type-title-xl [&_h2]:text-type-heading [&_h2]:mb-0',
              '[&_h3]:type-headline-3 [&_h3]:text-type-heading [&_h3]:mb-0',
              '[&_p]:type-body-lg [&_p]:text-type-body [&_p]:leading-snug',
            )}
          />
        )}

        {/* Tab navigation */}
        {safeSlides.length > 0 && (
          <div className="flex flex-wrap gap-2" role="tablist">
            {safeSlides.map((slide, i) => (
              <button
                key={slide.id ?? i}
                role="tab"
                aria-selected={i === currentIndex}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'px-4 py-2 rounded-full type-label-sm transition-colors duration-200',
                  'border border-border',
                  i === currentIndex
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-foreground hover:bg-muted',
                )}
              >
                {slide.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Carousel track ────────────────────────────────────────────────── */}
      {/* overflow-x: clip lets inactive slides bleed past the section edge    */}
      {/* without creating a horizontal scrollbar or breaking vertical scroll  */}
      <div className="w-full" style={{ overflowX: 'clip' }}>
        <motion.div
          ref={trackRef}
          className="flex items-center"
          style={{ gap: SLIDE_GAP }}
          // Center the track: start offset brings first slide to center, then shift by index
          animate={{
            x: `calc(50vw - ${ACTIVE_SLIDE_WIDTH / 2}px + ${translateX}px)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 40 }}
        >
          {safeSlides.map((slide, i) => {
            const direction =
              i < currentIndex ? 'prev' : i > currentIndex ? 'next' : 'active'
            return (
              <div
                key={slide.id ?? i}
                style={{ width: ACTIVE_SLIDE_WIDTH, flexShrink: 0 }}
              >
                <ParallaxSlide
                  slide={slide}
                  isActive={i === currentIndex}
                  direction={direction}
                  onClick={() => setCurrentIndex(i)}
                  onAdvance={advance}
                />
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Check TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | grep "ParallaxShowcase\|index.tsx\|Slide.tsx" | head -20
```

Expected: Only `Component.tsx` still missing. `index.tsx` and `Slide.tsx` should be clean.

**Step 3: Commit**

```bash
git add src/blocks/ParallaxShowcase/index.tsx
git commit -m "feat(parallax-showcase): add carousel orchestrator with auto-scroll and tab nav"
```

---

## Task 5: Create the Server Component Wrapper (`Component.tsx`)

**Files:**
- Create: `src/blocks/ParallaxShowcase/Component.tsx`

This thin wrapper is what `RenderBlocks.tsx` imports. It exists to keep the "use client" boundary inside `index.tsx`.

**Step 1: Create the file**

```typescript
// src/blocks/ParallaxShowcase/Component.tsx
import React from 'react'

import type { ParallaxShowcaseBlock } from '@/payload-types'
import { ParallaxShowcaseCarousel } from './index'

export const ParallaxShowcaseBlockComponent: React.FC<
  ParallaxShowcaseBlock & { disableInnerContainer?: boolean }
> = (props) => {
  return <ParallaxShowcaseCarousel {...props} />
}
```

**Step 2: Run full TypeScript check — must be clean**

```bash
pnpm tsc --noEmit 2>&1
```

Expected: **Zero errors** (or only pre-existing errors unrelated to the new block). If there are new errors, fix them before proceeding.

**Step 3: Commit**

```bash
git add src/blocks/ParallaxShowcase/Component.tsx
git commit -m "feat(parallax-showcase): add server component wrapper, complete implementation"
```

---

## Task 6: Full Type Check and Dev Server Smoke Test

**Step 1: Final TypeScript compilation**

```bash
pnpm tsc --noEmit 2>&1
```

Expected: Zero new errors.

**Step 2: Start dev server**

```bash
pnpm dev
```

Open `http://localhost:3000/admin`. Navigate to Pages → create or edit a page → add a block → verify "Parallax Showcase" appears in the block picker.

Add the block with:
- Intro: an H2 heading + a paragraph
- `autoScrollInterval`: 5
- At least 3 slides, each with a name, content (H3 + paragraph), a background image, and a link

**Step 3: Check the frontend**

Open the page in preview. Verify:

- [ ] Intro text renders above the carousel with correct typography
- [ ] Tab nav shows all slide names; active tab has `bg-primary` styling
- [ ] Carousel starts on the middle slide
- [ ] Inactive slides are visible on both sides, scaled down
- [ ] Auto-scroll advances after 5 seconds
- [ ] Hovering pauses auto-scroll; leaving resumes
- [ ] Clicking a tab jumps to that slide
- [ ] Hovering an inactive slide shows the Prev/Next badge tracking the cursor
- [ ] Clicking an inactive slide navigates to it
- [ ] Hovering the active slide creates a subtle depth shift (BG vs FG layers move differently)
- [ ] Scrolling the page creates the background/foreground parallax separation
- [ ] The "Next →" button at bottom-right of the active slide advances the carousel
- [ ] Clicking the active slide navigates to its link

**Step 4: Fix any visual issues, then commit**

```bash
git add -p  # stage only the fix
git commit -m "fix(parallax-showcase): <describe what was fixed>"
```

---

## Acceptance Checklist (from design doc)

- [ ] Payload admin: intro RichText + autoScrollInterval + slides array (name, content, backgroundImage, foregroundImage, link)
- [ ] Block-level intro renders with correct typography tokens
- [ ] Tab nav shows all slide names; active tab highlighted with `bg-primary text-primary-foreground`
- [ ] Carousel starts on the middle slide
- [ ] Auto-scroll advances every N seconds (default 5s)
- [ ] Auto-scroll pauses on mouse enter, resumes on mouse leave
- [ ] Active slide: `max-w-5xl` (1024px), 3:2 aspect ratio, `scale-100`
- [ ] Inactive slides: visible on both sides, `scale-[0.85]`, partially clipped
- [ ] Scroll parallax: BG shifts +8%, FG counter-shifts −8%
- [ ] Hover parallax (active): BG shifts ±12px, FG shifts ±20px per mouse position
- [ ] Inactive slide hover: Prev/Next badge tracks cursor
- [ ] Clicking inactive slide → navigates to it
- [ ] Clicking active slide / badge → navigates to `link`
- [ ] "Next →" button advances the carousel
- [ ] Slide content (RichText) renders top-left with white text
- [ ] Foreground image renders with `object-contain object-bottom`
- [ ] No layout shift or overflow issues at all viewport widths
- [ ] TypeScript: zero new errors; no unresolved `any` casts beyond `link.reference as any` (existing pattern)
