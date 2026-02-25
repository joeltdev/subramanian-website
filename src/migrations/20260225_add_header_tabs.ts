import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- New enums for header tabs
    CREATE TYPE "public"."enum_header_tabs_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_tabs_description_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_tabs_nav_items_style" AS ENUM('default', 'featured', 'list');
    CREATE TYPE "public"."enum_header_tabs_nav_items_default_link_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_tabs_nav_items_featured_link_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_tabs_nav_items_list_links_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_menu_cta_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_menu_cta_appearance" AS ENUM('default', 'outline');

    -- Drop old nav items table and enum
    DROP TABLE IF EXISTS "header_nav_items" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_header_nav_items_link_type";

    -- Tabs: one row per nav tab
    CREATE TABLE "header_tabs" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "enable_direct_link" boolean,
      "enable_dropdown" boolean,
      "link_type" "enum_header_tabs_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar,
      "description" varchar
    );

    -- Description links inside each tab
    CREATE TABLE "header_tabs_description_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_tabs_description_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    -- Nav items inside each tab's dropdown
    CREATE TABLE "header_tabs_nav_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "style" "enum_header_tabs_nav_items_style" DEFAULT 'default',
      "default_link_link_type" "enum_header_tabs_nav_items_default_link_link_type" DEFAULT 'reference',
      "default_link_link_new_tab" boolean,
      "default_link_link_url" varchar,
      "default_link_link_label" varchar,
      "default_link_description" varchar,
      "featured_link_tag" varchar,
      "featured_link_label" varchar,
      "list_links_tag" varchar
    );

    -- Links inside a featured nav item
    CREATE TABLE "header_tabs_nav_items_featured_link_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_tabs_nav_items_featured_link_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    -- Links inside a list nav item
    CREATE TABLE "header_tabs_nav_items_list_links_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_tabs_nav_items_list_links_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    -- Foreign key constraints
    ALTER TABLE "header_tabs"
      ADD CONSTRAINT "header_tabs_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "header_tabs_description_links"
      ADD CONSTRAINT "header_tabs_description_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "header_tabs_nav_items"
      ADD CONSTRAINT "header_tabs_nav_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "header_tabs_nav_items_featured_link_links"
      ADD CONSTRAINT "header_tabs_nav_items_featured_link_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs_nav_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "header_tabs_nav_items_list_links_links"
      ADD CONSTRAINT "header_tabs_nav_items_list_links_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs_nav_items"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "header_tabs_order_idx" ON "header_tabs" USING btree ("_order");
    CREATE INDEX "header_tabs_parent_id_idx" ON "header_tabs" USING btree ("_parent_id");
    CREATE INDEX "header_tabs_description_links_order_idx" ON "header_tabs_description_links" USING btree ("_order");
    CREATE INDEX "header_tabs_description_links_parent_id_idx" ON "header_tabs_description_links" USING btree ("_parent_id");
    CREATE INDEX "header_tabs_nav_items_order_idx" ON "header_tabs_nav_items" USING btree ("_order");
    CREATE INDEX "header_tabs_nav_items_parent_id_idx" ON "header_tabs_nav_items" USING btree ("_parent_id");
    CREATE INDEX "header_tabs_nav_items_featured_link_links_order_idx" ON "header_tabs_nav_items_featured_link_links" USING btree ("_order");
    CREATE INDEX "header_tabs_nav_items_featured_link_links_parent_id_idx" ON "header_tabs_nav_items_featured_link_links" USING btree ("_parent_id");
    CREATE INDEX "header_tabs_nav_items_list_links_links_order_idx" ON "header_tabs_nav_items_list_links_links" USING btree ("_order");
    CREATE INDEX "header_tabs_nav_items_list_links_links_parent_id_idx" ON "header_tabs_nav_items_list_links_links" USING btree ("_parent_id");

    -- New columns on header table (menuCta + enableMenuCta)
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "enable_menu_cta" boolean;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_cta_type" "enum_header_menu_cta_type" DEFAULT 'reference';
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_cta_new_tab" boolean;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_cta_url" varchar;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_cta_label" varchar;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_cta_appearance" "enum_header_menu_cta_appearance" DEFAULT 'default';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Remove menuCta columns from header
    ALTER TABLE "header" DROP COLUMN IF EXISTS "enable_menu_cta";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_cta_type";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_cta_new_tab";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_cta_url";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_cta_label";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_cta_appearance";

    -- Drop new tables
    DROP TABLE IF EXISTS "header_tabs_nav_items_list_links_links" CASCADE;
    DROP TABLE IF EXISTS "header_tabs_nav_items_featured_link_links" CASCADE;
    DROP TABLE IF EXISTS "header_tabs_nav_items" CASCADE;
    DROP TABLE IF EXISTS "header_tabs_description_links" CASCADE;
    DROP TABLE IF EXISTS "header_tabs" CASCADE;

    -- Drop new enums
    DROP TYPE IF EXISTS "public"."enum_header_menu_cta_appearance";
    DROP TYPE IF EXISTS "public"."enum_header_menu_cta_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_list_links_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_featured_link_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_default_link_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_style";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_description_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_link_type";

    -- Restore old nav items table and enum
    CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
    CREATE TABLE "header_nav_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar NOT NULL
    );
    ALTER TABLE "header_nav_items"
      ADD CONSTRAINT "header_nav_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
    CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  `)
}
