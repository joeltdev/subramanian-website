import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_highlights_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_highlights_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_links_link_appearance" AS ENUM('default', 'outline');

    CREATE TABLE "pages_blocks_hover_highlights_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "media_top_id" integer,
      "media_bottom_id" integer,
      "link_type" "enum_pages_blocks_hover_highlights_highlights_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar
    );

    CREATE TABLE "pages_blocks_hover_highlights_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_pages_blocks_hover_highlights_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar,
      "link_appearance" "enum_pages_blocks_hover_highlights_links_link_appearance" DEFAULT 'default'
    );

    CREATE TABLE "pages_blocks_hover_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "before_highlights" varchar,
      "after_highlights" varchar,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_hover_highlights_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "media_top_id" integer,
      "media_bottom_id" integer,
      "link_type" "enum__pages_v_blocks_hover_highlights_highlights_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "_pages_v_blocks_hover_highlights_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "link_type" "enum__pages_v_blocks_hover_highlights_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar,
      "link_appearance" "enum__pages_v_blocks_hover_highlights_links_link_appearance" DEFAULT 'default',
      "_uuid" varchar
    );

    CREATE TABLE "_pages_v_blocks_hover_highlights" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "before_highlights" varchar,
      "after_highlights" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    ALTER TABLE "pages_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "pages_blocks_hover_highlights_highlights_media_top_id_media_id_fk"
      FOREIGN KEY ("media_top_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "pages_blocks_hover_highlights_highlights_media_bottom_id_media_id_fk"
      FOREIGN KEY ("media_bottom_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "pages_blocks_hover_highlights_highlights_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hover_highlights"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_hover_highlights_links"
      ADD CONSTRAINT "pages_blocks_hover_highlights_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hover_highlights"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_hover_highlights"
      ADD CONSTRAINT "pages_blocks_hover_highlights_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "_pages_v_blocks_hover_highlights_highlights_media_top_id_media_id_fk"
      FOREIGN KEY ("media_top_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "_pages_v_blocks_hover_highlights_highlights_media_bottom_id_media_id_fk"
      FOREIGN KEY ("media_bottom_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_hover_highlights_highlights"
      ADD CONSTRAINT "_pages_v_blocks_hover_highlights_highlights_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hover_highlights"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_hover_highlights_links"
      ADD CONSTRAINT "_pages_v_blocks_hover_highlights_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hover_highlights"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_hover_highlights"
      ADD CONSTRAINT "_pages_v_blocks_hover_highlights_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_hover_highlights_highlights_order_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("_order");
    CREATE INDEX "pages_blocks_hover_highlights_highlights_parent_id_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_hover_highlights_highlights_media_top_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("media_top_id");
    CREATE INDEX "pages_blocks_hover_highlights_highlights_media_bottom_idx" ON "pages_blocks_hover_highlights_highlights" USING btree ("media_bottom_id");
    CREATE INDEX "pages_blocks_hover_highlights_links_order_idx" ON "pages_blocks_hover_highlights_links" USING btree ("_order");
    CREATE INDEX "pages_blocks_hover_highlights_links_parent_id_idx" ON "pages_blocks_hover_highlights_links" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_hover_highlights_order_idx" ON "pages_blocks_hover_highlights" USING btree ("_order");
    CREATE INDEX "pages_blocks_hover_highlights_parent_id_idx" ON "pages_blocks_hover_highlights" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_order_idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_hover_highlights_highlights_parent_id_idx" ON "_pages_v_blocks_hover_highlights_highlights" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_hover_highlights_links_order_idx" ON "_pages_v_blocks_hover_highlights_links" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_hover_highlights_links_parent_id_idx" ON "_pages_v_blocks_hover_highlights_links" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_hover_highlights_order_idx" ON "_pages_v_blocks_hover_highlights" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_hover_highlights_parent_id_idx" ON "_pages_v_blocks_hover_highlights" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_hover_highlights_highlights" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hover_highlights_links" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hover_highlights" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hover_highlights_highlights" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hover_highlights_links" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hover_highlights" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_highlights_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_highlights_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_links_link_appearance";
  `)
}
