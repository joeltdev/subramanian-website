import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. DROP GHOST TABLES
    DROP TABLE IF EXISTS "_pages_v__blocks_posterBento_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v__blocks_posterBento" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_posterBento_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_posterBento" CASCADE;

    DROP TABLE IF EXISTS "_pages_v_blocks_poster_bento_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_poster_bento" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_poster_bento_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_poster_bento" CASCADE;

    -- 2. FIX GALLERY ENUM TYPES
    -- Note: We drop and recreate because current state might be inconsistent
    DO $$
    BEGIN
      -- Handle Enum for main table
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_gallery_variant') THEN
        ALTER TABLE pages_blocks_gallery ALTER COLUMN variant DROP DEFAULT;
        ALTER TABLE pages_blocks_gallery ALTER COLUMN variant TYPE text;
        DROP TYPE "public"."enum_pages_blocks_gallery_variant";
      END IF;
      CREATE TYPE "public"."enum_pages_blocks_gallery_variant" AS ENUM('grid', 'masonry');
      
      -- Handle Enum for version table
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_blocks_gallery_variant') THEN
        ALTER TABLE _pages_v_blocks_gallery ALTER COLUMN variant DROP DEFAULT;
        ALTER TABLE _pages_v_blocks_gallery ALTER COLUMN variant TYPE text;
        DROP TYPE "public"."enum__pages_v_blocks_gallery_variant";
      END IF;
      CREATE TYPE "public"."enum__pages_v_blocks_gallery_variant" AS ENUM('grid', 'masonry');
    END
    $$;

    -- 3. SYNC TABLES
    -- Ensure columns exist with correct types
    DO $$
    BEGIN
      -- pages_blocks_gallery
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pages_blocks_gallery' AND column_name='variant') THEN
        ALTER TABLE "pages_blocks_gallery" ADD COLUMN "variant" "enum_pages_blocks_gallery_variant" DEFAULT 'grid';
      ELSE
        ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "variant" TYPE "enum_pages_blocks_gallery_variant" USING 'grid'::"enum_pages_blocks_gallery_variant";
        ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'grid';
      END IF;

      -- _pages_v_blocks_gallery
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_pages_v_blocks_gallery' AND column_name='variant') THEN
        ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "variant" "enum__pages_v_blocks_gallery_variant" DEFAULT 'grid';
      ELSE
        ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "variant" TYPE "enum__pages_v_blocks_gallery_variant" USING 'grid'::"enum__pages_v_blocks_gallery_variant";
        ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'grid';
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Cleanup migration, no down needed
}
