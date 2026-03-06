import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- cta
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_cta') THEN
        CREATE TABLE "_products_v_blocks_cta" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "rich_text" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_cta_order_idx" ON "_products_v_blocks_cta" ("_order");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_cta_parent_id_idx" ON "_products_v_blocks_cta" ("_parent_id");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_cta_path_idx" ON "_products_v_blocks_cta" ("_path");
        ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- cta links
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_cta_links') THEN
        CREATE TABLE "_products_v_blocks_cta_links" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "link_appearance" varchar DEFAULT 'default',
          "_uuid" varchar
        );
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_cta_links_order_idx" ON "_products_v_blocks_cta_links" ("_order");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_cta_links_parent_id_idx" ON "_products_v_blocks_cta_links" ("_parent_id");
        ALTER TABLE "_products_v_blocks_cta_links" ADD CONSTRAINT "_products_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- content
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content') THEN
        CREATE TABLE "_products_v_blocks_content" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "_uuid" varchar,
          "block_name" varchar
        );
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_content_order_idx" ON "_products_v_blocks_content" ("_order");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_content_parent_id_idx" ON "_products_v_blocks_content" ("_parent_id");
        ALTER TABLE "_products_v_blocks_content" ADD CONSTRAINT "_products_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- content columns
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_columns') THEN
        CREATE TABLE "_products_v_blocks_content_columns" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "size" varchar DEFAULT 'oneThird',
          "rich_text" jsonb,
          "enable_link" boolean,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "link_appearance" varchar DEFAULT 'default',
          "_uuid" varchar
        );
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_content_columns_order_idx" ON "_products_v_blocks_content_columns" ("_order");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_content_columns_parent_id_idx" ON "_products_v_blocks_content_columns" ("_parent_id");
        ALTER TABLE "_products_v_blocks_content_columns" ADD CONSTRAINT "_products_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- mediaBlock
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_media_block') THEN
        CREATE TABLE "_products_v_blocks_media_block" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "position" varchar DEFAULT 'default',
          "media_id" integer,
          "caption" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_media_block_order_idx" ON "_products_v_blocks_media_block" ("_order");
        CREATE INDEX IF NOT EXISTS "_products_v_blocks_media_block_parent_id_idx" ON "_products_v_blocks_media_block" ("_parent_id");
        ALTER TABLE "_products_v_blocks_media_block" ADD CONSTRAINT "_products_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- logoCloud
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_logo_cloud') THEN
        CREATE TABLE "_products_v_blocks_logo_cloud" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "type" varchar DEFAULT 'section1',
          "heading" varchar,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_logo_cloud" ADD CONSTRAINT "_products_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- logoCloud logos
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_logo_cloud_logos') THEN
        CREATE TABLE "_products_v_blocks_logo_cloud_logos" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "logo_id" integer,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_products_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureCards
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_cards') THEN
        CREATE TABLE "_products_v_blocks_feature_cards" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "variant" varchar DEFAULT 'floating',
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_cards" ADD CONSTRAINT "_products_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureCards items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_cards_items') THEN
        CREATE TABLE "_products_v_blocks_feature_cards_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "icon" varchar,
          "rich_text" jsonb,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_cards_items" ADD CONSTRAINT "_products_v_blocks_feature_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureShowcase
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_showcase') THEN
        CREATE TABLE "_products_v_blocks_feature_showcase" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "variant" varchar DEFAULT 'split',
          "intro" jsonb,
          "image_foreground_id" integer,
          "image_dark_id" integer,
          "image_light_id" integer,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD CONSTRAINT "_products_v_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureShowcase items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_showcase_items') THEN
        CREATE TABLE "_products_v_blocks_feature_showcase_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "icon" varchar,
          "rich_text" jsonb,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_showcase_items" ADD CONSTRAINT "_products_v_blocks_feature_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- contentSection
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section') THEN
        CREATE TABLE "_products_v_blocks_content_section" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "variant" varchar DEFAULT 'splitImage',
          "intro" jsonb,
          "image_dark_id" integer,
          "image_light_id" integer,
          "image_id" integer,
          "quote" jsonb,
          "quote_author" varchar,
          "quote_logo_id" integer,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section" ADD CONSTRAINT "_products_v_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- contentSection items
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section_items') THEN
        CREATE TABLE "_products_v_blocks_content_section_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "icon" varchar,
          "rich_text" jsonb,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section_items" ADD CONSTRAINT "_products_v_blocks_content_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- contentSection links
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section_links') THEN
        CREATE TABLE "_products_v_blocks_content_section_links" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "link_appearance" varchar DEFAULT 'default',
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section_links" ADD CONSTRAINT "_products_v_blocks_content_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- stats
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_stats') THEN
        CREATE TABLE "_products_v_blocks_stats" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_stats" ADD CONSTRAINT "_products_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- stats stats
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_stats_stats') THEN
        CREATE TABLE "_products_v_blocks_stats_stats" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "rich_text" jsonb,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_stats_stats" ADD CONSTRAINT "_products_v_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- testimonials
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_testimonials') THEN
        CREATE TABLE "_products_v_blocks_testimonials" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_testimonials" ADD CONSTRAINT "_products_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- testimonials testimonials
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_testimonials_testimonials') THEN
        CREATE TABLE "_products_v_blocks_testimonials_testimonials" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "logo_id" integer,
          "rich_text" jsonb,
          "author" varchar,
          "role" varchar,
          "avatar_id" integer,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_products_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- articleGrid
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_article_grid') THEN
        CREATE TABLE "_products_v_blocks_article_grid" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "populate_by" varchar DEFAULT 'collection',
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_article_grid" ADD CONSTRAINT "_products_v_blocks_article_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- gallery
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery') THEN
        CREATE TABLE "_products_v_blocks_gallery" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "variant" varchar DEFAULT 'scrollable',
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery" ADD CONSTRAINT "_products_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- gallery cta (linkGroup overrides name to cta)
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_cta') THEN
        CREATE TABLE "_products_v_blocks_gallery_cta" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "link_appearance" varchar DEFAULT 'default',
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_cta" ADD CONSTRAINT "_products_v_blocks_gallery_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- gallery galleryItems
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_gallery_items') THEN
        CREATE TABLE "_products_v_blocks_gallery_gallery_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "image_id" integer,
          "rich_text" jsonb,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_gallery_items" ADD CONSTRAINT "_products_v_blocks_gallery_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- gallery slides
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_slides') THEN
        CREATE TABLE "_products_v_blocks_gallery_slides" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "image_id" integer,
          "title" varchar,
          "link_type" varchar DEFAULT 'custom',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_slides" ADD CONSTRAINT "_products_v_blocks_gallery_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- gallery appleItems
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery_apple_items') THEN
        CREATE TABLE "_products_v_blocks_gallery_apple_items" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "image_id" integer,
          "category" varchar,
          "title" varchar,
          "expanded_content" jsonb,
          "_uuid" varchar
        );
        ALTER TABLE "_products_v_blocks_gallery_apple_items" ADD CONSTRAINT "_products_v_blocks_gallery_apple_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- youtube
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_youtube') THEN
        CREATE TABLE "_products_v_blocks_youtube" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "url" varchar,
          "caption" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_youtube" ADD CONSTRAINT "_products_v_blocks_youtube_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- rels
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_rels') THEN
        CREATE TABLE "_products_v_rels" (
          "id" serial PRIMARY KEY NOT NULL,
          "order" integer,
          "parent_id" integer NOT NULL,
          "path" varchar NOT NULL,
          "product_tags_id" integer,
          "pages_id" integer,
          "posts_id" integer,
          "categories_id" integer
        );
        CREATE INDEX IF NOT EXISTS "_products_v_rels_order_idx" ON "_products_v_rels" ("order");
        CREATE INDEX IF NOT EXISTS "_products_v_rels_parent_id_idx" ON "_products_v_rels" ("parent_id");
        CREATE INDEX IF NOT EXISTS "_products_v_rels_path_idx" ON "_products_v_rels" ("path");
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_tags_id_fk" FOREIGN KEY ("product_tags_id") REFERENCES "public"."product_tags"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_pages_id_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_posts_id_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_id_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Manual migration for production fix.
}
