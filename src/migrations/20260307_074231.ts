import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: Ensure products parent tables exist. These may already exist from a prior fix
  // migration (20260306_fix_products_v_blocks_v3), so we use IF NOT EXISTS.
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "products_blocks_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "intro" jsonb,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_products_v_blocks_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "intro" jsonb,
    "_uuid" varchar,
    "block_name" varchar
  );`)

  // Step 2: Create new *_items child tables (renamed from *_testimonials)
  await db.execute(sql`
  CREATE TABLE "pages_blocks_testimonials_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "rich_text" jsonb,
    "author" varchar,
    "role" varchar,
    "avatar_id" integer
  );

  CREATE TABLE "_pages_v_blocks_testimonials_items" (
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

  CREATE TABLE "products_blocks_testimonials_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "rich_text" jsonb,
    "author" varchar,
    "role" varchar,
    "avatar_id" integer
  );

  CREATE TABLE "_products_v_blocks_testimonials_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "rich_text" jsonb,
    "author" varchar,
    "role" varchar,
    "avatar_id" integer,
    "_uuid" varchar
  );`)

  // Step 3: Migrate data from old *_testimonials child tables to new *_items tables.
  // Pages tables always exist; products tables may or may not — use DO $$ for safety.
  await db.execute(sql`
  INSERT INTO "pages_blocks_testimonials_items"
    ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id")
  SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id"
  FROM "pages_blocks_testimonials_testimonials";

  INSERT INTO "_pages_v_blocks_testimonials_items"
    ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid")
  SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid"
  FROM "_pages_v_blocks_testimonials_testimonials";

  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products_blocks_testimonials_testimonials') THEN
      INSERT INTO "products_blocks_testimonials_items"
        ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id")
      SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id"
      FROM "products_blocks_testimonials_testimonials";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_products_v_blocks_testimonials_testimonials') THEN
      INSERT INTO "_products_v_blocks_testimonials_items"
        ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid")
      SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid"
      FROM "_products_v_blocks_testimonials_testimonials";
    END IF;
  END $$;`)

  await db.execute(sql`
  SELECT setval(
    pg_get_serial_sequence('"_pages_v_blocks_testimonials_items"', 'id'),
    COALESCE((SELECT MAX(id) FROM "_pages_v_blocks_testimonials_items"), 1)
  );`)

  // Step 4: Drop old *_testimonials child tables (use IF EXISTS for safety)
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE IF EXISTS "products_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE IF EXISTS "_products_v_blocks_testimonials_testimonials" CASCADE;`)

  // Step 5: Add FK constraints and indexes for new child tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_testimonials_items" ADD CONSTRAINT "products_blocks_testimonials_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_testimonials_items" ADD CONSTRAINT "products_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_testimonials_items" ADD CONSTRAINT "products_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_testimonials_items" ADD CONSTRAINT "_products_v_blocks_testimonials_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_testimonials_items" ADD CONSTRAINT "_products_v_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_testimonials_items" ADD CONSTRAINT "_products_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_logo_idx" ON "pages_blocks_testimonials_items" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_testimonials_items_avatar_idx" ON "pages_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_logo_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_avatar_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "products_blocks_testimonials_items_order_idx" ON "products_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "products_blocks_testimonials_items_parent_id_idx" ON "products_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_testimonials_items_logo_idx" ON "products_blocks_testimonials_items" USING btree ("logo_id");
  CREATE INDEX "products_blocks_testimonials_items_avatar_idx" ON "products_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "_products_v_blocks_testimonials_items_order_idx" ON "_products_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_testimonials_items_parent_id_idx" ON "_products_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_testimonials_items_logo_idx" ON "_products_v_blocks_testimonials_items" USING btree ("logo_id");
  CREATE INDEX "_products_v_blocks_testimonials_items_avatar_idx" ON "_products_v_blocks_testimonials_items" USING btree ("avatar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Restore pages old child tables and migrate data back
  await db.execute(sql`
  CREATE TABLE "pages_blocks_testimonials_testimonials" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "rich_text" jsonb,
    "author" varchar,
    "role" varchar,
    "avatar_id" integer
  );

  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
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

  INSERT INTO "pages_blocks_testimonials_testimonials"
    ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id")
  SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id"
  FROM "pages_blocks_testimonials_items";

  INSERT INTO "_pages_v_blocks_testimonials_testimonials"
    ("_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid")
  SELECT "_order", "_parent_id", "id", "logo_id", "rich_text", "author", "role", "avatar_id", "_uuid"
  FROM "_pages_v_blocks_testimonials_items";

  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_logo_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_logo_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_avatar_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("avatar_id");`)

  // Drop all *_items tables and the products parent tables (which were created by up())
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE IF EXISTS "products_blocks_testimonials_items" CASCADE;
  DROP TABLE IF EXISTS "_products_v_blocks_testimonials_items" CASCADE;
  DROP TABLE IF EXISTS "products_blocks_testimonials" CASCADE;
  DROP TABLE IF EXISTS "_products_v_blocks_testimonials" CASCADE;`)
}
