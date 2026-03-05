import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. FAQ Block (versions)
    ALTER TABLE "_pages_v_blocks_faq_groups" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_faq_groups_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 2. Media Cards Block (versions)
    ALTER TABLE "_pages_v_blocks_media_cards_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 3. Gallery Block (versions)
    ALTER TABLE "_pages_v_blocks_gallery_cta" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_gallery_gallery_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_gallery_slides" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_gallery_apple_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 4. Testimonials Block (versions)
    -- Checking if testimonials items table exists and needs _uuid
    ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 5. Stats Block (versions)
    ALTER TABLE "_pages_v_blocks_stats_stats" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 6. Feature Showcase Block (versions)
    ALTER TABLE "_pages_v_blocks_feature_showcase_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 7. Feature Cards Block (versions)
    ALTER TABLE "_pages_v_blocks_feature_cards_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 8. Feature Bento Block (versions)
    ALTER TABLE "_pages_v_blocks_feature_bento_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_feature_bento_panel_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 9. Logo Cloud Block (versions)
    ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 10. Integrations Block (versions)
    ALTER TABLE "_pages_v_blocks_integrations_integrations" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_integrations_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 11. Content Block (versions)
    ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 12. Content Section Block (versions)
    ALTER TABLE "_pages_v_blocks_content_section_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_content_section_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 13. Hover Highlights Block (versions)
    ALTER TABLE "_pages_v_blocks_hover_highlights_highlights" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
    ALTER TABLE "_pages_v_blocks_hover_highlights_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 14. CTA Block (versions)
    ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;

    -- 15. Pages/Posts/Categories (Generic relationship tables often have _uuid if they are arrays)
    -- _pages_v_rels usually doesn't have it as it's a join table, but let's be safe.
    -- _posts_v_version_populated_authors
    ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_faq_groups" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_faq_groups_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_media_cards_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_gallery_cta" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_gallery_gallery_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_gallery_slides" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_gallery_apple_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_testimonials_testimonials" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_stats_stats" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_showcase_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_cards_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_bento_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_bento_panel_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_logo_cloud_logos" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_integrations_integrations" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_integrations_links" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_content_section_items" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_content_section_links" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_hover_highlights_highlights" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_hover_highlights_links" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "_uuid";
    ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN IF EXISTS "_uuid";
  `)
}
