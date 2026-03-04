// src/scripts/seed-products.ts
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseSqlInserts, type SqlValue } from './lib/parse-sql'
import { htmlToLexical } from './lib/html-to-lexical'

// ── Types ────────────────────────────────────────────────────────────────────

type Row = SqlValue[]

interface CategoryRow {
  oldId: number
  name: string
  slug: string
  description: string
  parentOldId: number | null
  imageUploadId: number | null
  imageAlt: string
  sortOrder: number
  color: string
}

interface TagRow {
  oldId: number
  label: string
  value: string
}

interface ProductRow {
  oldId: number
  slug: string
  name: string
  description: string
  productCode: string
  subtitle: string
  gallery: Array<{ uploadId: number; alt: string }>
  ean: string
  categoryOldId: number | null
  price: number
  currency: string
  instructionManual: string
  threeDModel: string
  dataSheet: string
  ecDeclaration: Array<{ url: string }>
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function mapCategoryRow(row: Row): CategoryRow {
  let imageUploadId: number | null = null
  let imageAlt = ''
  if (row[10] && typeof row[10] === 'string' && row[10] !== 'NULL') {
    try {
      const img = JSON.parse(row[10] as string)
      imageUploadId = img.uploadId ?? null
      imageAlt = img.alt ?? ''
    } catch { /* ignore */ }
  }
  return {
    oldId: row[0] as number,
    name: (row[3] as string) || '',
    slug: (row[4] as string) || '',
    description: (row[5] as string) || '',
    parentOldId: row[8] != null ? (row[8] as number) : null,
    imageUploadId,
    imageAlt,
    sortOrder: (row[11] as number) ?? 0,
    color: (row[12] as string) || '#FFFFFF',
  }
}

function mapTagRow(row: Row): TagRow {
  return {
    oldId: row[0] as number,
    label: (row[3] as string) || '',
    value: (row[4] as string) || '',
  }
}

function mapProductRow(row: Row): ProductRow {
  let gallery: Array<{ uploadId: number; alt: string }> = []
  if (row[17] && typeof row[17] === 'string' && row[17] !== '[]') {
    try {
      const raw = JSON.parse(row[17] as string) as Array<{ image?: { uploadId?: number; alt?: string }; alt?: string }>
      gallery = raw
        .filter(g => g.image?.uploadId != null)
        .map(g => ({ uploadId: g.image!.uploadId!, alt: g.alt || g.image?.alt || '' }))
    } catch { /* ignore */ }
  }

  let ecDeclaration: Array<{ url: string }> = []
  if (row[32] && typeof row[32] === 'string' && row[32] !== '[]') {
    try { ecDeclaration = JSON.parse(row[32] as string) } catch { /* ignore */ }
  }

  return {
    oldId: row[0] as number,
    slug: ((row[3] as string) || '').replace(/^\//, '') || slugify((row[6] as string) || ''),
    name: (row[6] as string) || '',
    description: (row[8] as string) || '',
    productCode: (row[15] as string) || '',
    subtitle: (row[16] as string) || '',
    gallery,
    ean: (row[18] as string) || '',
    categoryOldId: row[20] != null ? (row[20] as number) : null,
    price: (row[22] as number) ?? 0,
    currency: (row[23] as string) || 'EUR',
    instructionManual: (row[24] as string) || '',
    threeDModel: (row[26] as string) || '',
    dataSheet: (row[31] as string) || '',
    ecDeclaration,
  }
}

// ── Image upload ──────────────────────────────────────────────────────────────

const OLD_MEDIA_BASE = (process.env.OLD_CMS_MEDIA_BASE_URL || '').replace(/\/$/, '')

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

// ── Category URL builder ──────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Derive the CDN path segment for a category name.
 * The old CMS stripped "iNELS " prefixes and the word "wireless" from names.
 * e.g. "iNELS BUS" → "bus", "Switching wireless units" → "switching-units"
 */
function getCdnSlug(name: string): string {
  return slugify(
    name
      .replace(/^iNELS\s+/i, '')     // "iNELS BUS" → "BUS", "iNELS Wireless" → "Wireless"
      .replace(/\bwireless\s+/gi, '') // "Wireless dimmers" → "dimmers", "Switching wireless units" → "Switching units"
      .trim(),
  )
}

function buildCategoryImageUrls(
  catRow: CategoryRow,
  parentRow: CategoryRow | undefined,
): string[] {
  const catSlug = getCdnSlug(catRow.name)
  const parentSlug = parentRow ? getCdnSlug(parentRow.name) : null
  if (parentSlug) {
    return [
      `${OLD_MEDIA_BASE}/${parentSlug}/${catSlug}.png`,
      `${OLD_MEDIA_BASE}/${catSlug}.png`,
    ]
  }
  return [`${OLD_MEDIA_BASE}/${catSlug}.png`]
}

// ── Phase 2: Wipe existing data ──────────────────────────────────────────────

async function deleteAll(payload: Payload, collection: string): Promise<number> {
  let total = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = await payload.find({ collection: collection as any, limit: 100, depth: 0 })
    if (page.docs.length === 0) break
    for (const doc of page.docs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.delete({ collection: collection as any, id: doc.id })
      total++
    }
  }
  return total
}

async function wipeCollections(payload: Payload): Promise<void> {
  payload.logger.info('--- Wiping existing data ---')

  // Collect media IDs referenced by products and categories before deleting
  const products = await payload.find({ collection: 'products', limit: 10000, depth: 1 })
  const mediaIds = new Set<string>()
  for (const p of products.docs) {
    const gallery = (p as Record<string, unknown>).productGallery as Array<Record<string, unknown>> ?? []
    for (const g of gallery) {
      const img = g.image as Record<string, unknown> | string | null
      if (img) mediaIds.add(typeof img === 'object' ? String(img.id) : String(img))
    }
  }

  const cats = await payload.find({ collection: 'product-categories', limit: 10000, depth: 1 })
  for (const c of cats.docs) {
    const img = (c as Record<string, unknown>).image as Record<string, unknown> | string | null
    if (img) mediaIds.add(typeof img === 'object' ? String(img.id) : String(img))
  }

  const n1 = await deleteAll(payload, 'products')
  payload.logger.info(`  ✓ deleted ${n1} products`)

  const n2 = await deleteAll(payload, 'product-categories')
  payload.logger.info(`  ✓ deleted ${n2} product categories`)

  const n3 = await deleteAll(payload, 'product-tags')
  payload.logger.info(`  ✓ deleted ${n3} product tags`)

  let deletedMedia = 0
  for (const id of mediaIds) {
    try { await payload.delete({ collection: 'media', id }); deletedMedia++ } catch { /* ignore */ }
  }
  payload.logger.info(`  ✓ deleted ${deletedMedia} media files`)
}

// ── Phase 3 & 4: Seed categories ─────────────────────────────────────────────

async function seedCategories(
  payload: Payload,
  categories: CategoryRow[],
  mediaMap: Map<number, number | string>,
  failedImages: string[],
): Promise<Map<number, number | string>> {
  const catMap = new Map<number, number | string>() // oldId → newPayloadId
  const catById = new Map(categories.map(c => [c.oldId, c]))

  // Pass 1: roots
  for (const cat of categories.filter(c => c.parentOldId === null)) {
    await upsertCategory(payload, cat, null, catMap, catById, mediaMap, failedImages)
  }

  // Pass 2: children (depth 1)
  for (const cat of categories.filter(c => c.parentOldId !== null)) {
    const parentNewId = catMap.get(cat.parentOldId!) ?? null
    await upsertCategory(payload, cat, parentNewId, catMap, catById, mediaMap, failedImages)
  }

  return catMap
}

async function upsertCategory(
  payload: Payload,
  cat: CategoryRow,
  parentNewId: number | string | null,
  catMap: Map<number, number | string>,
  catById: Map<number, CategoryRow>,
  mediaMap: Map<number, number | string>,
  failedImages: string[],
): Promise<void> {
  const slug = cat.slug || slugify(cat.name)

  const existing = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    catMap.set(cat.oldId, existing.docs[0].id)
    payload.logger.info(`  [skip] category "${cat.name}" already exists`)
    return
  }

  // Upload image if present
  let imageId: number | string | null = null
  if (cat.imageUploadId !== null) {
    const parentRow = cat.parentOldId != null ? catById.get(cat.parentOldId) : undefined
    const urls = buildCategoryImageUrls(cat, parentRow)
    for (const url of urls) {
      const buf = await downloadImage(url)
      if (buf) {
        const ext = url.split('.').pop() || 'png'
        try {
          const media = await payload.create({
            collection: 'media',
            data: { alt: cat.imageAlt || cat.name },
            file: { data: buf, mimetype: `image/${ext}`, name: `cat-${cat.oldId}.${ext}`, size: buf.length },
          })
          imageId = media.id
          mediaMap.set(cat.imageUploadId, imageId)
          break
        } catch { /* ignore */ }
      }
    }
    if (!imageId) failedImages.push(`category "${cat.name}" uploadId=${cat.imageUploadId}`)
  }

  const data: Record<string, unknown> = {
    name: cat.name,
    slug,
    _status: 'published',
    description: cat.description || undefined,
    sortOrder: cat.sortOrder,
    color: cat.color,
    ...(parentNewId ? { parent: parentNewId } : {}),
    ...(imageId ? { image: imageId } : {}),
  }

  const created = await payload.create({ collection: 'product-categories', data })
  catMap.set(cat.oldId, created.id)
  payload.logger.info(`  ✓ category "${cat.name}" → ${created.id}`)
}

// ── Phase 5: Seed tags ────────────────────────────────────────────────────────

async function seedTags(
  payload: Payload,
  tags: TagRow[],
): Promise<Map<number, number | string>> {
  const tagMap = new Map<number, number | string>()

  for (const tag of tags) {
    const existing = await payload.find({
      collection: 'product-tags',
      where: { value: { equals: tag.value } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      tagMap.set(tag.oldId, existing.docs[0].id)
      payload.logger.info(`  [skip] tag "${tag.label}" already exists`)
      continue
    }

    const created = await payload.create({
      collection: 'product-tags',
      data: { label: tag.label, value: tag.value },
    })
    tagMap.set(tag.oldId, created.id)
    payload.logger.info(`  ✓ tag "${tag.label}" → ${created.id}`)
  }

  return tagMap
}

// ── Phase 6: Upload product images ───────────────────────────────────────────

/**
 * Build candidate CDN URLs for a product image.
 *
 * The old CMS always stored images at {root-slug}/{level-2-slug}/{product}.png,
 * regardless of how many levels deep the actual leaf category is.
 *   depth-2 product: root=parentRow, level2=catRow
 *   depth-3 product: root=grandparentRow, level2=parentRow (leaf catRow is ignored)
 */
function buildProductImageUrls(
  productSlug: string,
  catRow: CategoryRow | undefined,
  parentRow: CategoryRow | undefined,
  grandparentRow: CategoryRow | undefined,
): string[] {
  const urls: string[] = []

  let rootRow: CategoryRow | undefined
  let level2Row: CategoryRow | undefined

  if (grandparentRow) {
    rootRow = grandparentRow
    level2Row = parentRow
  } else if (parentRow) {
    rootRow = parentRow
    level2Row = catRow
  }

  if (rootRow && level2Row) {
    const rootSlug = getCdnSlug(rootRow.name)
    const catSlug = getCdnSlug(level2Row.name)
    urls.push(`${OLD_MEDIA_BASE}/${rootSlug}/${catSlug}/${productSlug}.png`)
    urls.push(`${OLD_MEDIA_BASE}/${rootSlug}/${catSlug}/${productSlug}.jpg`)
  }

  // Fallback: try with the leaf category directly
  if (catRow && rootRow && level2Row && catRow !== level2Row) {
    const rootSlug = getCdnSlug(rootRow.name)
    const leafSlug = getCdnSlug(catRow.name)
    urls.push(`${OLD_MEDIA_BASE}/${rootSlug}/${leafSlug}/${productSlug}.png`)
  }

  urls.push(`${OLD_MEDIA_BASE}/${productSlug}.png`)
  return urls
}

async function uploadProductImages(
  payload: Payload,
  products: ProductRow[],
  catRows: CategoryRow[],
  mediaMap: Map<number, number | string>,
  failedImages: string[],
): Promise<void> {
  const catById = new Map(catRows.map(c => [c.oldId, c]))

  // Collect all unique uploadIds across all product galleries
  const toUpload = new Map<number, { productSlug: string; catRow?: CategoryRow; parentRow?: CategoryRow; grandparentRow?: CategoryRow; alt: string }>()

  for (const product of products) {
    const catRow = product.categoryOldId != null ? catById.get(product.categoryOldId) : undefined
    const parentRow = catRow?.parentOldId != null ? catById.get(catRow.parentOldId) : undefined
    const grandparentRow = parentRow?.parentOldId != null ? catById.get(parentRow.parentOldId) : undefined
    for (const g of product.gallery) {
      if (!mediaMap.has(g.uploadId) && !toUpload.has(g.uploadId)) {
        toUpload.set(g.uploadId, { productSlug: product.slug, catRow, parentRow, grandparentRow, alt: g.alt })
      }
    }
  }

  payload.logger.info(`Uploading ${toUpload.size} unique product images...`)

  for (const [uploadId, info] of toUpload) {
    const urls = buildProductImageUrls(
      info.productSlug,
      info.catRow,
      info.parentRow,
      info.grandparentRow,
    )

    let uploaded = false
    for (const url of urls) {
      const buffer = await downloadImage(url)
      if (!buffer) continue
      try {
        const ext = url.split('.').pop() || 'png'
        const media = await payload.create({
          collection: 'media',
          data: { alt: info.alt },
          file: { data: buffer, mimetype: `image/${ext}`, name: `prod-${uploadId}.${ext}`, size: buffer.length },
        })
        mediaMap.set(uploadId, media.id)
        payload.logger.info(`  ✓ image uploadId=${uploadId} → ${media.id} (${url})`)
        uploaded = true
        break
      } catch (err) {
        payload.logger.warn(`  upload failed for ${url}: ${err}`)
      }
    }

    if (!uploaded) {
      failedImages.push(`uploadId=${uploadId} tried: ${urls.join(', ')}`)
      payload.logger.warn(`  ✗ image uploadId=${uploadId} not found at any URL`)
    }
  }
}

// ── Phase 7: Seed products ────────────────────────────────────────────────────

async function seedProducts(
  payload: Payload,
  products: ProductRow[],
  catMap: Map<number, number | string>,
  mediaMap: Map<number, number | string>,
  failedProducts: string[],
): Promise<{ created: number; skipped: number }> {
  let created = 0
  let skipped = 0

  for (const product of products) {
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: product.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        payload.logger.info(`  [skip] product "${product.slug}" already exists`)
        skipped++
        continue
      }

      const categoryId = product.categoryOldId != null
        ? catMap.get(product.categoryOldId) ?? null
        : null

      const productGallery = product.gallery
        .map(g => {
          const newId = mediaMap.get(g.uploadId)
          if (!newId) {
            payload.logger.warn(`  [gallery] product "${product.slug}" uploadId=${g.uploadId} NOT in mediaMap (map has ${mediaMap.size} entries)`)
            return null
          }
          return { image: newId, alt: g.alt }
        })
        .filter((g): g is { image: string; alt: string } => g !== null)

      if (product.gallery.length > 0) {
        payload.logger.info(`  [gallery] "${product.slug}": ${product.gallery.length} raw → ${productGallery.length} resolved`)
      }

      const ecDeclaration = product.ecDeclaration.length > 0
        ? product.ecDeclaration
        : undefined

      const data: Record<string, unknown> = {
        name: product.name,
        slug: product.slug,
        _status: 'published',
        subtitle: product.subtitle || undefined,
        description: htmlToLexical(product.description),
        productCode: product.productCode || undefined,
        ean: product.ean || undefined,
        price: product.price || undefined,
        currency: product.currency || undefined,
        instructionManual: product.instructionManual || undefined,
        threeDModel: product.threeDModel || undefined,
        dataSheet: product.dataSheet || undefined,
        ...(productGallery.length > 0 ? { productGallery } : {}),
        ...(ecDeclaration ? { ecDeclaration } : {}),
        ...(categoryId ? { category: categoryId } : {}),
      }

      const doc = await payload.create({ collection: 'products', data })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const savedGallery = (doc as any).productGallery
      const galleryNote = savedGallery?.length ? `gallery=${savedGallery.length}` : 'gallery=EMPTY'
      payload.logger.info(`  ✓ product "${product.slug}" → ${doc.id} (${galleryNote})`)
      created++
    } catch (err) {
      payload.logger.error(`  ✗ product "${product.slug}" FAILED: ${err}`)
      failedProducts.push(product.slug)
    }
  }

  return { created, skipped }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config })

  const wipe = process.argv.includes('--wipe')
  payload.logger.info(`=== Product migration starting${wipe ? ' (WIPE MODE)' : ''} ===`)

  if (wipe) {
    await wipeCollections(payload)
  }

  // Parse SQL
  const sqlPath = resolve(process.cwd(), 'product-data.sql')
  const sql = readFileSync(sqlPath, 'utf-8')
  const catRows = parseSqlInserts(sql, 'product_categories').map(mapCategoryRow)
  const tagRows = parseSqlInserts(sql, 'product_tags').map(mapTagRow)
  const productRows = parseSqlInserts(sql, 'products').map(mapProductRow)

  payload.logger.info(`Parsed: ${catRows.length} categories, ${tagRows.length} tags, ${productRows.length} products`)

  const mediaMap = new Map<number, number | string>()  // oldUploadId → newMediaId
  const failedImages: string[] = []
  const failedProducts: string[] = []

  // Phase 3 & 4: Seed categories
  payload.logger.info('--- Seeding categories ---')
  const catMap = await seedCategories(payload, catRows, mediaMap, failedImages)

  // Phase 5: Seed tags
  payload.logger.info('--- Seeding tags ---')
  const tagMap = await seedTags(payload, tagRows)

  // Phase 6: Upload product images
  payload.logger.info('--- Uploading product images ---')
  await uploadProductImages(payload, productRows, catRows, mediaMap, failedImages)

  payload.logger.info(`  mediaMap has ${mediaMap.size} entries after image upload phase`)

  // Phase 7: Seed products
  payload.logger.info('--- Seeding products ---')
  const { created: createdProducts, skipped: skippedProducts } =
    await seedProducts(payload, productRows, catMap, mediaMap, failedProducts)

  // ── Summary ──────────────────────────────────────────────────────────────────
  payload.logger.info('')
  payload.logger.info('════════════════════════════════')
  payload.logger.info('  Migration Summary')
  payload.logger.info('════════════════════════════════')
  payload.logger.info(`  Categories : ${catMap.size}/${catRows.length}`)
  payload.logger.info(`  Tags       : ${tagMap.size}/${tagRows.length}`)
  payload.logger.info(`  Products   : ${createdProducts} created, ${skippedProducts} skipped, ${failedProducts.length} failed`)
  payload.logger.info(`  Images     : ${mediaMap.size} uploaded, ${failedImages.length} failed`)
  if (failedProducts.length > 0) {
    payload.logger.info('  Failed products:')
    for (const slug of failedProducts) payload.logger.info(`    - ${slug}`)
  }
  if (failedImages.length > 0) {
    payload.logger.info('  Failed images:')
    for (const img of failedImages) payload.logger.info(`    - ${img}`)
  }
  payload.logger.info('════════════════════════════════')

  process.exit(0)
}

await main().catch(err => { console.error(err); process.exit(1) })
