import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ── Enum types ─────────────────────────────────────────────────────────

    CREATE TYPE "public"."enum_pages_blocks_gallery_type"
      AS ENUM('scrollable', 'parallax', 'apple');
    CREATE TYPE "public"."enum__pages_v_blocks_gallery_type"
      AS ENUM('scrollable', 'parallax', 'apple');

    CREATE TYPE "public"."enum_pages_blocks_gallery_cta_link_type"
      AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_gallery_cta_link_type"
      AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_gallery_cta_link_appearance"
      AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_gallery_cta_link_appearance"
      AS ENUM('default', 'outline');

    CREATE TYPE "public"."enum_pages_blocks_gallery_gallery_items_link_type"
      AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_gallery_gallery_items_link_type"
      AS ENUM('reference', 'custom');

    CREATE TYPE "public"."enum_pages_blocks_gallery_slides_link_type"
      AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_gallery_slides_link_type"
      AS ENUM('reference', 'custom');

    -- ── Live sub-tables (arrays) ────────────────────────────────────────────

    CREATE TABLE "pages_blocks_gallery_cta" (
      "_order"          integer  NOT NULL,
      "_parent_id"      varchar  NOT NULL,
      "id"              varchar  PRIMARY KEY NOT NULL,
      "link_type"       "public"."enum_pages_blocks_gallery_cta_link_type" DEFAULT 'reference',
      "link_new_tab"    boolean,
      "link_url"        varchar,
      "link_label"      varchar,
      "link_appearance" "public"."enum_pages_blocks_gallery_cta_link_appearance" DEFAULT 'default'
    );

    CREATE TABLE "pages_blocks_gallery_gallery_items" (
      "_order"       integer  NOT NULL,
      "_parent_id"   varchar  NOT NULL,
      "id"           varchar  PRIMARY KEY NOT NULL,
      "image_id"     integer,
      "rich_text"    jsonb,
      "link_type"    "public"."enum_pages_blocks_gallery_gallery_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar,
      "link_label"   varchar
    );

    CREATE TABLE "pages_blocks_gallery_slides" (
      "_order"       integer  NOT NULL,
      "_parent_id"   varchar  NOT NULL,
      "id"           varchar  PRIMARY KEY NOT NULL,
      "image_id"     integer,
      "title"        varchar,
      "link_type"    "public"."enum_pages_blocks_gallery_slides_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar,
      "link_label"   varchar
    );

    CREATE TABLE "pages_blocks_gallery_apple_items" (
      "_order"           integer  NOT NULL,
      "_parent_id"       varchar  NOT NULL,
      "id"               varchar  PRIMARY KEY NOT NULL,
      "image_id"         integer,
      "category"         varchar,
      "title"            varchar,
      "expanded_content" jsonb
    );

    -- ── Live block table ────────────────────────────────────────────────────

    CREATE TABLE "pages_blocks_gallery" (
      "_order"     integer  NOT NULL,
      "_parent_id" integer  NOT NULL,
      "_path"      text     NOT NULL,
      "id"         varchar  PRIMARY KEY NOT NULL,
      "type"       "public"."enum_pages_blocks_gallery_type" DEFAULT 'scrollable',
      "intro"      jsonb,
      "block_name" varchar
    );

    -- ── Versioned sub-tables ────────────────────────────────────────────────

    CREATE TABLE "_pages_v_blocks_gallery_cta" (
      "_order"          integer  NOT NULL,
      "_parent_id"      integer  NOT NULL,
      "id"              serial   PRIMARY KEY NOT NULL,
      "link_type"       "public"."enum__pages_v_blocks_gallery_cta_link_type" DEFAULT 'reference',
      "link_new_tab"    boolean,
      "link_url"        varchar,
      "link_label"      varchar,
      "link_appearance" "public"."enum__pages_v_blocks_gallery_cta_link_appearance" DEFAULT 'default',
      "_uuid"           varchar
    );

    CREATE TABLE "_pages_v_blocks_gallery_gallery_items" (
      "_order"       integer  NOT NULL,
      "_parent_id"   integer  NOT NULL,
      "id"           serial   PRIMARY KEY NOT NULL,
      "image_id"     integer,
      "rich_text"    jsonb,
      "link_type"    "public"."enum__pages_v_blocks_gallery_gallery_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar,
      "link_label"   varchar,
      "_uuid"        varchar
    );

    CREATE TABLE "_pages_v_blocks_gallery_slides" (
      "_order"       integer  NOT NULL,
      "_parent_id"   integer  NOT NULL,
      "id"           serial   PRIMARY KEY NOT NULL,
      "image_id"     integer,
      "title"        varchar,
      "link_type"    "public"."enum__pages_v_blocks_gallery_slides_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url"     varchar,
      "link_label"   varchar,
      "_uuid"        varchar
    );

    CREATE TABLE "_pages_v_blocks_gallery_apple_items" (
      "_order"           integer  NOT NULL,
      "_parent_id"       integer  NOT NULL,
      "id"               serial   PRIMARY KEY NOT NULL,
      "image_id"         integer,
      "category"         varchar,
      "title"            varchar,
      "expanded_content" jsonb,
      "_uuid"            varchar
    );

    -- ── Versioned block table ───────────────────────────────────────────────

    CREATE TABLE "_pages_v_blocks_gallery" (
      "_order"     integer  NOT NULL,
      "_parent_id" integer  NOT NULL,
      "_path"      text     NOT NULL,
      "id"         serial   PRIMARY KEY NOT NULL,
      "type"       "public"."enum__pages_v_blocks_gallery_type" DEFAULT 'scrollable',
      "intro"      jsonb,
      "_uuid"      varchar,
      "block_name" varchar
    );

    -- ── Foreign keys (live) ─────────────────────────────────────────────────

    ALTER TABLE "pages_blocks_gallery_cta"
      ADD CONSTRAINT "pages_blocks_gallery_cta_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_gallery_items"
      ADD CONSTRAINT "pages_blocks_gallery_gallery_items_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_gallery_items"
      ADD CONSTRAINT "pages_blocks_gallery_gallery_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_slides"
      ADD CONSTRAINT "pages_blocks_gallery_slides_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_slides"
      ADD CONSTRAINT "pages_blocks_gallery_slides_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_apple_items"
      ADD CONSTRAINT "pages_blocks_gallery_apple_items_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery_apple_items"
      ADD CONSTRAINT "pages_blocks_gallery_apple_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_gallery"
      ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- ── Foreign keys (versioned) ────────────────────────────────────────────

    ALTER TABLE "_pages_v_blocks_gallery_cta"
      ADD CONSTRAINT "_pages_v_blocks_gallery_cta_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_gallery_items"
      ADD CONSTRAINT "_pages_v_blocks_gallery_gallery_items_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_gallery_items"
      ADD CONSTRAINT "_pages_v_blocks_gallery_gallery_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_slides"
      ADD CONSTRAINT "_pages_v_blocks_gallery_slides_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_slides"
      ADD CONSTRAINT "_pages_v_blocks_gallery_slides_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_apple_items"
      ADD CONSTRAINT "_pages_v_blocks_gallery_apple_items_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery_apple_items"
      ADD CONSTRAINT "_pages_v_blocks_gallery_apple_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_gallery"
      ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- ── Indexes (live sub-tables) ───────────────────────────────────────────

    CREATE INDEX "pages_blocks_gallery_cta_order_idx"
      ON "pages_blocks_gallery_cta" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_cta_parent_id_idx"
      ON "pages_blocks_gallery_cta" USING btree ("_parent_id");

    CREATE INDEX "pages_blocks_gallery_gallery_items_order_idx"
      ON "pages_blocks_gallery_gallery_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_gallery_items_parent_id_idx"
      ON "pages_blocks_gallery_gallery_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_gallery_items_image_idx"
      ON "pages_blocks_gallery_gallery_items" USING btree ("image_id");

    CREATE INDEX "pages_blocks_gallery_slides_order_idx"
      ON "pages_blocks_gallery_slides" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_slides_parent_id_idx"
      ON "pages_blocks_gallery_slides" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_slides_image_idx"
      ON "pages_blocks_gallery_slides" USING btree ("image_id");

    CREATE INDEX "pages_blocks_gallery_apple_items_order_idx"
      ON "pages_blocks_gallery_apple_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_apple_items_parent_id_idx"
      ON "pages_blocks_gallery_apple_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_apple_items_image_idx"
      ON "pages_blocks_gallery_apple_items" USING btree ("image_id");

    -- ── Indexes (live block) ────────────────────────────────────────────────

    CREATE INDEX "pages_blocks_gallery_order_idx"
      ON "pages_blocks_gallery" USING btree ("_order");
    CREATE INDEX "pages_blocks_gallery_parent_id_idx"
      ON "pages_blocks_gallery" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_gallery_path_idx"
      ON "pages_blocks_gallery" USING btree ("_path");

    -- ── Indexes (versioned sub-tables) ─────────────────────────────────────

    CREATE INDEX "_pages_v_blocks_gallery_cta_order_idx"
      ON "_pages_v_blocks_gallery_cta" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_gallery_cta_parent_id_idx"
      ON "_pages_v_blocks_gallery_cta" USING btree ("_parent_id");

    CREATE INDEX "_pages_v_blocks_gallery_gallery_items_order_idx"
      ON "_pages_v_blocks_gallery_gallery_items" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_gallery_gallery_items_parent_id_idx"
      ON "_pages_v_blocks_gallery_gallery_items" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_gallery_gallery_items_image_idx"
      ON "_pages_v_blocks_gallery_gallery_items" USING btree ("image_id");

    CREATE INDEX "_pages_v_blocks_gallery_slides_order_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_gallery_slides_parent_id_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_gallery_slides_image_idx"
      ON "_pages_v_blocks_gallery_slides" USING btree ("image_id");

    CREATE INDEX "_pages_v_blocks_gallery_apple_items_order_idx"
      ON "_pages_v_blocks_gallery_apple_items" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_gallery_apple_items_parent_id_idx"
      ON "_pages_v_blocks_gallery_apple_items" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_gallery_apple_items_image_idx"
      ON "_pages_v_blocks_gallery_apple_items" USING btree ("image_id");

    -- ── Indexes (versioned block) ───────────────────────────────────────────

    CREATE INDEX "_pages_v_blocks_gallery_order_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_gallery_path_idx"
      ON "_pages_v_blocks_gallery" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Drop sub-tables first (FK deps on block table)
    DROP TABLE IF EXISTS "pages_blocks_gallery_cta" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_gallery_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_slides" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_apple_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery" CASCADE;

    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_cta" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_gallery_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_slides" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_apple_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery" CASCADE;

    -- Drop enum types
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_cta_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_cta_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_cta_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_gallery_items_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_gallery_items_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_slides_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_slides_link_type";
  `)
}
