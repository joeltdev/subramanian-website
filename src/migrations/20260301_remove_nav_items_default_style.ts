import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Migrate any existing 'default' style rows to 'featured' before removing the enum value
    UPDATE "header_tabs_nav_items" SET "style" = 'featured' WHERE "style" = 'default';

    -- Recreate the style enum without 'default'
    CREATE TYPE "public"."enum_header_tabs_nav_items_style_new" AS ENUM('featured', 'list');

    ALTER TABLE "header_tabs_nav_items" ALTER COLUMN "style" DROP DEFAULT;
    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" TYPE "public"."enum_header_tabs_nav_items_style_new"
      USING "style"::text::"public"."enum_header_tabs_nav_items_style_new";

    DROP TYPE "public"."enum_header_tabs_nav_items_style";
    ALTER TYPE "public"."enum_header_tabs_nav_items_style_new"
      RENAME TO "enum_header_tabs_nav_items_style";

    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" SET DEFAULT 'featured'::"public"."enum_header_tabs_nav_items_style";

    -- Drop default_link columns
    ALTER TABLE "header_tabs_nav_items"
      DROP COLUMN IF EXISTS "default_link_link_type",
      DROP COLUMN IF EXISTS "default_link_link_new_tab",
      DROP COLUMN IF EXISTS "default_link_link_url",
      DROP COLUMN IF EXISTS "default_link_link_label",
      DROP COLUMN IF EXISTS "default_link_description";

    -- Drop the default_link link type enum
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_default_link_link_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore the default_link link type enum
    CREATE TYPE "public"."enum_header_tabs_nav_items_default_link_link_type" AS ENUM('reference', 'custom');

    -- Restore default_link columns
    ALTER TABLE "header_tabs_nav_items"
      ADD COLUMN IF NOT EXISTS "default_link_link_type" "enum_header_tabs_nav_items_default_link_link_type" DEFAULT 'reference',
      ADD COLUMN IF NOT EXISTS "default_link_link_new_tab" boolean,
      ADD COLUMN IF NOT EXISTS "default_link_link_url" varchar,
      ADD COLUMN IF NOT EXISTS "default_link_link_label" varchar,
      ADD COLUMN IF NOT EXISTS "default_link_description" varchar;

    -- Recreate the style enum with 'default'
    CREATE TYPE "public"."enum_header_tabs_nav_items_style_old" AS ENUM('default', 'featured', 'list');

    ALTER TABLE "header_tabs_nav_items"
      ALTER COLUMN "style" TYPE "public"."enum_header_tabs_nav_items_style_old"
      USING "style"::text::"public"."enum_header_tabs_nav_items_style_old";

    DROP TYPE "public"."enum_header_tabs_nav_items_style";
    ALTER TYPE "public"."enum_header_tabs_nav_items_style_old"
      RENAME TO "enum_header_tabs_nav_items_style";
  `)
}
