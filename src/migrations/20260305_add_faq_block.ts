import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Enums
    CREATE TYPE "public"."enum_pages_blocks_faq_variant" AS ENUM('single', 'split');
    CREATE TYPE "public"."enum_pages_blocks_faq_support_line_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_faq_variant" AS ENUM('single', 'split');
    CREATE TYPE "public"."enum__pages_v_blocks_faq_support_line_type" AS ENUM('reference', 'custom');

    -- Block table (live pages)
    CREATE TABLE "pages_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "variant" "enum_pages_blocks_faq_variant" DEFAULT 'single' NOT NULL,
      "intro" jsonb,
      "support_line_subtitle" varchar,
      "support_line_link_label" varchar,
      "support_line_type" "enum_pages_blocks_faq_support_line_type" DEFAULT 'reference',
      "support_line_url" varchar,
      "support_line_new_tab" boolean,
      "block_name" varchar
    );

    -- Groups array (live pages)
    CREATE TABLE "pages_blocks_faq_groups" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar
    );

    -- Items nested array (live pages)
    CREATE TABLE "pages_blocks_faq_groups_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" jsonb
    );

    -- Block table (page versions)
    CREATE TABLE "_pages_v_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "variant" "enum__pages_v_blocks_faq_variant" DEFAULT 'single',
      "intro" jsonb,
      "support_line_subtitle" varchar,
      "support_line_link_label" varchar,
      "support_line_type" "enum__pages_v_blocks_faq_support_line_type" DEFAULT 'reference',
      "support_line_url" varchar,
      "support_line_new_tab" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Groups array (page versions)
    CREATE TABLE "_pages_v_blocks_faq_groups" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar
    );

    -- Items nested array (page versions)
    CREATE TABLE "_pages_v_blocks_faq_groups_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" jsonb
    );

    -- FK: block -> pages
    ALTER TABLE "pages_blocks_faq"
      ADD CONSTRAINT "pages_blocks_faq_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: groups -> block
    ALTER TABLE "pages_blocks_faq_groups"
      ADD CONSTRAINT "pages_blocks_faq_groups_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: items -> groups
    ALTER TABLE "pages_blocks_faq_groups_items"
      ADD CONSTRAINT "pages_blocks_faq_groups_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_groups"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version block -> _pages_v
    ALTER TABLE "_pages_v_blocks_faq"
      ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version groups -> version block
    ALTER TABLE "_pages_v_blocks_faq_groups"
      ADD CONSTRAINT "_pages_v_blocks_faq_groups_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version items -> version groups
    ALTER TABLE "_pages_v_blocks_faq_groups_items"
      ADD CONSTRAINT "_pages_v_blocks_faq_groups_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_groups"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes (live)
    CREATE INDEX "pages_blocks_faq_order_idx"
      ON "pages_blocks_faq" USING btree ("_order");
    CREATE INDEX "pages_blocks_faq_parent_id_idx"
      ON "pages_blocks_faq" USING btree ("_parent_id");

    CREATE INDEX "pages_blocks_faq_groups_order_idx"
      ON "pages_blocks_faq_groups" USING btree ("_order");
    CREATE INDEX "pages_blocks_faq_groups_parent_id_idx"
      ON "pages_blocks_faq_groups" USING btree ("_parent_id");

    CREATE INDEX "pages_blocks_faq_groups_items_order_idx"
      ON "pages_blocks_faq_groups_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_faq_groups_items_parent_id_idx"
      ON "pages_blocks_faq_groups_items" USING btree ("_parent_id");

    -- Indexes (versions)
    CREATE INDEX "_pages_v_blocks_faq_order_idx"
      ON "_pages_v_blocks_faq" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_faq_parent_id_idx"
      ON "_pages_v_blocks_faq" USING btree ("_parent_id");

    CREATE INDEX "_pages_v_blocks_faq_groups_order_idx"
      ON "_pages_v_blocks_faq_groups" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_faq_groups_parent_id_idx"
      ON "_pages_v_blocks_faq_groups" USING btree ("_parent_id");

    CREATE INDEX "_pages_v_blocks_faq_groups_items_order_idx"
      ON "_pages_v_blocks_faq_groups_items" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_faq_groups_items_parent_id_idx"
      ON "_pages_v_blocks_faq_groups_items" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_faq" DROP CONSTRAINT IF EXISTS "pages_blocks_faq_parent_id_fk";
    ALTER TABLE "pages_blocks_faq_groups" DROP CONSTRAINT IF EXISTS "pages_blocks_faq_groups_parent_id_fk";
    ALTER TABLE "pages_blocks_faq_groups_items" DROP CONSTRAINT IF EXISTS "pages_blocks_faq_groups_items_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_faq" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_faq_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_faq_groups" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_faq_groups_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_faq_groups_items" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_faq_groups_items_parent_id_fk";

    DROP TABLE IF EXISTS "pages_blocks_faq_groups_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_groups" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq_groups_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq_groups" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_faq_variant";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_faq_support_line_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_faq_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_faq_support_line_type";
  `)
}
