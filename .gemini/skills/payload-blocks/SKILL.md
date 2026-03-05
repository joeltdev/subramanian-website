---
name: payload-blocks
description: Workflows for Payload CMS block development (scaffolding, auditing, styling, and registration). Use when creating new blocks or fixing style/architecture violations in existing ones.
---

# Payload Blocks Workflows

Expert guidance for developing and maintaining blocks in the iNELS Content Studio project.

## 1. Creating New Blocks (Scaffolding)

Follow these steps when asked to create a new block:
1.  **Architecture**: Follow the structure in [architecture.md](references/architecture.md). Create `src/blocks/BlockName/` with `config.ts` and `Component.tsx`.
2.  **Styling**: Use semantic tokens, project type utilities, and RichText overrides from [styling.md](references/styling.md).
3.  **Registration**: Register in `RenderBlocks.tsx` and `Pages/index.ts` as specified in [architecture.md](references/architecture.md).
4.  **Verification**: Follow the "New Block Checklist" in `docs/BLOCK_STYLEGUIDE.md` for final checks.

## 2. Auditing & Fixing Blocks

When asked to audit or fix a block:
1.  **Phase 1 (Audit)**: Follow the audit process in [audit.md](references/audit.md). Identify all style and naming violations using [styling.md](references/styling.md) as the source of truth.
2.  **Phase 2 (Fix)**: After confirmation, apply surgical fixes as described in [audit.md](references/audit.md).

## 3. Migration Management

Any change to a block's `config.ts` requires a migration:
-   `pnpm payload migrate:create --name [description]`
-   `pnpm payload migrate` (apply locally)
-   Refer to [architecture.md](references/architecture.md) for breaking change patterns (renames/removals).

## Core Reference Files

-   [styling.md](references/styling.md): Design tokens, typography scale, and layout rules.
-   [architecture.md](references/architecture.md): File structure, canonical field names, and registration rules.
-   [audit.md](references/audit.md): Workflow for auditing existing blocks.
