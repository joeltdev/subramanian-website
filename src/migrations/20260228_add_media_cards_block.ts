import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ── 1. Undo FeatureCards media variant ──────────────────────────────────

    DROP INDEX IF EXISTS "pages_blocks_feature_cards_items_media_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_feature_cards_items_media_idx";

    ALTER TABLE "pages_blocks_feature_cards_items"
      DROP CONSTRAINT IF EXISTS "pages_blocks_feature_cards_items_media_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_feature_cards_items_media_id_media_id_fk";

    ALTER TABLE "pages_blocks_feature_cards_items" DROP COLUMN IF EXISTS "media_id";
    ALTER TABLE "_pages_v_blocks_feature_cards_items" DROP COLUMN IF EXISTS "media_id";

    -- Recreate live variant enum without 'media'
    CREATE TYPE "public"."enum_pages_blocks_feature_cards_variant_prev" AS ENUM('floating', 'outlined', 'grid');
    ALTER TABLE "pages_blocks_feature_cards" ALTER COLUMN "variant" DROP DEFAULT;
    ALTER TABLE "pages_blocks_feature_cards"
      ALTER COLUMN "variant"
      TYPE "public"."enum_pages_blocks_feature_cards_variant_prev"
      USING (CASE WHEN "variant"::text = 'media' THEN 'floating' ELSE "variant"::text END)::"public"."enum_pages_blocks_feature_cards_variant_prev";
    DROP TYPE "public"."enum_pages_blocks_feature_cards_variant";
    ALTER TYPE "public"."enum_pages_blocks_feature_cards_variant_prev"
      RENAME TO "enum_pages_blocks_feature_cards_variant";
    ALTER TABLE "pages_blocks_feature_cards"
      ALTER COLUMN "variant" SET DEFAULT 'floating'::"public"."enum_pages_blocks_feature_cards_variant";

    -- Recreate versioned variant enum without 'media'
    CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev" AS ENUM('floating', 'outlined', 'grid');
    ALTER TABLE "_pages_v_blocks_feature_cards" ALTER COLUMN "variant" DROP DEFAULT;
    ALTER TABLE "_pages_v_blocks_feature_cards"
      ALTER COLUMN "variant"
      TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev"
      USING (CASE WHEN "variant"::text = 'media' THEN 'floating' ELSE "variant"::text END)::"public"."enum__pages_v_blocks_feature_cards_variant_prev";
    DROP TYPE "public"."enum__pages_v_blocks_feature_cards_variant";
    ALTER TYPE "public"."enum__pages_v_blocks_feature_cards_variant_prev"
      RENAME TO "enum__pages_v_blocks_feature_cards_variant";
    ALTER TABLE "_pages_v_blocks_feature_cards"
      ALTER COLUMN "variant" SET DEFAULT 'floating'::"public"."enum__pages_v_blocks_feature_cards_variant";

    -- ── 2. Create MediaCards block tables ───────────────────────────────────

    CREATE TYPE "public"."enum_pages_blocks_media_cards_items_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_media_cards_items_link_type" AS ENUM('reference', 'custom');

    -- Items sub-table (live)
    CREATE TABLE "pages_blocks_media_cards_items" (
      "_order"       integer  NOT NULL,
      "_parent_id"   varchar  NOT NULL,
      "id"           varchar  PRIMARY KEY NOT NULL,
      "media_id"     integer,
      "rich_text"    jsonb,
      "link_type"    "public"."enum_pages_blocks_media_cards_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar
    );

    -- Block table (live)
    CREATE TABLE "pages_blocks_media_cards" (
      "_order"       integer  NOT NULL,
      "_parent_id"   integer  NOT NULL,
      "_path"        text     NOT NULL,
      "id"           varchar  PRIMARY KEY NOT NULL,
      "intro"        jsonb,
      "block_name"   varchar
    );

    -- Items sub-table (versioned)
    CREATE TABLE "_pages_v_blocks_media_cards_items" (
      "_order"       integer  NOT NULL,
      "_parent_id"   integer  NOT NULL,
      "id"           serial   PRIMARY KEY NOT NULL,
      "_uuid"        varchar,
      "media_id"     integer,
      "rich_text"    jsonb,
      "link_type"    "public"."enum__pages_v_blocks_media_cards_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar
    );

    -- Block table (versioned)
    CREATE TABLE "_pages_v_blocks_media_cards" (
      "_order"       integer  NOT NULL,
      "_parent_id"   integer  NOT NULL,
      "_path"        text     NOT NULL,
      "id"           serial   PRIMARY KEY NOT NULL,
      "intro"        jsonb,
      "_uuid"        varchar,
      "block_name"   varchar
    );

    -- FKs (live)
    ALTER TABLE "pages_blocks_media_cards_items"
      ADD CONSTRAINT "pages_blocks_media_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_media_cards_items"
      ADD CONSTRAINT "pages_blocks_media_cards_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_cards"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_media_cards"
      ADD CONSTRAINT "pages_blocks_media_cards_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

    -- FKs (versioned)
    ALTER TABLE "_pages_v_blocks_media_cards_items"
      ADD CONSTRAINT "_pages_v_blocks_media_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_media_cards_items"
      ADD CONSTRAINT "_pages_v_blocks_media_cards_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_cards"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_media_cards"
      ADD CONSTRAINT "_pages_v_blocks_media_cards_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

    -- Indexes (live items)
    CREATE INDEX "pages_blocks_media_cards_items_order_idx" ON "pages_blocks_media_cards_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_media_cards_items_parent_id_idx" ON "pages_blocks_media_cards_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_media_cards_items_media_idx" ON "pages_blocks_media_cards_items" USING btree ("media_id");

    -- Indexes (live block)
    CREATE INDEX "pages_blocks_media_cards_order_idx" ON "pages_blocks_media_cards" USING btree ("_order");
    CREATE INDEX "pages_blocks_media_cards_parent_id_idx" ON "pages_blocks_media_cards" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_media_cards_path_idx" ON "pages_blocks_media_cards" USING btree ("_path");

    -- Indexes (versioned items)
    CREATE INDEX "_pages_v_blocks_media_cards_items_order_idx" ON "_pages_v_blocks_media_cards_items" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_media_cards_items_parent_id_idx" ON "_pages_v_blocks_media_cards_items" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_media_cards_items_media_idx" ON "_pages_v_blocks_media_cards_items" USING btree ("media_id");

    -- Indexes (versioned block)
    CREATE INDEX "_pages_v_blocks_media_cards_order_idx" ON "_pages_v_blocks_media_cards" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_media_cards_parent_id_idx" ON "_pages_v_blocks_media_cards" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_media_cards_path_idx" ON "_pages_v_blocks_media_cards" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_media_cards_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_media_cards" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_media_cards_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_media_cards" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_media_cards_items_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_media_cards_items_link_type";

    -- Re-add 'media' to FeatureCards variant enum (live)
    ALTER TYPE "public"."enum_pages_blocks_feature_cards_variant" ADD VALUE IF NOT EXISTS 'media';
    ALTER TYPE "public"."enum__pages_v_blocks_feature_cards_variant" ADD VALUE IF NOT EXISTS 'media';

    -- Re-add media_id to feature_cards_items (live)
    ALTER TABLE "pages_blocks_feature_cards_items" ADD COLUMN IF NOT EXISTS "media_id" integer;
    ALTER TABLE "pages_blocks_feature_cards_items"
      ADD CONSTRAINT "pages_blocks_feature_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "pages_blocks_feature_cards_items_media_idx"
      ON "pages_blocks_feature_cards_items" USING btree ("media_id");

    -- Re-add media_id to feature_cards_items (versioned)
    ALTER TABLE "_pages_v_blocks_feature_cards_items" ADD COLUMN IF NOT EXISTS "media_id" integer;
    ALTER TABLE "_pages_v_blocks_feature_cards_items"
      ADD CONSTRAINT "_pages_v_blocks_feature_cards_items_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_feature_cards_items_media_idx"
      ON "_pages_v_blocks_feature_cards_items" USING btree ("media_id");
  `)
}
