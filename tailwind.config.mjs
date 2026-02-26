/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          // Array format: Block B is generated after Block A in the CSS output.
          // Since Tailwind Typography wraps all selectors in :where() (zero inner
          // specificity), source order determines the winner for same-specificity rules.
          // This lets Block B's adjacent-sibling rules reliably override Block A's
          // base element margins without needing !important.
          css: [
            // ── Block A: Color tokens + typographic properties + base margins ──────
            {
              // Color tokens — CSS custom properties that auto-adapt to
              // light/dark mode via [data-theme='dark'] in globals.css
              '--tw-prose-body': 'var(--muted-foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              '--tw-prose-lead': 'var(--muted-foreground)',
              '--tw-prose-links': 'var(--foreground)',
              '--tw-prose-bold': 'var(--foreground)',
              '--tw-prose-counters': 'var(--muted-foreground)',
              '--tw-prose-bullets': 'var(--border)',
              '--tw-prose-hr': 'var(--border)',
              '--tw-prose-quotes': 'var(--foreground)',
              '--tw-prose-quote-borders': 'var(--border)',
              '--tw-prose-captions': 'var(--muted-foreground)',
              '--tw-prose-code': 'var(--foreground)',
              '--tw-prose-pre-code': 'var(--muted-foreground)',
              '--tw-prose-pre-bg': 'var(--muted)',
              '--tw-prose-th-borders': 'var(--border)',
              '--tw-prose-td-borders': 'var(--border)',
              // Invert (dark:prose-invert) — same vars, they resolve to dark-theme values
              '--tw-prose-invert-body': 'var(--muted-foreground)',
              '--tw-prose-invert-headings': 'var(--foreground)',
              '--tw-prose-invert-lead': 'var(--muted-foreground)',
              '--tw-prose-invert-links': 'var(--foreground)',
              '--tw-prose-invert-bold': 'var(--foreground)',
              '--tw-prose-invert-counters': 'var(--muted-foreground)',
              '--tw-prose-invert-bullets': 'var(--border)',
              '--tw-prose-invert-hr': 'var(--border)',
              '--tw-prose-invert-quotes': 'var(--foreground)',
              '--tw-prose-invert-quote-borders': 'var(--border)',
              '--tw-prose-invert-captions': 'var(--muted-foreground)',
              '--tw-prose-invert-code': 'var(--foreground)',
              '--tw-prose-invert-pre-code': 'var(--muted-foreground)',
              '--tw-prose-invert-pre-bg': 'var(--muted)',
              '--tw-prose-invert-th-borders': 'var(--border)',
              '--tw-prose-invert-td-borders': 'var(--border)',

              // Outer width — let block containers handle layout
              maxWidth: 'none',

              // ── Headings ──────────────────────────────────────────────────────
              // marginTop uses rem (not em) so spacing is predictable regardless of
              // heading size. This controls the "section break" distance when a heading
              // follows body text. marginBottom stays small — the adjacent-sibling rules
              // in Block B tighten the gap further when heading directly precedes content.
              h1: {
                fontWeight: '800',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
                textWrap: 'balance',
                marginTop: '3.5rem',   // p→h1 gap (section break): 56px
                marginBottom: '0.5rem', // h1→content gap before sibling override: 8px
              },
              h2: {
                fontWeight: '800',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                textWrap: 'balance',
                marginTop: '3rem',     // p→h2 gap (section break): 48px
                marginBottom: '0.5rem', // h2→content gap before sibling override: 8px
              },
              h3: {
                fontWeight: '700',
                letterSpacing: '-0.015em',
                lineHeight: '1.25',
                textWrap: 'balance',
                marginTop: '2rem',     // p→h3 gap (sub-section break): 32px
                marginBottom: '0.35rem', // h3→content gap before sibling override: ~6px
              },
              h4: {
                fontWeight: '600',
                letterSpacing: '-0.01em',
                lineHeight: '1.35',
                marginTop: '1.5rem',   // p→h4 gap: 24px
                marginBottom: '0.25rem', // h4→content gap before sibling override: 4px
              },

              // ── Body ──────────────────────────────────────────────────────────
              // p→p gap: 1rem + 1rem → CSS collapse → 1rem (16px). Comfortable.
              // p→heading gap: 1rem collapses into heading's larger marginTop (3rem etc.).
              p: {
                lineHeight: '1.75',
                textWrap: 'pretty',
                marginTop: '1rem',
                marginBottom: '1rem',
              },

              // ── First/last element: strip outer margins ────────────────────────
              // Outer section/wrapper padding handles block-level spacing.
              'h1:first-child': { marginTop: '0' },
              'h2:first-child': { marginTop: '0' },
              'h3:first-child': { marginTop: '0' },
              'h4:first-child': { marginTop: '0' },
              'p:first-child':  { marginTop: '0' },
              'p:last-child':   { marginBottom: '0' },
            },

            // ── Block B: Adjacent-sibling spacing overrides ───────────────────────
            // Generated after Block A → wins the same-specificity cascade.
            //
            // Design intent: when a heading directly precedes content it "owns"
            // (its supporting paragraph, sub-heading, or list), the gap should be
            // minimal so they read as one typographic unit. The larger marginTop on
            // the heading (Block A) is for the opposite relationship — when NEW
            // content starts after a stretch of body text.
            //
            // Visual gaps (desktop, CSS margin-collapse applied):
            //   h2 → p          : ~8px   (heading + sub-copy feel locked together)
            //   h2 → h3         : ~8px   (section title + subtitle feel locked together)
            //   h3 → p          : ~6px   (sub-heading + its content)
            //   h3 → h4         : ~6px
            //   h4 → p          : ~4px
            //   heading → ul/ol : same as heading → p
            //   p   → h2        : ~48px  (clear topic break)
            //   p   → h3        : ~32px
            //   p   → p         : ~16px  (comfortable paragraph separation)
            {
              // heading → paragraph  (tight coupling — they belong together)
              'h1 + p': { marginTop: '0.5rem' },
              'h2 + p': { marginTop: '0.5rem' },
              'h3 + p': { marginTop: '0.35rem' },
              'h4 + p': { marginTop: '0.25rem' },

              // heading → list  (same tight coupling)
              'h2 + ul': { marginTop: '0.5rem' },
              'h2 + ol': { marginTop: '0.5rem' },
              'h3 + ul': { marginTop: '0.35rem' },
              'h3 + ol': { marginTop: '0.35rem' },
              'h4 + ul': { marginTop: '0.25rem' },
              'h4 + ol': { marginTop: '0.25rem' },

              // heading → sub-heading  (subordinate — visually attached)
              'h2 + h3': { marginTop: '0.5rem' },
              'h3 + h4': { marginTop: '0.35rem' },
            },
          ],
        },

        // ── Responsive size scales ─────────────────────────────────────────────
        // Applied via `prose` (base, mobile) and `md:prose-md` (desktop).
        // Only font-sizes here — all spacing logic lives in DEFAULT above.
        base: {
          css: {
            fontSize: '1rem',
            lineHeight: '1.75',
            h1: { fontSize: '2.5rem' },
            h2: { fontSize: '2rem' },
            h3: { fontSize: '1.375rem' },
            h4: { fontSize: '1.125rem' },
          },
        },
        md: {
          css: {
            fontSize: '1.0625rem',
            lineHeight: '1.75',
            h1: { fontSize: '3.75rem' },
            h2: { fontSize: '2.75rem' },
            h3: { fontSize: '1.875rem' },
            h4: { fontSize: '1.25rem' },
          },
        },
      }),
    },
  },
}

export default config
