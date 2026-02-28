import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add 'media' to the variant enums (live + versioned)
    ALTER TYPE "public"."enum_pages_blocks_feature_cards_variant"
      ADD VALUE IF NOT EXISTS 'media';

    ALTER TYPE "public"."enum__pages_v_blocks_feature_cards_variant"
      ADD VALUE IF NOT EXISTS 'media';

    -- Add media_id to the items sub-table (live)
    ALTER TABLE "pages_blocks_feature_cards_items"
      ADD COLUMN IF NOT EXISTS "media_id" integer;

    ALTER TABLE "pages_blocks_feature_cards_items"
      ADD CONSTRAINT "pages_blocks_feature_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "pages_blocks_feature_cards_items_media_idx"
      ON "pages_blocks_feature_cards_items" USING btree ("media_id");

    -- Add media_id to the items sub-table (versioned)
    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      ADD COLUMN IF NOT EXISTS "media_id" integer;

    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      ADD CONSTRAINT "_pages_v_blocks_feature_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_cards_items_media_idx"
      ON "_pages_v_blocks_feature_cards_items" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Drop indexes
    DROP INDEX IF EXISTS "pages_blocks_feature_cards_items_media_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_feature_cards_items_media_idx";

    -- Drop FK constraints
    ALTER TABLE "pages_blocks_feature_cards_items"
      DROP CONSTRAINT IF EXISTS "pages_blocks_feature_cards_items_media_id_media_id_fk";

    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_feature_cards_items_media_id_media_id_fk";

    -- Drop columns
    ALTER TABLE "pages_blocks_feature_cards_items"
      DROP COLUMN IF EXISTS "media_id";

    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      DROP COLUMN IF EXISTS "media_id";

    -- Recreate variant enum without 'media' (live)
    -- Postgres cannot remove enum values directly, so we recreate the type
    CREATE TYPE "public"."enum_pages_blocks_feature_cards_variant_prev"
      AS ENUM('floating', 'outlined', 'grid');

    ALTER TABLE "pages_blocks_feature_cards"
      ALTER COLUMN "variant"
      TYPE "public"."enum_pages_blocks_feature_cards_variant_prev"
      USING (
        CASE WHEN "variant"::text = 'media' THEN 'floating'
        ELSE "variant"::text
        END
      )::"public"."enum_pages_blocks_feature_cards_variant_prev";

    DROP TYPE "public"."enum_pages_blocks_feature_cards_variant";

    ALTER TYPE "public"."enum_pages_blocks_feature_cards_variant_prev"
      RENAME TO "enum_pages_blocks_feature_cards_variant";

    -- Recreate variant enum without 'media' (versioned)
    CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev"
      AS ENUM('floating', 'outlined', 'grid');

    ALTER TABLE "_pages_v_blocks_feature_cards"
      ALTER COLUMN "variant"
      TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev"
      USING (
        CASE WHEN "variant"::text = 'media' THEN 'floating'
        ELSE "variant"::text
        END
      )::"public"."enum__pages_v_blocks_feature_cards_variant_prev";

    DROP TYPE "public"."enum__pages_v_blocks_feature_cards_variant";

    ALTER TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev"
      RENAME TO "enum__pages_v_blocks_feature_cards_variant";
  `)
}
