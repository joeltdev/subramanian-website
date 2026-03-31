# Poster Hero Block Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-end, editorial-style "Poster Hero" block with a textured blue box, overlapping transparent subject image, and professional Malayalam typography.

**Architecture:** A Payload CMS block following the project's standard structure (`src/blocks/PosterHero/`). Uses Framer Motion for a sophisticated "Option A" entrance animation and CSS variables for semantic styling.

**Tech Stack:** React, Next.js, Payload CMS, Tailwind CSS, Framer Motion, Phosphor Icons.

---

### Task 1: Scaffolding the Block Structure

**Files:**
- Create: `src/blocks/PosterHero/config.ts`
- Create: `src/blocks/PosterHero/Component.tsx`
- Create: `src/blocks/PosterHero/index.ts`

**Step 1: Define the Block Config**
Create `src/blocks/PosterHero/config.ts` with fields for headline, subheadline, highlight color, subject image, and texture overlay toggle.

**Step 2: Create the Base Component**
Implement the React component in `src/blocks/PosterHero/Component.tsx` using Tailwind and Framer Motion for the entrance animation.

**Step 3: Export the Block**
Export everything from `src/blocks/PosterHero/index.ts`.

**Step 4: Commit**
```bash
git add src/blocks/PosterHero/
git commit -m "feat(blocks): scaffold PosterHero block structure"
```

---

### Task 2: Implementing the Poster Hero UI & Animation

**Files:**
- Modify: `src/blocks/PosterHero/Component.tsx`

**Step 1: Implement the "Gallery" Background and Textured Box**
Apply the warm off-white background and the navy blue box with a rounded top-left corner and crumpled paper texture.

**Step 2: Add Professional Malayalam Typography**
Use the `ui-typography` principles for the headline and center-right text block with the mustard gold highlight.

**Step 3: Implement Option A Entrance Animation**
Add Framer Motion variants for the blue box slide-in and the subject image fade-in.

**Step 4: Ensure Responsive Layout**
Verify that the overlapping effect works on mobile by adjusting absolute positioning and scaling.

**Step 5: Commit**
```bash
git add src/blocks/PosterHero/Component.tsx
git commit -m "feat(blocks): implement PosterHero UI and animations"
```

---

### Task 3: Global Registration

**Files:**
- Modify: `src/blocks/RenderBlocks.tsx`
- Modify: `src/collections/Pages/index.ts`

**Step 1: Register in RenderBlocks**
Import `PosterHeroBlock` and add it to the `blockComponents` object.

**Step 2: Register in Pages Collection**
Import the `PosterHero` config and add it to the `layout` blocks array.

**Step 3: Commit**
```bash
git add src/blocks/RenderBlocks.tsx src/collections/Pages/index.ts
git commit -m "feat(blocks): register PosterHero block globally"
```

---

### Task 4: Verification & Types

**Files:**
- Shell commands

**Step 1: Generate Types**
Run: `pnpm payload generate:types`

**Step 2: Create Migration**
Run: `pnpm payload migrate:create --name add_poster_hero_block`

**Step 3: Apply Migration**
Run: `pnpm payload migrate`

**Step 4: Final Check**
Run: `pnpm dev` and verify the block appears in the admin UI and renders correctly on the frontend.

**Step 5: Commit**
```bash
git add src/payload-types.ts src/migrations/
git commit -m "chore(blocks): generate types and migrations for PosterHero"
```
