import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Rename old tables if they exist to preserve data
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_manifesto') THEN
      ALTER TABLE "pages_blocks_manifesto" RENAME TO "pages_blocks_tharoor_manifesto";
    END IF;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_blocks_manifesto_links') THEN
      ALTER TABLE "pages_blocks_manifesto_links" RENAME TO "pages_blocks_tharoor_manifesto_manifesto_links";
    END IF;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_manifesto') THEN
      ALTER TABLE "_pages_v_blocks_manifesto" RENAME TO "_pages_v_blocks_tharoor_manifesto";
    END IF;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_pages_v_blocks_manifesto_links') THEN
      ALTER TABLE "_pages_v_blocks_manifesto_links" RENAME TO "_pages_v_blocks_tharoor_manifesto_manifesto_links";
    END IF;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  -- Add manifesto to hero enums if they exist
  DO $$ BEGIN
    ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'manifesto';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'manifesto';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- Create new enums
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_tharoor_manifesto_variant" AS ENUM('textLeft', 'textRight');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_tharoor_manifesto_theme" AS ENUM('light', 'dark', 'brand');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_tharoor_manifesto_variant" AS ENUM('textLeft', 'textRight');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_tharoor_manifesto_theme" AS ENUM('light', 'dark', 'brand');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- Ensure columns exist after rename (if tables were renamed) or create tables (if fresh)
  CREATE TABLE IF NOT EXISTS "pages_blocks_tharoor_manifesto_manifesto_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE IF NOT EXISTS "pages_blocks_tharoor_manifesto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_tharoor_manifesto_variant" DEFAULT 'textLeft',
  	"theme" "enum_pages_blocks_tharoor_manifesto_theme" DEFAULT 'light',
  	"intro" jsonb,
  	"content" jsonb,
  	"image_id" integer,
  	"link_title" varchar DEFAULT 'Download PDF',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_manifesto_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_tharoor_manifesto_variant" DEFAULT 'textLeft',
  	"theme" "enum__pages_v_blocks_tharoor_manifesto_theme" DEFAULT 'light',
  	"intro" jsonb,
  	"content" jsonb,
  	"image_id" integer,
  	"link_title" varchar DEFAULT 'Download PDF',
  	"_uuid" varchar,
  	"block_name" varchar
  );

  -- Add constraints
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_tharoor_manifesto_manifesto_links" ADD CONSTRAINT "pages_blocks_tharoor_manifesto_manifesto_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tharoor_manifesto"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "pages_blocks_tharoor_manifesto" ADD CONSTRAINT "pages_blocks_tharoor_manifesto_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "pages_blocks_tharoor_manifesto" ADD CONSTRAINT "pages_blocks_tharoor_manifesto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_tharoor_manifesto_manifesto_links" ADD CONSTRAINT "_pages_v_blocks_tharoor_manifesto_manifesto_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tharoor_manifesto"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_tharoor_manifesto" ADD CONSTRAINT "_pages_v_blocks_tharoor_manifesto_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_tharoor_manifesto" ADD CONSTRAINT "_pages_v_blocks_tharoor_manifesto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  -- Create indexes
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_manifesto_links_order_idx" ON "pages_blocks_tharoor_manifesto_manifesto_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_manifesto_links_parent_id_idx" ON "pages_blocks_tharoor_manifesto_manifesto_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_order_idx" ON "pages_blocks_tharoor_manifesto" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_parent_id_idx" ON "pages_blocks_tharoor_manifesto" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_path_idx" ON "pages_blocks_tharoor_manifesto" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_tharoor_manifesto_image_idx" ON "pages_blocks_tharoor_manifesto" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_manifesto_links_order_idx" ON "_pages_v_blocks_tharoor_manifesto_manifesto_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_manifesto_links_parent_id_idx" ON "_pages_v_blocks_tharoor_manifesto_manifesto_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_order_idx" ON "_pages_v_blocks_tharoor_manifesto" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_parent_id_idx" ON "_pages_v_blocks_tharoor_manifesto" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_path_idx" ON "_pages_v_blocks_tharoor_manifesto" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_tharoor_manifesto_image_idx" ON "_pages_v_blocks_tharoor_manifesto" USING btree ("image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_tharoor_manifesto_manifesto_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_tharoor_manifesto" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tharoor_manifesto_manifesto_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_tharoor_manifesto" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_tharoor_manifesto_variant";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_tharoor_manifesto_theme";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_tharoor_manifesto_variant";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_tharoor_manifesto_theme";
  `)
}
