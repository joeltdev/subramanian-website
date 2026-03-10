import fs from 'fs'
import path from 'path'

/**
 * Normalizes filenames for Payload:
 * - Lowercase everything
 * - Replace spaces/special chars with hyphens
 * - Remove redundant dots
 */
function normalizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase()
  const base = path.basename(name, ext)
  
  const cleanBase = base
    .toLowerCase()
    .normalize('NFD') // Remove accents/diacritics
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-|-$/g, '')       // Trim leading/trailing hyphens
    
  return `${cleanBase}${ext}`
}

/**
 * Recursively gets all files in a directory
 */
function walkSync(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  })
  return fileList
}

async function prepareMedia() {
  const sourceDir = process.env.OLD_MEDIA_PATH || '/var/www/old-site/public/img'
  const targetDir = process.env.NEW_MEDIA_STAGING || '/var/www/payload-media-staging'

  console.log(`📂 Scanning Source: ${sourceDir}`)
  console.log(`🎯 Staging Target: ${targetDir}`)
  
  if (!fs.existsSync(sourceDir)) {
    console.error('❌ Source directory does not exist')
    process.exit(1)
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const allFiles = walkSync(sourceDir)
  console.log(`🔍 Found ${allFiles.length} files in total. Starting normalization...`)

  let copied = 0
  let skipped = 0
  let collisions = 0

  for (const sourcePath of allFiles) {
    const filename = path.basename(sourcePath)
    
    // Only process images
    if (!/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(filename)) continue

    const normalizedName = normalizeFilename(filename)
    const targetPath = path.join(targetDir, normalizedName)

    if (fs.existsSync(targetPath)) {
      // If the file already exists in staging, we check if it's the exact same file size
      // to avoid redundant work, otherwise we log a collision.
      const sourceStat = fs.statSync(sourcePath)
      const targetStat = fs.statSync(targetPath)
      
      if (sourceStat.size === targetStat.size) {
        skipped++
        continue
      } else {
        console.warn(`  ⚠️ Collision: ${normalizedName} already exists but size differs. Skipping ${sourcePath}`)
        collisions++
        continue
      }
    }

    fs.copyFileSync(sourcePath, targetPath)
    copied++
    if (copied % 50 === 0) console.log(`  Processed ${copied} images...`)
  }

  console.log(`\n✅ Normalization Complete!`)
  console.log(`════════════════════════════════`)
  console.log(`  Total files scanned: ${allFiles.length}`)
  console.log(`  Newly Normalized   : ${copied}`)
  console.log(`  Already in staging : ${skipped}`)
  console.log(`  Collisions skipped : ${collisions}`)
  console.log(`════════════════════════════════`)
  console.log(`Target folder is ready: ${targetDir}`)
}

prepareMedia().catch(console.error)
