# Block Auditing Workflow

Follow this two-phase process for auditing and fixing blocks.

## Phase 1 — Audit (No code changes)

1. Read all files in `src/blocks/$BLOCK_NAME/`.
2. Compare against rules in `references/styling.md` and `references/architecture.md`.
3. Generate a report in this format:

```
### Violations: src/blocks/<BlockName>

**Colors**
- <file>:<line> — <raw-value> → use <token>

**Typography**
- <file>:<line> — raw `text-*` class → use <utility>

**Layout**
- <file>:<line> — `my-*` or `container` usage → fix to `py-*` or project container

**RichText**
- <file>:<line> — missing/incorrect className overrides

**Cards**
- <file>:<line> — `rounded-*` or incorrect padding

**Animations**
- <file>:<line> — incorrect easing/delay/once

Total: N violations
```

4. **STOP.** Do not fix until confirmed.

## Phase 2 — Fix (After confirmation)

Apply surgical styling and naming corrections.
- Only change styles and naming.
- Do not change logic or component structure.
- Renames in `config.ts` are breaking; warn about migrations.
