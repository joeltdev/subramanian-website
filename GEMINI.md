# iNELS Content Studio — Gemini CLI Mandates

This file serves as the foundational memory and set of mandates for Gemini CLI in this project. These rules take precedence over all general workflows.

## 1. Project Standards Reference
- **Core Payload Rules**: Refer to `AGENTS.md` and `.cursor/rules/*.md`.
- **Block Reference**: Refer to `docs/BLOCK_REFERENCE.md`.
- **Styling Source of Truth**: Refer to `docs/BLOCK_STYLEGUIDE.md`.

## 2. Critical Styling Mandates (NO EXCEPTIONS)
- **Semantic Tokens Only**: Never use raw Tailwind palette colors (e.g., `brand-500`) or raw text-size classes (e.g., `text-2xl`). Always use semantic variables:
  - Surfaces: `bg-background`, `bg-card`, `bg-muted`.
  - Type Color: `text-type-heading`, `text-type-body`, `text-type-secondary`.
  - Type Scale: `type-headline-1`, `type-title-md`, `type-body-xl`, etc.
- **RichText Overrides**: Always style CMS content using the arbitrary group selector pattern:
  - Example: `className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl"`
- **Section Themes**: Use `data-section-theme="light|dark|brand"` on the block wrapper. Never hardcode dark backgrounds.
- **Layout**: 
  - Container: `mx-auto max-w-7xl px-6 md:px-8`.
  - Padding: `py-16 md:py-24`. **NO `my-*`** on block wrappers (handled by `RenderBlocks`).
  - Cards: `bg-muted px-6 py-8 rounded-none` (Sharp corners are the project standard).

## 3. Block Architecture & Registration
- **Structure**: `src/blocks/BlockName/` contains `config.ts`, `Component.tsx`, and variant folders.
- **Registration**: Every new block MUST be registered in:
  1. `src/blocks/RenderBlocks.tsx` (`blockComponents` object).
  2. `src/collections/Pages/index.ts` (`blocks` array in layout field).

## 4. Engineering Workflow
- **Migrations**: Every change to a block's `config.ts` (even a label change) requires:
  - `pnpm payload migrate:create --name [description]`
  - `pnpm payload migrate` (apply locally before testing).
- **Security**: 
  - Always pass `req` to nested operations in hooks.
  - Set `overrideAccess: false` when passing `user` to the Local API.
  - Use `context` flags to prevent infinite hook loops.

## 5. Automation
- Run `pnpm payload generate:importmap` after adding or moving custom components.
- Run `pnpm payload generate:types` after any schema change.
