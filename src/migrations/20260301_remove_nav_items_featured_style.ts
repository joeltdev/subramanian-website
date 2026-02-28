import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Drop the featured link links child table
    DROP TABLE IF EXISTS "header_tabs_nav_items_featured_link_links" CASCADE;

    -- Drop the featured link links enum
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_featured_link_links_link_type";

    -- Drop featured_link columns from nav items
    ALTER TABLE "header_tabs_nav_items"
      DROP COLUMN IF EXISTS "featured_link_tag",
      DROP COLUMN IF EXISTS "featured_link_label";

    -- Migrate any existing 'featured' style rows to 'list'
    UPDATE "header_tabs_nav_items" SET "style" = 'list' WHERE "style" = 'featured';

    -- Recreate the style enum with only 'list'
    CREATE TYPE "public"."enum_header_tabs_nav_items_style_new" AS ENUM('list');

    ALTER TABLE "header_tabs_nav_items" ALTER COLUMN "style" DROP DEFAULT;
    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" TYPE "public"."enum_header_tabs_nav_items_style_new"
      USING "style"::text::"public"."enum_header_tabs_nav_items_style_new";

    DROP TYPE "public"."enum_header_tabs_nav_items_style";
    ALTER TYPE "public"."enum_header_tabs_nav_items_style_new"
      RENAME TO "enum_header_tabs_nav_items_style";

    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" SET DEFAULT 'list'::"public"."enum_header_tabs_nav_items_style";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore the style enum with 'featured'
    CREATE TYPE "public"."enum_header_tabs_nav_items_style_old" AS ENUM('featured', 'list');

    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" TYPE "public"."enum_header_tabs_nav_items_style_old"
      USING "style"::text::"public"."enum_header_tabs_nav_items_style_old";

    DROP TYPE "public"."enum_header_tabs_nav_items_style";
    ALTER TYPE "public"."enum_header_tabs_nav_items_style_old"
      RENAME TO "enum_header_tabs_nav_items_style";

    -- Restore featured_link columns
    ALTER TABLE "header_tabs_nav_items"
      ADD COLUMN IF NOT EXISTS "featured_link_tag" varchar,
      ADD COLUMN IF NOT EXISTS "featured_link_label" varchar;

    -- Restore the featured link links enum and table
    CREATE TYPE "public"."enum_header_tabs_nav_items_featured_link_links_link_type" AS ENUM('reference', 'custom');

    CREATE TABLE "header_tabs_nav_items_featured_link_links" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "link_type" "enum_header_tabs_nav_items_featured_link_links_link_type" DEFAULT 'reference',
      "link_new_tab" boolean,
      "link_url" varchar,
      "link_label" varchar
    );

    ALTER TABLE "header_tabs_nav_items_featured_link_links"
      ADD CONSTRAINT "header_tabs_nav_items_featured_link_links_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs_nav_items"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "header_tabs_nav_items_featured_link_links_order_idx"
      ON "header_tabs_nav_items_featured_link_links" USING btree ("_order");
    CREATE INDEX "header_tabs_nav_items_featured_link_links_parent_id_idx"
      ON "header_tabs_nav_items_featured_link_links" USING btree ("_parent_id");
  `)
}
