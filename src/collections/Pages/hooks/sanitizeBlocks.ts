import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Strips array fields belonging to inactive variants on multi-variant blocks.
 *
 * Problem: admin.condition only hides fields in the UI — on save, Payload still
 * receives data for every array regardless of which variant is active. Stale IDs
 * from previously-filled arrays cause "invalid id" errors when Payload tries to
 * reconcile them with the database.
 *
 * Solution: before the document is written, clear any array/richText fields that
 * don't belong to the currently-selected variant so Payload never sees stale IDs.
 */
export const sanitizeBlocks: CollectionBeforeChangeHook = ({ data }) => {
  if (!Array.isArray(data?.layout)) return data

  data.layout = data.layout.map((block: Record<string, unknown>) => {
    if (block.blockType === 'featureBento') {
      const variant = block.variant as string
      if (variant !== 'stats') block.items = []
      if (variant !== 'metrics') block.panelItems = []
      if (variant !== 'panels') block.imagePanels = []
      if (variant !== 'accordion') {
        block.accordionItems = []
        block.intro = null
      }
    }
    return block
  })

  return data
}
