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
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_logo_cloud" ADD CONSTRAINT "_products_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureCards
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_cards') THEN
        CREATE TABLE "_products_v_blocks_feature_cards" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_cards" ADD CONSTRAINT "_products_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- featureShowcase
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_feature_showcase') THEN
        CREATE TABLE "_products_v_blocks_feature_showcase" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_feature_showcase" ADD CONSTRAINT "_products_v_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;

      -- contentSection
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_content_section') THEN
        CREATE TABLE "_products_v_blocks_content_section" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_content_section" ADD CONSTRAINT "_products_v_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
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

      -- articleGrid
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_article_grid') THEN
        CREATE TABLE "_products_v_blocks_article_grid" (
          "_order" integer NOT NULL,
          "_parent_id" integer NOT NULL,
          "_path" text NOT NULL,
          "id" serial PRIMARY KEY NOT NULL,
          "intro" jsonb,
          "_uuid" varchar,
          "block_name" varchar
        );
        ALTER TABLE "_products_v_blocks_article_grid" ADD CONSTRAINT "_products_v_blocks_article_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
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
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Manual migration for production fix. Down migration left empty to avoid accidental data loss.
}
