import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- 1. CTA Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_cta') THEN
        CREATE TABLE "_products_v_blocks_cta" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_cta" ADD COLUMN "rich_text" jsonb;
      END IF;

      -- 2. CTA Links
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_cta_links') THEN
        CREATE TABLE "_products_v_blocks_cta_links" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_cta_links" ADD CONSTRAINT "_products_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta_links' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_cta_links" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta_links' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_cta_links" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta_links' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_cta_links" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta_links' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_cta_links" ADD COLUMN "link_label" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_cta_links' AND column_name = 'link_appearance') THEN
        ALTER TABLE "_products_v_blocks_cta_links" ADD COLUMN "link_appearance" varchar DEFAULT 'default';
      END IF;

      -- 3. Content Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content') THEN
        CREATE TABLE "_products_v_blocks_content" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_content" ADD CONSTRAINT "_products_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- 4. Content Columns
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_columns') THEN
        CREATE TABLE "_products_v_blocks_content_columns" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_content_columns" ADD CONSTRAINT "_products_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'size') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "size" varchar DEFAULT 'oneThird';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "rich_text" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'enable_link') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "enable_link" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "link_label" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_columns' AND column_name = 'link_appearance') THEN
        ALTER TABLE "_products_v_blocks_content_columns" ADD COLUMN "link_appearance" varchar DEFAULT 'default';
      END IF;

      -- 5. MediaBlock
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_media_block') THEN
        CREATE TABLE "_products_v_blocks_media_block" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_media_block" ADD CONSTRAINT "_products_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_media_block' AND column_name = 'position') THEN
        ALTER TABLE "_products_v_blocks_media_block" ADD COLUMN "position" varchar DEFAULT 'default';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_media_block' AND column_name = 'media_id') THEN
        ALTER TABLE "_products_v_blocks_media_block" ADD COLUMN "media_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_media_block' AND column_name = 'caption') THEN
        ALTER TABLE "_products_v_blocks_media_block" ADD COLUMN "caption" jsonb;
      END IF;

      -- 6. LogoCloud
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_logo_cloud') THEN
        CREATE TABLE "_products_v_blocks_logo_cloud" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_logo_cloud" ADD CONSTRAINT "_products_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_logo_cloud' AND column_name = 'type') THEN
        ALTER TABLE "_products_v_blocks_logo_cloud" ADD COLUMN "type" varchar DEFAULT 'section1';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_logo_cloud' AND column_name = 'heading') THEN
        ALTER TABLE "_products_v_blocks_logo_cloud" ADD COLUMN "heading" varchar;
      END IF;

      -- 7. LogoCloud Logos
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_logo_cloud_logos') THEN
        CREATE TABLE "_products_v_blocks_logo_cloud_logos" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_products_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_logo_cloud_logos' AND column_name = 'logo_id') THEN
        ALTER TABLE "_products_v_blocks_logo_cloud_logos" ADD COLUMN "logo_id" integer;
      END IF;

      -- 8. FeatureCards
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_cards') THEN
        CREATE TABLE "_products_v_blocks_feature_cards" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_cards" ADD CONSTRAINT "_products_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_cards' AND column_name = 'variant') THEN
        ALTER TABLE "_products_v_blocks_feature_cards" ADD COLUMN "variant" varchar DEFAULT 'floating';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_cards' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_feature_cards" ADD COLUMN "intro" jsonb;
      END IF;

      -- 9. FeatureCards Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_cards_items') THEN
        CREATE TABLE "_products_v_blocks_feature_cards_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_cards_items" ADD CONSTRAINT "_products_v_blocks_feature_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_cards_items' AND column_name = 'icon') THEN
        ALTER TABLE "_products_v_blocks_feature_cards_items" ADD COLUMN "icon" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_cards_items' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_feature_cards_items" ADD COLUMN "rich_text" jsonb;
      END IF;

      -- 10. FeatureShowcase
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_showcase') THEN
        CREATE TABLE "_products_v_blocks_feature_showcase" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD CONSTRAINT "_products_v_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase' AND column_name = 'variant') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD COLUMN "variant" varchar DEFAULT 'split';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD COLUMN "intro" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase' AND column_name = 'image_foreground_id') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD COLUMN "image_foreground_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase' AND column_name = 'image_dark_id') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD COLUMN "image_dark_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase' AND column_name = 'image_light_id') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD COLUMN "image_light_id" integer;
      END IF;

      -- 11. FeatureShowcase Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_showcase_items') THEN
        CREATE TABLE "_products_v_blocks_feature_showcase_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_showcase_items" ADD CONSTRAINT "_products_v_blocks_feature_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase_items' AND column_name = 'icon') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase_items" ADD COLUMN "icon" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_feature_showcase_items' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_feature_showcase_items" ADD COLUMN "rich_text" jsonb;
      END IF;

      -- 12. ContentSection
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section') THEN
        CREATE TABLE "_products_v_blocks_content_section" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section" ADD CONSTRAINT "_products_v_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'variant') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "variant" varchar DEFAULT 'splitImage';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "intro" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'image_dark_id') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "image_dark_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'image_light_id') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "image_light_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'image_id') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "image_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'quote') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "quote" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'quote_author') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "quote_author" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section' AND column_name = 'quote_logo_id') THEN
        ALTER TABLE "_products_v_blocks_content_section" ADD COLUMN "quote_logo_id" integer;
      END IF;

      -- 13. ContentSection Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section_items') THEN
        CREATE TABLE "_products_v_blocks_content_section_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section_items" ADD CONSTRAINT "_products_v_blocks_content_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_items' AND column_name = 'icon') THEN
        ALTER TABLE "_products_v_blocks_content_section_items" ADD COLUMN "icon" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_items' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_content_section_items" ADD COLUMN "rich_text" jsonb;
      END IF;

      -- 14. ContentSection Links
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section_links') THEN
        CREATE TABLE "_products_v_blocks_content_section_links" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section_links" ADD CONSTRAINT "_products_v_blocks_content_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_links' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_content_section_links" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_links' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_content_section_links" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_links' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_content_section_links" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_links' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_content_section_links" ADD COLUMN "link_label" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_content_section_links' AND column_name = 'link_appearance') THEN
        ALTER TABLE "_products_v_blocks_content_section_links" ADD COLUMN "link_appearance" varchar DEFAULT 'default';
      END IF;

      -- 15. Stats Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_stats') THEN
        CREATE TABLE "_products_v_blocks_stats" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_stats" ADD CONSTRAINT "_products_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_stats' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_stats" ADD COLUMN "intro" jsonb;
      END IF;

      -- 16. Stats Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_stats_stats') THEN
        CREATE TABLE "_products_v_blocks_stats_stats" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_stats_stats" ADD CONSTRAINT "_products_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_stats_stats' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_stats_stats" ADD COLUMN "rich_text" jsonb;
      END IF;

      -- 17. Testimonials Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_testimonials') THEN
        CREATE TABLE "_products_v_blocks_testimonials" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_testimonials" ADD CONSTRAINT "_products_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_testimonials" ADD COLUMN "intro" jsonb;
      END IF;

      -- 18. Testimonials Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_testimonials_testimonials') THEN
        CREATE TABLE "_products_v_blocks_testimonials_testimonials" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_products_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials_testimonials' AND column_name = 'logo_id') THEN
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD COLUMN "logo_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials_testimonials' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD COLUMN "rich_text" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials_testimonials' AND column_name = 'author') THEN
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD COLUMN "author" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials_testimonials' AND column_name = 'role') THEN
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD COLUMN "role" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_testimonials_testimonials' AND column_name = 'avatar_id') THEN
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD COLUMN "avatar_id" integer;
      END IF;

      -- 19. ArticleGrid Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_article_grid') THEN
        CREATE TABLE "_products_v_blocks_article_grid" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_article_grid" ADD CONSTRAINT "_products_v_blocks_article_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_article_grid' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_article_grid" ADD COLUMN "intro" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_article_grid' AND column_name = 'populate_by') THEN
        ALTER TABLE "_products_v_blocks_article_grid" ADD COLUMN "populate_by" varchar DEFAULT 'collection';
      END IF;

      -- 20. Gallery Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery') THEN
        CREATE TABLE "_products_v_blocks_gallery" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery" ADD CONSTRAINT "_products_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery' AND column_name = 'variant') THEN
        ALTER TABLE "_products_v_blocks_gallery" ADD COLUMN "variant" varchar DEFAULT 'scrollable';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery' AND column_name = 'intro') THEN
        ALTER TABLE "_products_v_blocks_gallery" ADD COLUMN "intro" jsonb;
      END IF;

      -- 21. Gallery CTA
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_cta') THEN
        CREATE TABLE "_products_v_blocks_gallery_cta" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD CONSTRAINT "_products_v_blocks_gallery_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_cta' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_cta' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_cta' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_cta' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD COLUMN "link_label" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_cta' AND column_name = 'link_appearance') THEN
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD COLUMN "link_appearance" varchar DEFAULT 'default';
      END IF;

      -- 22. Gallery Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_gallery_items') THEN
        CREATE TABLE "_products_v_blocks_gallery_gallery_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD CONSTRAINT "_products_v_blocks_gallery_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'image_id') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "image_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'rich_text') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "rich_text" jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_gallery_items' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD COLUMN "link_label" varchar;
      END IF;

      -- 23. Gallery Slides
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_slides') THEN
        CREATE TABLE "_products_v_blocks_gallery_slides" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD CONSTRAINT "_products_v_blocks_gallery_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'image_id') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "image_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'title') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "title" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'link_type') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "link_type" varchar DEFAULT 'custom';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'link_new_tab') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "link_new_tab" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'link_url') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "link_url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_slides' AND column_name = 'link_label') THEN
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD COLUMN "link_label" varchar;
      END IF;

      -- 24. Gallery Apple Items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_apple_items') THEN
        CREATE TABLE "_products_v_blocks_gallery_apple_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD CONSTRAINT "_products_v_blocks_gallery_apple_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_apple_items' AND column_name = 'image_id') THEN
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD COLUMN "image_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_apple_items' AND column_name = 'category') THEN
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD COLUMN "category" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_apple_items' AND column_name = 'title') THEN
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD COLUMN "title" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery_apple_items' AND column_name = 'expanded_content') THEN
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD COLUMN "expanded_content" jsonb;
      END IF;

      -- 25. YouTube Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_youtube') THEN
        CREATE TABLE "_products_v_blocks_youtube" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_youtube" ADD CONSTRAINT "_products_v_blocks_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_youtube' AND column_name = 'url') THEN
        ALTER TABLE "_products_v_blocks_youtube" ADD COLUMN "url" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_youtube' AND column_name = 'title') THEN
        ALTER TABLE "_products_v_blocks_youtube" ADD COLUMN "title" varchar;
      END IF;

      -- 26. ProductListing Block
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_product_listing') THEN
        CREATE TABLE "_products_v_blocks_product_listing" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_product_listing" ADD CONSTRAINT "_products_v_blocks_product_listing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_product_listing' AND column_name = 'title') THEN
        ALTER TABLE "_products_v_blocks_product_listing" ADD COLUMN "title" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_product_listing' AND column_name = 'description') THEN
        ALTER TABLE "_products_v_blocks_product_listing" ADD COLUMN "description" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_product_listing' AND column_name = 'category_id') THEN
        ALTER TABLE "_products_v_blocks_product_listing" ADD COLUMN "category_id" integer;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_product_listing' AND column_name = 'products_per_page') THEN
        ALTER TABLE "_products_v_blocks_product_listing" ADD COLUMN "products_per_page" numeric DEFAULT 9;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_product_listing' AND column_name = 'show_pagination') THEN
        ALTER TABLE "_products_v_blocks_product_listing" ADD COLUMN "show_pagination" boolean DEFAULT true;
      END IF;

      -- 27. Version Relationships (RELS)
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_rels') THEN
        CREATE TABLE "_products_v_rels" (
          "id" serial PRIMARY KEY NOT NULL,
          "order" integer,
          "parent_id" integer NOT NULL,
          "path" varchar NOT NULL
        );
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'product_tags_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "product_tags_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_tags_id_fk" FOREIGN KEY ("product_tags_id") REFERENCES "public"."product_tags"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'product_categories_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "product_categories_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_categories_id_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'pages_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "pages_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_pages_id_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'posts_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "posts_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_posts_id_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'categories_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "categories_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_id_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Manual migration for production fix.
}
