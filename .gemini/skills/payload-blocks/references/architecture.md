# Block Architecture & Registration

## 1. File Structure

```
src/blocks/BlockName/
  config.ts       # Payload fields
  Component.tsx   # Variant router (or direct component if single-variant)
  VariantA/
    index.tsx     # Variant implementation
```

## 2. config.ts Pattern

```typescript
export const BlockName: Block = {
  slug: 'blockName',                // camelCase
  interfaceName: 'BlockNameBlock',  // PascalCase + Block
  fields: [
    { name: 'variant', type: 'select', defaultValue: 'default', options: [...] },
    { name: 'intro', type: 'richText', required: false, editor: lexicalEditor({...}) },
    { name: 'items', type: 'array', minRows: 1, maxRows: 8, fields: [...] },
    { type: 'collapsible', label: 'Images', fields: [
      { name: 'imageLight', type: 'upload', relationTo: 'media', required: false },
      { name: 'imageDark',  type: 'upload', relationTo: 'media', required: false },
    ]},
  ],
}
```

## 3. Canonical Field Names

- `intro`: Section intro richText
- `items`: Array of features/cards
- `variant`: Layout selector
- `imageLight`, `imageDark`: Themed background images
- `icon`: Icon picker (select)
- `link`, `links`: CTA links (use `linkGroup()` helper)
- `badge`: Eyebrow text

## 4. Registration

Every new block MUST be registered in:
1. `src/blocks/RenderBlocks.tsx` (`blockComponents` object)
2. `src/collections/Pages/index.ts` (`blocks` array in layout field)

## 5. Migrations

After any change to `config.ts`:
1. `pnpm payload migrate:create --name [description]`
2. `pnpm payload migrate` (apply locally)
