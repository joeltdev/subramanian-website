import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Consolidates all per-table link_type / link_appearance enums into two shared
 * enums (`link_type` and `link_appearance`) so that adding new blocks with
 * link fields no longer prompts Drizzle about enum renames.
 *
 * This migration corresponds to adding `enumName: 'link_type'` and
 * `enumName: 'link_appearance'` to the `type` and `appearance` fields in
 * src/fields/link.ts.
 */

// Helper: tables with a `link_type` column that need migrating.
// Format: [table, column, oldEnum]
const LINK_TYPE_COLUMNS: [string, string, string][] = [
  // pages / _pages_v
  ['pages_hero_links',                              'link_type', 'enum_pages_hero_links_link_type'],
  ['pages_blocks_cta_links',                        'link_type', 'enum_pages_blocks_cta_links_link_type'],
  ['pages_blocks_content_columns',                  'link_type', 'enum_pages_blocks_content_columns_link_type'],
  ['pages_blocks_integrations_integrations',        'link_type', 'enum_pages_blocks_integrations_integrations_link_type'],
  ['pages_blocks_integrations_links',               'link_type', 'enum_pages_blocks_integrations_links_link_type'],
  ['pages_blocks_content_section_links',            'link_type', 'enum_pages_blocks_content_section_links_link_type'],
  ['pages_blocks_hover_highlights_highlights',      'link_type', 'enum_pages_blocks_hover_highlights_highlights_link_type'],
  ['pages_blocks_hover_highlights_links',           'link_type', 'enum_pages_blocks_hover_highlights_links_link_type'],
  ['pages_blocks_media_cards_items',                'link_type', 'enum_pages_blocks_media_cards_items_link_type'],

  ['_pages_v_version_hero_links',                   'link_type', 'enum__pages_v_version_hero_links_link_type'],
  ['_pages_v_blocks_cta_links',                     'link_type', 'enum__pages_v_blocks_cta_links_link_type'],
  ['_pages_v_blocks_content_columns',               'link_type', 'enum__pages_v_blocks_content_columns_link_type'],
  ['_pages_v_blocks_integrations_integrations',     'link_type', 'enum__pages_v_blocks_integrations_integrations_link_type'],
  ['_pages_v_blocks_integrations_links',            'link_type', 'enum__pages_v_blocks_integrations_links_link_type'],
  ['_pages_v_blocks_content_section_links',         'link_type', 'enum__pages_v_blocks_content_section_links_link_type'],
  ['_pages_v_blocks_hover_highlights_highlights',   'link_type', 'enum__pages_v_blocks_hover_highlights_highlights_link_type'],
  ['_pages_v_blocks_hover_highlights_links',        'link_type', 'enum__pages_v_blocks_hover_highlights_links_link_type'],
  ['_pages_v_blocks_media_cards_items',             'link_type', 'enum__pages_v_blocks_media_cards_items_link_type'],

  // header
  // NOTE: header_tabs_nav_items.default_link_link_type was dropped by remove_nav_items_default_style
  // NOTE: header_tabs_nav_items_featured_link_links was dropped by remove_nav_items_featured_style
  ['header_tabs',                                   'link_type', 'enum_header_tabs_link_type'],
  ['header_tabs_description_links',                 'link_type', 'enum_header_tabs_description_links_link_type'],
  ['header_tabs_nav_items_list_links_links',        'link_type', 'enum_header_tabs_nav_items_list_links_links_link_type'],
  ['header',                                        'menu_cta_type', 'enum_header_menu_cta_type'],

  // footer
  ['footer_columns_links',                          'link_type', 'enum_footer_columns_links_link_type'],
]

const LINK_APPEARANCE_COLUMNS: [string, string, string][] = [
  ['pages_hero_links',                            'link_appearance', 'enum_pages_hero_links_link_appearance'],
  ['pages_blocks_cta_links',                      'link_appearance', 'enum_pages_blocks_cta_links_link_appearance'],
  ['pages_blocks_content_columns',                'link_appearance', 'enum_pages_blocks_content_columns_link_appearance'],
  ['pages_blocks_integrations_links',             'link_appearance', 'enum_pages_blocks_integrations_links_link_appearance'],
  ['pages_blocks_content_section_links',          'link_appearance', 'enum_pages_blocks_content_section_links_link_appearance'],
  ['pages_blocks_hover_highlights_links',         'link_appearance', 'enum_pages_blocks_hover_highlights_links_link_appearance'],

  ['_pages_v_version_hero_links',                 'link_appearance', 'enum__pages_v_version_hero_links_link_appearance'],
  ['_pages_v_blocks_cta_links',                   'link_appearance', 'enum__pages_v_blocks_cta_links_link_appearance'],
  ['_pages_v_blocks_content_columns',             'link_appearance', 'enum__pages_v_blocks_content_columns_link_appearance'],
  ['_pages_v_blocks_integrations_links',          'link_appearance', 'enum__pages_v_blocks_integrations_links_link_appearance'],
  ['_pages_v_blocks_content_section_links',       'link_appearance', 'enum__pages_v_blocks_content_section_links_link_appearance'],
  ['_pages_v_blocks_hover_highlights_links',      'link_appearance', 'enum__pages_v_blocks_hover_highlights_links_link_appearance'],

  ['header',                                      'menu_cta_appearance', 'enum_header_menu_cta_appearance'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create shared enums
  await db.execute(sql`
    CREATE TYPE "public"."link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."link_appearance" AS ENUM('default', 'outline');
  `)

  // 2. Migrate all link_type columns
  for (const [table, col, _old] of LINK_TYPE_COLUMNS) {
    await db.execute(sql.raw(`
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" DROP DEFAULT;
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" TYPE "public"."link_type" USING "${col}"::text::"public"."link_type";
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" SET DEFAULT 'reference';
    `))
  }

  // 3. Migrate all link_appearance columns
  for (const [table, col, _old] of LINK_APPEARANCE_COLUMNS) {
    await db.execute(sql.raw(`
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" DROP DEFAULT;
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" TYPE "public"."link_appearance" USING "${col}"::text::"public"."link_appearance";
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" SET DEFAULT 'default';
    `))
  }

  // 4. Drop all old per-table enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_columns_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_columns_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_integrations_integrations_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_integrations_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_integrations_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_section_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_section_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_highlights_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_hover_highlights_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_media_cards_items_link_type";

    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_cta_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_cta_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_columns_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_columns_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_integrations_integrations_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_integrations_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_integrations_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_section_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_section_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_highlights_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hover_highlights_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_media_cards_items_link_type";

    DROP TYPE IF EXISTS "public"."enum_header_tabs_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_tabs_description_links_link_type";
    -- enum_header_tabs_nav_items_default_link_link_type already dropped by remove_nav_items_default_style
    -- enum_header_tabs_nav_items_featured_link_links_link_type already dropped by remove_nav_items_featured_style
    DROP TYPE IF EXISTS "public"."enum_header_tabs_nav_items_list_links_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_header_menu_cta_type";
    DROP TYPE IF EXISTS "public"."enum_header_menu_cta_appearance";

    DROP TYPE IF EXISTS "public"."enum_footer_columns_links_link_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate all old per-table enums
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_integrations_integrations_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_integrations_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_integrations_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_content_section_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_content_section_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_highlights_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_hover_highlights_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum_pages_blocks_media_cards_items_link_type" AS ENUM('reference', 'custom');

    CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_integrations_integrations_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_integrations_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_integrations_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_content_section_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_content_section_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_highlights_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_blocks_hover_highlights_links_link_appearance" AS ENUM('default', 'outline');
    CREATE TYPE "public"."enum__pages_v_blocks_media_cards_items_link_type" AS ENUM('reference', 'custom');

    CREATE TYPE "public"."enum_header_tabs_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_tabs_description_links_link_type" AS ENUM('reference', 'custom');
    -- enum_header_tabs_nav_items_default_link_link_type: already dropped by remove_nav_items_default_style, do not recreate
    -- enum_header_tabs_nav_items_featured_link_links_link_type: already dropped by remove_nav_items_featured_style, do not recreate
    CREATE TYPE "public"."enum_header_tabs_nav_items_list_links_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_menu_cta_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_header_menu_cta_appearance" AS ENUM('default', 'outline');

    CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('reference', 'custom');
  `)

  // Revert all link_type columns
  for (const [table, col, oldEnum] of LINK_TYPE_COLUMNS) {
    await db.execute(sql.raw(`
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" DROP DEFAULT;
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" TYPE "public"."${oldEnum}" USING "${col}"::text::"public"."${oldEnum}";
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" SET DEFAULT 'reference';
    `))
  }

  // Revert all link_appearance columns
  for (const [table, col, oldEnum] of LINK_APPEARANCE_COLUMNS) {
    await db.execute(sql.raw(`
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" DROP DEFAULT;
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" TYPE "public"."${oldEnum}" USING "${col}"::text::"public"."${oldEnum}";
      ALTER TABLE "public"."${table}" ALTER COLUMN "${col}" SET DEFAULT 'default';
    `))
  }

  // Drop the shared enums
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."link_type";
    DROP TYPE IF EXISTS "public"."link_appearance";
  `)
}
