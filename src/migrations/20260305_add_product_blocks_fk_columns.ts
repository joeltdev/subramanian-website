import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds missing FK columns to product block tables.
 * The previous migration (add_product_blocks) created the tables without
 * these relationship columns. This migration patches them.
 *
 * Uses IF NOT EXISTS so it is safe to run on fresh DBs too (where
 * add_product_blocks already includes these columns).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_product_hero"
      ADD COLUMN IF NOT EXISTS "product_id" integer;
    ALTER TABLE "_pages_v_blocks_product_hero"
      ADD COLUMN IF NOT EXISTS "product_id" integer;

    ALTER TABLE "pages_blocks_product_listing"
      ADD COLUMN IF NOT EXISTS "category_id" integer;
    ALTER TABLE "_pages_v_blocks_product_listing"
      ADD COLUMN IF NOT EXISTS "category_id" integer;
    ALTER TABLE "products_blocks_product_listing"
      ADD COLUMN IF NOT EXISTS "category_id" integer;
    ALTER TABLE "_products_v_blocks_product_listing"
      ADD COLUMN IF NOT EXISTS "category_id" integer;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_product_hero_product_id_products_id_fk') THEN
        ALTER TABLE "pages_blocks_product_hero"
          ADD CONSTRAINT "pages_blocks_product_hero_product_id_products_id_fk"
          FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_product_hero_product_id_products_id_fk') THEN
        ALTER TABLE "_pages_v_blocks_product_hero"
          ADD CONSTRAINT "_pages_v_blocks_product_hero_product_id_products_id_fk"
          FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_product_listing_category_id_product_categories_id_fk') THEN
        ALTER TABLE "pages_blocks_product_listing"
          ADD CONSTRAINT "pages_blocks_product_listing_category_id_product_categories_id_fk"
          FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_product_listing_category_id_product_categories_id_fk') THEN
        ALTER TABLE "_pages_v_blocks_product_listing"
          ADD CONSTRAINT "_pages_v_blocks_product_listing_category_id_product_categories_id_fk"
          FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_blocks_product_listing_category_id_product_categories_id_fk') THEN
        ALTER TABLE "products_blocks_product_listing"
          ADD CONSTRAINT "products_blocks_product_listing_category_id_product_categories_id_fk"
          FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_products_v_blocks_product_listing_category_id_product_categories_id_fk') THEN
        ALTER TABLE "_products_v_blocks_product_listing"
          ADD CONSTRAINT "_products_v_blocks_product_listing_category_id_product_categories_id_fk"
          FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_product_hero_product_idx"
      ON "pages_blocks_product_hero" USING btree ("product_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_hero_product_idx"
      ON "_pages_v_blocks_product_hero" USING btree ("product_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_product_listing_category_idx"
      ON "pages_blocks_product_listing" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_product_listing_category_idx"
      ON "_pages_v_blocks_product_listing" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "products_blocks_product_listing_category_idx"
      ON "products_blocks_product_listing" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "_products_v_blocks_product_listing_category_idx"
      ON "_products_v_blocks_product_listing" USING btree ("category_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_product_hero"
      DROP CONSTRAINT IF EXISTS "pages_blocks_product_hero_product_id_products_id_fk",
      DROP COLUMN IF EXISTS "product_id";

    ALTER TABLE "_pages_v_blocks_product_hero"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_product_hero_product_id_products_id_fk",
      DROP COLUMN IF EXISTS "product_id";

    ALTER TABLE "pages_blocks_product_listing"
      DROP CONSTRAINT IF EXISTS "pages_blocks_product_listing_category_id_product_categories_id_fk",
      DROP COLUMN IF EXISTS "category_id";

    ALTER TABLE "_pages_v_blocks_product_listing"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_product_listing_category_id_product_categories_id_fk",
      DROP COLUMN IF EXISTS "category_id";

    ALTER TABLE "products_blocks_product_listing"
      DROP CONSTRAINT IF EXISTS "products_blocks_product_listing_category_id_product_categories_id_fk",
      DROP COLUMN IF EXISTS "category_id";

    ALTER TABLE "_products_v_blocks_product_listing"
      DROP CONSTRAINT IF EXISTS "_products_v_blocks_product_listing_category_id_product_categories_id_fk",
      DROP COLUMN IF EXISTS "category_id";
  `)
}
