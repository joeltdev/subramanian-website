import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ProductHero block (pages only)
    CREATE TABLE "pages_blocks_product_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "helpline" varchar,
      "technical_support_email" varchar,
      "knowledge_base_url" varchar,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_product_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "helpline" varchar,
      "technical_support_email" varchar,
      "knowledge_base_url" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- ProductListing block (pages)
    CREATE TABLE "pages_blocks_product_listing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "products_per_page" numeric,
      "show_pagination" boolean,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_product_listing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "products_per_page" numeric,
      "show_pagination" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- ProductListing block (products collection)
    CREATE TABLE "products_blocks_product_listing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "products_per_page" numeric,
      "show_pagination" boolean,
      "block_name" varchar
    );

    CREATE TABLE "_products_v_blocks_product_listing" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "products_per_page" numeric,
      "show_pagination" boolean,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- FK constraints
    ALTER TABLE "pages_blocks_product_hero"
      ADD CONSTRAINT "pages_blocks_product_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_product_hero"
      ADD CONSTRAINT "_pages_v_blocks_product_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_product_listing"
      ADD CONSTRAINT "pages_blocks_product_listing_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_product_listing"
      ADD CONSTRAINT "_pages_v_blocks_product_listing_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "products_blocks_product_listing"
      ADD CONSTRAINT "products_blocks_product_listing_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_products_v_blocks_product_listing"
      ADD CONSTRAINT "_products_v_blocks_product_listing_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "pages_blocks_product_hero_order_idx" ON "pages_blocks_product_hero" USING btree ("_order");
    CREATE INDEX "pages_blocks_product_hero_parent_id_idx" ON "pages_blocks_product_hero" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_product_hero_order_idx" ON "_pages_v_blocks_product_hero" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_product_hero_parent_id_idx" ON "_pages_v_blocks_product_hero" USING btree ("_parent_id");

    CREATE INDEX "pages_blocks_product_listing_order_idx" ON "pages_blocks_product_listing" USING btree ("_order");
    CREATE INDEX "pages_blocks_product_listing_parent_id_idx" ON "pages_blocks_product_listing" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_product_listing_order_idx" ON "_pages_v_blocks_product_listing" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_product_listing_parent_id_idx" ON "_pages_v_blocks_product_listing" USING btree ("_parent_id");

    CREATE INDEX "products_blocks_product_listing_order_idx" ON "products_blocks_product_listing" USING btree ("_order");
    CREATE INDEX "products_blocks_product_listing_parent_id_idx" ON "products_blocks_product_listing" USING btree ("_parent_id");
    CREATE INDEX "_products_v_blocks_product_listing_order_idx" ON "_products_v_blocks_product_listing" USING btree ("_order");
    CREATE INDEX "_products_v_blocks_product_listing_parent_id_idx" ON "_products_v_blocks_product_listing" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_product_hero" DROP CONSTRAINT IF EXISTS "pages_blocks_product_hero_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_product_hero" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_product_hero_parent_id_fk";
    ALTER TABLE "pages_blocks_product_listing" DROP CONSTRAINT IF EXISTS "pages_blocks_product_listing_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_product_listing" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_product_listing_parent_id_fk";
    ALTER TABLE "products_blocks_product_listing" DROP CONSTRAINT IF EXISTS "products_blocks_product_listing_parent_id_fk";
    ALTER TABLE "_products_v_blocks_product_listing" DROP CONSTRAINT IF EXISTS "_products_v_blocks_product_listing_parent_id_fk";

    DROP TABLE IF EXISTS "pages_blocks_product_hero" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_product_hero" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_product_listing" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_product_listing" CASCADE;
    DROP TABLE IF EXISTS "products_blocks_product_listing" CASCADE;
    DROP TABLE IF EXISTS "_products_v_blocks_product_listing" CASCADE;
  `)
}
