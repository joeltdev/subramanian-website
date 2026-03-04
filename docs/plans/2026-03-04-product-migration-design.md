# Product Data Migration Design

**Date**: 2026-03-04
**Status**: Approved

## Goal

Import 138 products, 33 categories, and 3 tags from an old Payload CMS SQLite dump (`product-data.sql`) into the new Payload 3.x PostgreSQL instance. Include product images fetched from the old CDN.

## Source Data

File: `product-data.sql` (repo root)
Old CMS: Payload CMS with SQLite adapter (same field structure, flat column format)

| Table | Records |
|-------|---------|
| `product_categories` | 33 (2-level hierarchy) |
| `product_tags` | 3 (New, Best Seller!, Obsolete) |
| `products` | 138 |

## Target Collections

- `product-categories` — `src/collections/ProductCategories.ts`
- `product-tags` — `src/collections/ProductTags.ts`
- `products` — `src/collections/Products/index.ts`
- `media` — images uploaded via Payload Local API

## Script

**File**: `src/scripts/seed-products.ts`
**Runner**: `pnpm payload run src/scripts/seed-products.ts`
**Config** (add to `.env.local`):

```
OLD_CMS_MEDIA_BASE_URL=https://new.inels.com/uploads/products_page
```

## Column Mappings

### product_categories

| SQL position | SQL field | → Payload field | Notes |
|---|---|---|---|
| 0 | id | (tracked internally) | Used to resolve parent relationships |
| 3 | name | `name` | required |
| 4 | slug | `slug` | auto-generated from name if empty |
| 5 | description | `description` | |
| 8 | parentId | `parent` | resolved via old→new ID map |
| 10 | image JSON | `image` | `{uploadId, alt}` → uploaded to media |
| 11 | sortOrder | `sortOrder` | |
| 12 | color | `color` | hex string |

Discarded: locale, _id, depth (managed by nestedDocsPlugin), createdAt, updatedAt.

### product_tags

| SQL position | SQL field | → Payload field |
|---|---|---|
| 3 | label | `label` |
| 4 | value | `value` |

Discarded: id, locale, _id, extra columns (empty), createdAt, updatedAt.

### products

| SQL position | SQL field | → Payload field | Notes |
|---|---|---|---|
| 3 | slug | `slug` | strip leading `/` |
| 4 | published | `_status` | `true` → `'published'` |
| 6 | name | `name` | required |
| 8 | description | `description` | HTML → Lexical JSON |
| 15 | productCode | `productCode` | |
| 16 | subtitle | `subtitle` | |
| 17 | gallery JSON | `productGallery` | uploadIds → new media IDs |
| 18 | ean | `ean` | |
| 20 | categoryId | `category` | resolved via old→new map |
| 21 | tags JSON | `tags` | always `[]` in source data |
| 22 | price | `price` | |
| 23 | currency | `currency` | |
| 24 | instructionManual | `instructionManual` | |
| 26 | threeDModel | `threeDModel` | |
| 31 | dataSheet | `dataSheet` | |
| 32 | ecDeclaration JSON | `ecDeclaration` | `[{url}]` array |

Fields with no source data left empty: `technicalParameters`, `buyLink`, `productVideo`.
Discarded: locale, _id, versionId, visible, stdCode (pos 19), searchText, createdAt, updatedAt.

## Image Migration

### URL Pattern

```
{OLD_CMS_MEDIA_BASE_URL}/{category-path}/{product-slug}.png
```

- `product-slug` = SQL slug column with leading `/` stripped (e.g. `/rfowb` → `rfowb`)
- `category-path` = derived from category hierarchy, varies by depth:
  - 2-level: `{root-category-slug}/{sub-category-slug}`
  - 1-level: `{category-slug}`

Category folder names are normalized from category name: lowercase, spaces → hyphens.

### Fetch Strategy (per product)

1. Try 2-level URL: `{base}/{root-slug}/{cat-slug}/{product-slug}.png`
2. If HTTP 404, try 1-level URL: `{base}/{cat-slug}/{product-slug}.png`
3. If still 404, log the failure and continue — product still imports without image

### Upload to Payload

Images are downloaded as buffers and uploaded to the `media` collection via Local API:

```ts
payload.create({
  collection: 'media',
  data: { alt: altText },
  file: { data: buffer, mimetype: 'image/png', name: `${slug}.png`, size: buffer.byteLength },
})
```

## Execution Phases

```
Phase 1  Parse SQL
         → regex-extract INSERT rows for all 3 tables
         → build in-memory arrays

Phase 2  Upload category images
         → for each category with a non-null image field
         → fetch + upload → build oldUploadId → newMediaId map

Phase 3  Seed categories — pass 1 (roots)
         → insert categories where parentId IS NULL
         → capture oldId → newPayloadId map

Phase 4  Seed categories — pass 2 (children)
         → insert categories where parentId IS NOT NULL
         → resolve parent via map from pass 1

Phase 5  Seed tags
         → insert 3 tags
         → capture oldId → newPayloadId map

Phase 6  Upload product images
         → collect unique uploadIds from gallery JSON
         → try 2-level URL, fall back to 1-level, skip+log on failure

Phase 7  Seed products
         → resolve category ID via map
         → resolve gallery uploadIds via media map
         → convert HTML description → Lexical JSON
         → create as _status: 'published'
```

## HTML → Lexical Conversion

Uses `jsdom` (already in devDependencies) to parse HTML. A custom `htmlToLexical()` utility walks the DOM and converts:

| HTML tag | → Lexical node |
|---|---|
| `<p>` | paragraph node |
| `<h2>`, `<h3>`, `<h4>` | heading node |
| `<strong>`, `<b>` | text with bold format |
| `<em>`, `<i>` | text with italic format |
| `<a>` | link node |
| `<ul>`, `<ol>`, `<li>` | list + listitem nodes |
| `<br>` | linebreak node |

## Idempotency

Before each `payload.create()`, the script checks if a document with that slug already exists:

```ts
const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
if (existing.docs.length > 0) { /* skip */ }
```

Safe to re-run without creating duplicates.

## Error Handling

- Each record insert is wrapped in try/catch
- Failures are collected, not thrown — the import continues
- End-of-run summary prints:
  - `✓ X categories created`
  - `✓ X tags created`
  - `✓ X products created`
  - `⚠ X products skipped (already existed)`
  - `✗ X products failed` (with slugs)
  - `✗ X images failed` (with attempted URLs)

## Files to Create

- `src/scripts/seed-products.ts` — main seed script
- `src/scripts/lib/html-to-lexical.ts` — HTML→Lexical converter utility
