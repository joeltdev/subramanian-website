# Add Link Button to Poster Hero Block

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a call-to-action button to the Poster Hero block using the project's standard link field and CMSLink component.

**Architecture:** Update `config.ts` to include the `link` field and `Component.tsx` to render the `CMSLink`.

**Tech Stack:** React, Payload CMS, Tailwind CSS, Framer Motion.

---

### Task 1: Update Block Configuration

**Files:**
- Modify: `src/blocks/PosterHero/config.ts`

**Step 1: Import the link field**
Add `import { link } from '@/fields/link'` to the top of the file.

**Step 2: Add the link field to the blocks field array**
Append the `link({})` field to the `fields` array in the `PosterHero` object.

**Step 3: Commit**
```bash
git add src/blocks/PosterHero/config.ts
git commit -m "feat(blocks): add link field to PosterHero config"
```

---

### Task 2: Update UI Component

**Files:**
- Modify: `src/blocks/PosterHero/Component.tsx`

**Step 1: Import CMSLink**
Add `import { CMSLink } from '@/components/Link'` to the top of the file.

**Step 2: Destructure and Render the Link**
Extract the `link` prop and render it inside the text content area, below the subheadline. Use Framer Motion for a staggered entrance.

**Step 3: Style the Button**
Apply custom Tailwind classes to match the poster aesthetic (e.g., bold, uppercase, sharp corners).

**Step 4: Commit**
```bash
git add src/blocks/PosterHero/Component.tsx
git commit -m "feat(blocks): render CTA link in PosterHero component"
```

---

### Task 3: Sync Schema & Migration

**Files:**
- Shell commands

**Step 1: Generate Types**
Run: `pnpm payload generate:types`

**Step 2: Create Migration**
Run: `pnpm payload migrate:create --name add_link_to_poster_hero`

**Step 3: Apply Migration**
Run: `pnpm payload migrate`

**Step 4: Commit**
```bash
git add src/payload-types.ts src/migrations/
git commit -m "chore(blocks): sync schema for PosterHero link addition"
```
