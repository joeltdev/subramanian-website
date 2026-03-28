import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Clean up orphaned layout references to the old block type safely
  DO $$ BEGIN
    DELETE FROM "pages_layout" WHERE "block_type" = 'vinodHero';
  EXCEPTION WHEN undefined_table THEN
    -- Table doesn't exist yet in fresh migration, ignore
    NULL;
  END $$;

  DO $$ BEGIN
    DELETE FROM "_pages_v_layout" WHERE "block_type" = 'vinodHero';
  EXCEPTION WHEN undefined_table THEN
    -- Table doesn't exist yet in fresh migration, ignore
    NULL;
  END $$;

  -- Clean up everything related to the old blocks
  DROP TABLE IF EXISTS "pages_blocks_vinod_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_vinod_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_vinod_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_vinod_hero" CASCADE;
  
  DROP TABLE IF EXISTS "pages_blocks_politician_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_politician_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_politician_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_politician_hero" CASCADE;

  -- Create fresh types
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_politician_hero_social_links_platform";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_politician_hero_social_links_platform";
  CREATE TYPE "public"."enum_pages_blocks_politician_hero_social_links_platform" AS ENUM('facebook', 'instagram', 'twitter', 'youtube');
  CREATE TYPE "public"."enum__pages_v_blocks_politician_hero_social_links_platform" AS ENUM('facebook', 'instagram', 'twitter', 'youtube');

  -- Create Main Block Table
  CREATE TABLE "pages_blocks_politician_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"media_id" integer,
  	"button_label" varchar DEFAULT 'View Manifesto',
  	"manifesto_page_id" integer,
  	"block_name" varchar
  );

  -- Create Version Block Table
  CREATE TABLE "_pages_v_blocks_politician_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"media_id" integer,
  	"button_label" varchar DEFAULT 'View Manifesto',
  	"manifesto_page_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  -- Create Social Links Tables
  CREATE TABLE "pages_blocks_politician_hero_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_politician_hero_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );

  CREATE TABLE "_pages_v_blocks_politician_hero_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__pages_v_blocks_politician_hero_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );

  -- Add Foreign Keys
  ALTER TABLE "pages_blocks_politician_hero" ADD CONSTRAINT "pages_blocks_politician_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_politician_hero" ADD CONSTRAINT "pages_blocks_politician_hero_manifesto_page_id_pages_id_fk" FOREIGN KEY ("manifesto_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_politician_hero" ADD CONSTRAINT "pages_blocks_politician_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "_pages_v_blocks_politician_hero" ADD CONSTRAINT "_pages_v_blocks_politician_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_politician_hero" ADD CONSTRAINT "_pages_v_blocks_politician_hero_manifesto_page_id_pages_id_fk" FOREIGN KEY ("manifesto_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_politician_hero" ADD CONSTRAINT "_pages_v_blocks_politician_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "pages_blocks_politician_hero_social_links" ADD CONSTRAINT "pages_blocks_politician_hero_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_politician_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_politician_hero_social_links" ADD CONSTRAINT "_pages_v_blocks_politician_hero_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_politician_hero"("id") ON DELETE cascade ON UPDATE no action;

  -- Indexes
  CREATE INDEX "pages_blocks_politician_hero_order_idx" ON "pages_blocks_politician_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_politician_hero_parent_id_idx" ON "pages_blocks_politician_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_politician_hero_path_idx" ON "pages_blocks_politician_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_politician_hero_media_idx" ON "pages_blocks_politician_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_politician_hero_manifesto_page_idx" ON "pages_blocks_politician_hero" USING btree ("manifesto_page_id");

  CREATE INDEX "_pages_v_blocks_politician_hero_order_idx" ON "_pages_v_blocks_politician_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_politician_hero_parent_id_idx" ON "_pages_v_blocks_politician_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_politician_hero_path_idx" ON "_pages_v_blocks_politician_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_politician_hero_media_idx" ON "_pages_v_blocks_politician_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_politician_hero_manifesto_page_idx" ON "_pages_v_blocks_politician_hero" USING btree ("manifesto_page_id");
  
  CREATE INDEX "pages_blocks_politician_hero_social_links_order_idx" ON "pages_blocks_politician_hero_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_politician_hero_social_links_parent_id_idx" ON "pages_blocks_politician_hero_social_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_politician_hero_social_links_order_idx" ON "_pages_v_blocks_politician_hero_social_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_politician_hero_social_links_parent_id_idx" ON "_pages_v_blocks_politician_hero_social_links" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_politician_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_politician_hero_social_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_politician_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_politician_hero" CASCADE;
  `)
}
