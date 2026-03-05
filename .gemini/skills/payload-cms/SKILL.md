---
name: payload-cms
description: Workflows for Payload CMS development in the iNELS Content Studio project. Includes block scaffolding, registration, styling, and migration automation.
---

# Payload CMS Workflows

Specialized workflows for developing in the iNELS Content Studio Payload CMS project.

## 1. Block Scaffolding

When asked to create a new block:
1.  **Create Directory**: `src/blocks/BlockName/`
2.  **config.ts**: Implement Payload fields following `references/architecture.md`. Use semantic tokens.
3.  **Component.tsx**: Implement the variant router.
4.  **Variant Implementation**: Create `VariantName/index.tsx`. Use `'use client'` if using motion.
5.  **Styling**: Apply the iNELS semantic tokens and RichText override patterns from `references/styling.md`.

## 2. Block Registration

Always register the new block in:
-   `src/blocks/RenderBlocks.tsx`: Add to `blockComponents`.
-   `src/collections/Pages/index.ts`: Add to the `blocks` array in the `layout` field.

## 3. Migrations

After modifying a block's `config.ts` or any collection schema:
1.  **Create Migration**: `pnpm payload migrate:create --name [description]`
2.  **Apply Locally**: `pnpm payload migrate`

## 4. Security Guardrails

-   **Local API**: Always set `overrideAccess: false` when passing a `user`.
-   **Hooks**: Always pass `req` to nested operations to preserve transactions.
-   **Hook Loops**: Use `context.skipHooks` to prevent infinite loops in `afterChange` hooks.
-   Refer to `references/security.md` for detailed patterns.

## 5. Automation

After adding or moving components:
-   `pnpm payload generate:importmap`
-   `pnpm payload generate:types`
