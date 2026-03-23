import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Create new enums safely
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_manifesto_promo_theme" AS ENUM('brand', 'dark', 'light');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_manifesto_promo_theme" AS ENUM('brand', 'dark', 'light');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- Create tables safely
  CREATE TABLE IF NOT EXISTS "pages_blocks_manifesto_promo" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "background_image_id" integer,
    "theme" "enum_pages_blocks_manifesto_promo_theme" DEFAULT 'brand',
    "title" jsonb,
    "description" jsonb,
    "cta_type" "link_type" DEFAULT 'reference',
    "cta_new_tab" boolean,
    "cta_url" varchar,
    "cta_label" varchar,
    "cta_appearance" "link_appearance" DEFAULT 'default',
    "block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_manifesto_promo" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "background_image_id" integer,
    "theme" "enum__pages_v_blocks_manifesto_promo_theme" DEFAULT 'brand',
    "title" jsonb,
    "description" jsonb,
    "cta_type" "link_type" DEFAULT 'reference',
    "cta_new_tab" boolean,
    "cta_url" varchar,
    "cta_label" varchar,
    "cta_appearance" "link_appearance" DEFAULT 'default',
    "_uuid" varchar,
    "block_name" varchar
  );

  -- Add constraints safely
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_manifesto_promo" ADD CONSTRAINT "pages_blocks_manifesto_promo_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "pages_blocks_manifesto_promo" ADD CONSTRAINT "pages_blocks_manifesto_promo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD CONSTRAINT "_pages_v_blocks_manifesto_promo_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD CONSTRAINT "_pages_v_blocks_manifesto_promo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  -- Create indexes safely
  CREATE INDEX IF NOT EXISTS "pages_blocks_manifesto_promo_order_idx" ON "pages_blocks_manifesto_promo" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_manifesto_promo_parent_id_idx" ON "pages_blocks_manifesto_promo" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_manifesto_promo_path_idx" ON "pages_blocks_manifesto_promo" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_manifesto_promo_background_image_idx" ON "pages_blocks_manifesto_promo" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_manifesto_promo_order_idx" ON "_pages_v_blocks_manifesto_promo" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_manifesto_promo_parent_id_idx" ON "_pages_v_blocks_manifesto_promo" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_manifesto_promo_path_idx" ON "_pages_v_blocks_manifesto_promo" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_manifesto_promo_background_image_idx" ON "_pages_v_blocks_manifesto_promo" USING btree ("background_image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_manifesto_promo" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_manifesto_promo" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_manifesto_promo_theme";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_manifesto_promo_theme";
  `)
}
