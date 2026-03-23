import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Add missing reference columns to pages_blocks_manifesto_promo
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_manifesto_promo" ADD COLUMN "cta_reference_id" integer;
    ALTER TABLE "pages_blocks_manifesto_promo" ADD COLUMN "cta_reference_rel" varchar;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END $$;

  -- Add missing reference columns to _pages_v_blocks_manifesto_promo
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD COLUMN "cta_reference_id" integer;
    ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD COLUMN "cta_reference_rel" varchar;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END $$;

  -- Fix missing columns in tharoor_manifesto links if they were missed by the manual fix
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_tharoor_manifesto_manifesto_links" ADD COLUMN "link_reference_id" integer;
    ALTER TABLE "pages_blocks_tharoor_manifesto_manifesto_links" ADD COLUMN "link_reference_rel" varchar;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_tharoor_manifesto_manifesto_links" ADD COLUMN "link_reference_id" integer;
    ALTER TABLE "_pages_v_blocks_tharoor_manifesto_manifesto_links" ADD COLUMN "link_reference_rel" varchar;
  EXCEPTION
    WHEN duplicate_column THEN null;
  END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_manifesto_promo" DROP COLUMN IF EXISTS "cta_reference_id";
  ALTER TABLE "pages_blocks_manifesto_promo" DROP COLUMN IF EXISTS "cta_reference_rel";
  ALTER TABLE "_pages_v_blocks_manifesto_promo" DROP COLUMN IF EXISTS "cta_reference_id";
  ALTER TABLE "_pages_v_blocks_manifesto_promo" DROP COLUMN IF EXISTS "cta_reference_rel";
  ALTER TABLE "pages_blocks_tharoor_manifesto_manifesto_links" DROP COLUMN IF EXISTS "link_reference_id";
  ALTER TABLE "pages_blocks_tharoor_manifesto_manifesto_links" DROP COLUMN IF EXISTS "link_reference_rel";
  ALTER TABLE "_pages_v_blocks_tharoor_manifesto_manifesto_links" DROP COLUMN IF EXISTS "link_reference_id";
  ALTER TABLE "_pages_v_blocks_tharoor_manifesto_manifesto_links" DROP COLUMN IF EXISTS "link_reference_rel";
  `)
}
