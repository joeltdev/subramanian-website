import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ── Enum types ─────────────────────────────────────────────────────────

    CREATE TYPE "public"."enum_pages_blocks_parallax_showcase_slides_link_type"
      AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_parallax_showcase_slides_link_type"
      AS ENUM('reference', 'custom');

    -- ── Live sub-table: slides ──────────────────────────────────────────────

    CREATE TABLE "pages_blocks_parallax_showcase_slides" (
      "_order"              integer  NOT NULL,
      "_parent_id"          varchar  NOT NULL,
      "id"                  varchar  PRIMARY KEY NOT NULL,
      "name"                varchar,
      "content"             jsonb,
      "background_image_id" integer,
      "foreground_image_id" integer,
      "link_type"           "public"."enum_pages_blocks_parallax_showcase_slides_link_type" DEFAULT 'reference',
      "link_new_tab"        boolean,
      "link_url"            varchar,
      "link_label"          varchar
    );

    -- ── Live block table ────────────────────────────────────────────────────

    CREATE TABLE "pages_blocks_parallax_showcase" (
      "_order"              integer  NOT NULL,
      "_parent_id"          integer  NOT NULL,
      "_path"               text     NOT NULL,
      "id"                  varchar  PRIMARY KEY NOT NULL,
      "intro"               jsonb,
      "auto_scroll_interval" numeric,
      "block_name"          varchar
    );

    -- ── Versioned sub-table: slides ─────────────────────────────────────────

    CREATE TABLE "_pages_v_blocks_parallax_showcase_slides" (
      "_order"              integer  NOT NULL,
      "_parent_id"          integer  NOT NULL,
      "id"                  serial   PRIMARY KEY NOT NULL,
      "name"                varchar,
      "content"             jsonb,
      "background_image_id" integer,
      "foreground_image_id" integer,
      "link_type"           "public"."enum__pages_v_blocks_parallax_showcase_slides_link_type" DEFAULT 'reference',
      "link_new_tab"        boolean,
      "link_url"            varchar,
      "link_label"          varchar,
      "_uuid"               varchar
    );

    -- ── Versioned block table ───────────────────────────────────────────────

    CREATE TABLE "_pages_v_blocks_parallax_showcase" (
      "_order"              integer  NOT NULL,
      "_parent_id"          integer  NOT NULL,
      "_path"               text     NOT NULL,
      "id"                  serial   PRIMARY KEY NOT NULL,
      "intro"               jsonb,
      "auto_scroll_interval" numeric,
      "_uuid"               varchar,
      "block_name"          varchar
    );

    -- ── Foreign keys (live) ─────────────────────────────────────────────────

    ALTER TABLE "pages_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "pages_blocks_parallax_showcase_slides_background_image_id_media_id_fk"
      FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "pages_blocks_parallax_showcase_slides_foreground_image_id_media_id_fk"
      FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "pages_blocks_parallax_showcase_slides_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_parallax_showcase"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_parallax_showcase"
      ADD CONSTRAINT "pages_blocks_parallax_showcase_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- ── Foreign keys (versioned) ────────────────────────────────────────────

    ALTER TABLE "_pages_v_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "_pages_v_blocks_parallax_showcase_slides_background_image_id_media_id_fk"
      FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "_pages_v_blocks_parallax_showcase_slides_foreground_image_id_media_id_fk"
      FOREIGN KEY ("foreground_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_parallax_showcase_slides"
      ADD CONSTRAINT "_pages_v_blocks_parallax_showcase_slides_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_parallax_showcase"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_parallax_showcase"
      ADD CONSTRAINT "_pages_v_blocks_parallax_showcase_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- ── Indexes (live) ──────────────────────────────────────────────────────

    CREATE INDEX "pages_blocks_parallax_showcase_slides_order_idx"
      ON "pages_blocks_parallax_showcase_slides" USING btree ("_order");
    CREATE INDEX "pages_blocks_parallax_showcase_slides_parent_id_idx"
      ON "pages_blocks_parallax_showcase_slides" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_parallax_showcase_slides_background_image_idx"
      ON "pages_blocks_parallax_showcase_slides" USING btree ("background_image_id");
    CREATE INDEX "pages_blocks_parallax_showcase_slides_foreground_image_idx"
      ON "pages_blocks_parallax_showcase_slides" USING btree ("foreground_image_id");

    CREATE INDEX "pages_blocks_parallax_showcase_order_idx"
      ON "pages_blocks_parallax_showcase" USING btree ("_order");
    CREATE INDEX "pages_blocks_parallax_showcase_parent_id_idx"
      ON "pages_blocks_parallax_showcase" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_parallax_showcase_path_idx"
      ON "pages_blocks_parallax_showcase" USING btree ("_path");

    -- ── Indexes (versioned) ─────────────────────────────────────────────────

    CREATE INDEX "_pages_v_blocks_parallax_showcase_slides_order_idx"
      ON "_pages_v_blocks_parallax_showcase_slides" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_parallax_showcase_slides_parent_id_idx"
      ON "_pages_v_blocks_parallax_showcase_slides" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_parallax_showcase_slides_background_image_idx"
      ON "_pages_v_blocks_parallax_showcase_slides" USING btree ("background_image_id");
    CREATE INDEX "_pages_v_blocks_parallax_showcase_slides_foreground_image_idx"
      ON "_pages_v_blocks_parallax_showcase_slides" USING btree ("foreground_image_id");

    CREATE INDEX "_pages_v_blocks_parallax_showcase_order_idx"
      ON "_pages_v_blocks_parallax_showcase" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_parallax_showcase_parent_id_idx"
      ON "_pages_v_blocks_parallax_showcase" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_parallax_showcase_path_idx"
      ON "_pages_v_blocks_parallax_showcase" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_parallax_showcase_slides" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_parallax_showcase" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_parallax_showcase_slides" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_parallax_showcase" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_parallax_showcase_slides_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_parallax_showcase_slides_link_type";
  `)
}
