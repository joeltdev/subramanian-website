# Block Architecture & Registration Reference

This reference documents the structural requirements for blocks in iNELS Content Studio.

## 1. Block File Structure

Every block lives in its own directory under `src/blocks/`:

```
src/blocks/BlockName/
  config.ts              # Payload CMS field definitions
  Component.tsx          # Entry point: variant router or direct component
  VariantA/
    index.tsx            # Variant implementation
```

## 2. Registration

After creating a block, it MUST be registered in two places:

### `src/blocks/RenderBlocks.tsx`
Add import and entry to `blockComponents`:
```typescript
import { BlockNameComponent as BlockNameBlock } from './BlockName/Component'

const blockComponents = {
  // ...existing blocks
  blockName: BlockNameBlock,
}
```

### `src/collections/Pages/index.ts`
Add to `blocks` array in the layout field:
```typescript
import { BlockName } from '@/blocks/BlockName/config'

// Inside fields → layout → blocks array:
blocks: [
  // ...existing blocks
  BlockName,
],
```

## 3. Config.ts Pattern

Every `config.ts` exports a named `Block` constant:

```typescript
import type { Block } from 'payload'
import { lexicalEditor, HeadingFeature, FixedToolbarFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'

export const BlockName: Block = {
  slug: 'blockName',                    // camelCase, matches RenderBlocks key
  interfaceName: 'BlockNameBlock',      // PascalCase + Block suffix
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [...],
    },
    {
      name: 'intro',
      type: 'richText',
      required: false,
      editor: lexicalEditor({...}),
    },
  ],
}
```
