import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- Types
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_gallery_variant') THEN
        CREATE TYPE "public"."enum_pages_blocks_gallery_variant" AS ENUM('scrollable', 'parallax', 'apple');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__pages_v_blocks_gallery_variant') THEN
        CREATE TYPE "public"."enum__pages_v_blocks_gallery_variant" AS ENUM('scrollable', 'parallax', 'apple');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_products_blocks_gallery_variant') THEN
        CREATE TYPE "public"."enum_products_blocks_gallery_variant" AS ENUM('scrollable', 'parallax', 'apple');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__products_v_blocks_gallery_variant') THEN
        CREATE TYPE "public"."enum__products_v_blocks_gallery_variant" AS ENUM('scrollable', 'parallax', 'apple');
      END IF;

      -- Tables: Newsletter Subscription
      CREATE TABLE IF NOT EXISTS "pages_blocks_newsletter_subscription" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "badge" varchar,
        "intro" jsonb,
        "submit_button_label" varchar DEFAULT 'Subscribe',
        "form_action_url" varchar,
        "image_id" integer,
        "block_name" varchar
      );
      
      CREATE TABLE IF NOT EXISTS "_pages_v_blocks_newsletter_subscription" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "_path" text NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "badge" varchar,
        "intro" jsonb,
        "submit_button_label" varchar DEFAULT 'Subscribe',
        "form_action_url" varchar,
        "image_id" integer,
        "_uuid" varchar,
        "block_name" varchar
      );

      -- pages_blocks_archive
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_archive') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_archive' AND column_name = 'intro_content') THEN
          ALTER TABLE "pages_blocks_archive" RENAME COLUMN "intro_content" TO "intro";
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_archive' AND column_name = 'intro') THEN
          ALTER TABLE "pages_blocks_archive" ADD COLUMN "intro" jsonb;
        END IF;
      END IF;

      -- pages_blocks_gallery
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_gallery') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_gallery' AND column_name = 'type') THEN
          ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "type" DROP DEFAULT;
          ALTER TABLE "pages_blocks_gallery" RENAME COLUMN "type" TO "variant";
          ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "variant" TYPE "enum_pages_blocks_gallery_variant" USING "variant"::text::"enum_pages_blocks_gallery_variant";
          ALTER TABLE "pages_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'scrollable';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_gallery' AND column_name = 'variant') THEN
          ALTER TABLE "pages_blocks_gallery" ADD COLUMN "variant" "enum_pages_blocks_gallery_variant" DEFAULT 'scrollable';
        END IF;
      END IF;

      -- _pages_v_blocks_archive
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_archive') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_archive' AND column_name = 'intro_content') THEN
          ALTER TABLE "_pages_v_blocks_archive" RENAME COLUMN "intro_content" TO "intro";
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_archive' AND column_name = 'intro') THEN
          ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "intro" jsonb;
        END IF;
      END IF;

      -- _pages_v_blocks_gallery
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_gallery') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_gallery' AND column_name = 'type') THEN
          ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "type" DROP DEFAULT;
          ALTER TABLE "_pages_v_blocks_gallery" RENAME COLUMN "type" TO "variant";
          ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "variant" TYPE "enum__pages_v_blocks_gallery_variant" USING "variant"::text::"enum__pages_v_blocks_gallery_variant";
          ALTER TABLE "_pages_v_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'scrollable';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_gallery' AND column_name = 'variant') THEN
          ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN "variant" "enum__pages_v_blocks_gallery_variant" DEFAULT 'scrollable';
        END IF;
      END IF;

      -- products_blocks_gallery
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products_blocks_gallery') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_blocks_gallery' AND column_name = 'type') THEN
          ALTER TABLE "products_blocks_gallery" ALTER COLUMN "type" DROP DEFAULT;
          ALTER TABLE "products_blocks_gallery" RENAME COLUMN "type" TO "variant";
          ALTER TABLE "products_blocks_gallery" ALTER COLUMN "variant" TYPE "enum_products_blocks_gallery_variant" USING "variant"::text::"enum_products_blocks_gallery_variant";
          ALTER TABLE "products_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'scrollable';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_blocks_gallery' AND column_name = 'variant') THEN
          ALTER TABLE "products_blocks_gallery" ADD COLUMN "variant" "enum_products_blocks_gallery_variant" DEFAULT 'scrollable';
        END IF;
      END IF;

      -- _products_v_blocks_gallery
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_products_v_blocks_gallery') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery' AND column_name = 'type') THEN
          ALTER TABLE "_products_v_blocks_gallery" ALTER COLUMN "type" DROP DEFAULT;
          ALTER TABLE "_products_v_blocks_gallery" RENAME COLUMN "type" TO "variant";
          ALTER TABLE "_products_v_blocks_gallery" ALTER COLUMN "variant" TYPE "enum__products_v_blocks_gallery_variant" USING "variant"::text::"enum__products_v_blocks_gallery_variant";
          ALTER TABLE "_products_v_blocks_gallery" ALTER COLUMN "variant" SET DEFAULT 'scrollable';
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_blocks_gallery' AND column_name = 'variant') THEN
          ALTER TABLE "_products_v_blocks_gallery" ADD COLUMN "variant" "enum__products_v_blocks_gallery_variant" DEFAULT 'scrollable';
        END IF;
      END IF;

      -- Constraints
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_newsletter_subscription') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_newsletter_subscription_image_id_media_id_fk') THEN
          ALTER TABLE "pages_blocks_newsletter_subscription" ADD CONSTRAINT "pages_blocks_newsletter_subscription_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_newsletter_subscription_parent_id_fk') THEN
          ALTER TABLE "pages_blocks_newsletter_subscription" ADD CONSTRAINT "pages_blocks_newsletter_subscription_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
        END IF;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_newsletter_subscription') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_newsletter_subscription_image_id_media_id_fk') THEN
          ALTER TABLE "_pages_v_blocks_newsletter_subscription" ADD CONSTRAINT "_pages_v_blocks_newsletter_subscription_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_newsletter_subscription_parent_id_fk') THEN
          ALTER TABLE "_pages_v_blocks_newsletter_subscription" ADD CONSTRAINT "_pages_v_blocks_newsletter_subscription_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
        END IF;
      END IF;

      -- Cleanup old types if they exist
      DROP TYPE IF EXISTS "public"."enum_pages_blocks_gallery_type";
      DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_gallery_type";
      DROP TYPE IF EXISTS "public"."enum_products_blocks_gallery_type";
      DROP TYPE IF EXISTS "public"."enum__products_v_blocks_gallery_type";
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- DOWN migration intentionally left empty to prevent accidental data loss.
  `)
}
