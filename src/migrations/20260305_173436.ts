import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- 1. FAQ Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_faq_groups') THEN
        ALTER TABLE "_pages_v_blocks_faq_groups" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_faq_groups_items') THEN
        ALTER TABLE "_pages_v_blocks_faq_groups_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 2. Media Cards Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_media_cards_items') THEN
        ALTER TABLE "_pages_v_blocks_media_cards_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 3. Gallery Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_cta') THEN
        ALTER TABLE "_pages_v_blocks_gallery_cta" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_gallery_items') THEN
        ALTER TABLE "_pages_v_blocks_gallery_gallery_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_slides') THEN
        ALTER TABLE "_pages_v_blocks_gallery_slides" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_apple_items') THEN
        ALTER TABLE "_pages_v_blocks_gallery_apple_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 4. Testimonials Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_testimonials_testimonials') THEN
        ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 5. Stats Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_stats_stats') THEN
        ALTER TABLE "_pages_v_blocks_stats_stats" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 6. Feature Showcase Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_showcase_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_showcase_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 7. Feature Cards Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_cards_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_cards_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 8. Feature Bento Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_panel_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_panel_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_image_panels') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_accordion_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 9. Logo Cloud Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_logo_cloud_logos') THEN
        ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 10. Integrations Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_integrations_integrations') THEN
        ALTER TABLE "_pages_v_blocks_integrations_integrations" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_integrations_links') THEN
        ALTER TABLE "_pages_v_blocks_integrations_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 11. Content Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_columns') THEN
        ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 12. Content Section Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_section_items') THEN
        ALTER TABLE "_pages_v_blocks_content_section_items" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_section_links') THEN
        ALTER TABLE "_pages_v_blocks_content_section_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 13. Hover Highlights Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_hover_highlights_highlights') THEN
        ALTER TABLE "_pages_v_blocks_hover_highlights_highlights" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_hover_highlights_links') THEN
        ALTER TABLE "_pages_v_blocks_hover_highlights_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 14. CTA Block (versions)
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_cta_links') THEN
        ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;

      -- 15. Posts versions authors
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_posts_v_version_populated_authors') THEN
        ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_faq_groups') THEN
        ALTER TABLE "_pages_v_blocks_faq_groups" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_faq_groups_items') THEN
        ALTER TABLE "_pages_v_blocks_faq_groups_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_media_cards_items') THEN
        ALTER TABLE "_pages_v_blocks_media_cards_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_cta') THEN
        ALTER TABLE "_pages_v_blocks_gallery_cta" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_gallery_items') THEN
        ALTER TABLE "_pages_v_blocks_gallery_gallery_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_slides') THEN
        ALTER TABLE "_pages_v_blocks_gallery_slides" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_gallery_apple_items') THEN
        ALTER TABLE "_pages_v_blocks_gallery_apple_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_testimonials_testimonials') THEN
        ALTER TABLE "_pages_v_blocks_testimonials_testimonials" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_stats_stats') THEN
        ALTER TABLE "_pages_v_blocks_stats_stats" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_showcase_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_showcase_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_cards_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_cards_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_panel_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_panel_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_image_panels') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_feature_bento_accordion_items') THEN
        ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_logo_cloud_logos') THEN
        ALTER TABLE "_pages_v_blocks_logo_cloud_logos" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_integrations_integrations') THEN
        ALTER TABLE "_pages_v_blocks_integrations_integrations" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_integrations_links') THEN
        ALTER TABLE "_pages_v_blocks_integrations_links" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_columns') THEN
        ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_section_items') THEN
        ALTER TABLE "_pages_v_blocks_content_section_items" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_content_section_links') THEN
        ALTER TABLE "_pages_v_blocks_content_section_links" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_hover_highlights_highlights') THEN
        ALTER TABLE "_pages_v_blocks_hover_highlights_highlights" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_hover_highlights_links') THEN
        ALTER TABLE "_pages_v_blocks_hover_highlights_links" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_pages_v_blocks_cta_links') THEN
        ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "_uuid";
      END IF;
      IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '_posts_v_version_populated_authors') THEN
        ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN IF EXISTS "_uuid";
      END IF;
    END $$;
  `)
}
