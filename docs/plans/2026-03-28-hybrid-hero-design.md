# Hybrid Hero Section Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Hero section that uses the existing high-impact Desktop Hero but switches to the modern `PoliticianHero` design for Mobile users.

**Architecture:** We will modify `src/blocks/Hero/RenderHero.tsx` to conditionally render different components based on a CSS-driven approach (using Tailwind's `hidden` and `block` classes) to ensure SEO and fast initial paint. We will also update `PoliticianHero` to adhere to the project's semantic tokens and sharp-corner mandates.

**Tech Stack:** React, Tailwind CSS, Payload CMS, Lucide Icons, Framer Motion.

---

### Task 1: Update PoliticianHero Component for Mandates

**Files:**
- Modify: `src/blocks/PoliticianHero/Component.tsx`

**Step 1: Refactor PoliticianHero to use Semantic Tokens and Sharp Corners**

```tsx
// Change rounded-2xl to rounded-none
// Change text-stone-900 to text-type-heading
// Change text-stone-600 to text-type-body
// Change text-4xl to type-headline-1 (or similar semantic scale)
// Ensure data-section-theme is used
```

**Step 2: Verify locally**
Run: `pnpm build` (to check types)

**Step 3: Commit**
```bash
git add src/blocks/PoliticianHero/Component.tsx
git commit -m "style: update PoliticianHero to use semantic tokens and sharp corners"
```

### Task 2: Integrate PoliticianHero into RenderHero

**Files:**
- Modify: `src/blocks/Hero/RenderHero.tsx`
- Modify: `src/blocks/Hero/config.ts`

**Step 1: Update Hero Config to include PoliticianHero fields**
We need to ensure the Hero group has the fields required by `PoliticianHero` (or map existing ones).

**Step 2: Update RenderHero to handle the hybrid display**

```tsx
import { PoliticianHeroBlock } from '@/blocks/PoliticianHero/Component'

// In RenderHero.tsx:
return (
  <>
    <div className="hidden md:block">
      <HeroToRender {...props} />
    </div>
    <div className="block md:hidden">
      {/* 
         Map props from Hero group to PoliticianHeroProps
         If type is section1/section2, we use a specialized Mobile Hero
      */}
      <PoliticianHeroBlock 
        name={props.richText} // We might need to adjust how we pass these
        // ... other props
      />
    </div>
  </>
)
```

**Step 3: Commit**
```bash
git add src/blocks/Hero/RenderHero.tsx src/blocks/Hero/config.ts
git commit -m "feat: implement hybrid mobile/desktop hero rendering"
```

### Task 3: Refine Mobile-Specific Styling in PoliticianHero

**Files:**
- Modify: `src/blocks/PoliticianHero/Component.tsx`

**Step 1: Implement the "Modern Mobile" design**
- Large image top (60% height)
- Sharp-edged card overlapping bottom (40% height)
- Semantic typography

**Step 2: Commit**
```bash
git add src/blocks/PoliticianHero/Component.tsx
git commit -m "style: finalize modern mobile hero design"
```

### Task 4: Final Verification

**Step 1: Check build**
Run: `pnpm build`

**Step 2: Manual Check (Instruction to User)**
"Please check the home page on both Desktop and Mobile views in the preview."
