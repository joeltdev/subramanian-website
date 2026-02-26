import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Drop old nav items table and enum
    DROP TABLE IF EXISTS "footer_nav_items" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_footer_nav_items_link_type";

    -- New enums
    CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('twitter', 'linkedin', 'facebook', 'threads', 'instagram', 'tiktok');
    CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('reference', 'custom');

    -- Footer link columns
    CREATE TABLE "footer_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL
    );

    -- Links within each column
    CREATE TABLE "footer_columns_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_footer_columns_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    -- Social links
    CREATE TABLE "footer_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" "enum_footer_social_links_platform" NOT NULL,
      "url" varchar NOT NULL
    );

    -- New scalar columns on footer
    ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "newsletter_heading" varchar;
    ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "newsletter_note" varchar;
    ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "copyright" varchar;

    -- Foreign keys
    ALTER TABLE "footer_columns"
      ADD CONSTRAINT "footer_columns_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "footer_columns_links"
      ADD CONSTRAINT "footer_columns_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "footer_social_links"
      ADD CONSTRAINT "footer_social_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
    CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
    CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
    CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
    CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
    CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_columns_links" CASCADE;
    DROP TABLE IF EXISTS "footer_columns" CASCADE;
    DROP TABLE IF EXISTS "footer_social_links" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_footer_social_links_platform";
    DROP TYPE IF EXISTS "public"."enum_footer_columns_links_link_type";

    ALTER TABLE "footer" DROP COLUMN IF EXISTS "newsletter_heading";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "newsletter_note";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "copyright";

    -- Restore old nav items
    CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
    CREATE TABLE "footer_nav_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar NOT NULL
    );
    ALTER TABLE "footer_nav_items"
      ADD CONSTRAINT "footer_nav_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id")
      ON DELETE cascade ON UPDATE no action;
  `)
}
