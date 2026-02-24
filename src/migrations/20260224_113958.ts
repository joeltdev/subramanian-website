import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ----------------------------------------------------------------
  // 1. Hero column fixes on `pages`
  //    - rename hero_media_id → hero_media_preview_id (if old name exists)
  //    - add hero_badge_label (if missing)
  // ----------------------------------------------------------------
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'hero_media_id'
      ) THEN
        ALTER TABLE "pages"
          DROP CONSTRAINT IF EXISTS "pages_hero_media_id_media_id_fk";
        DROP INDEX IF EXISTS "pages_hero_hero_media_idx";
        ALTER TABLE "pages"
          RENAME COLUMN "hero_media_id" TO "hero_media_preview_id";
        ALTER TABLE "pages"
          ADD CONSTRAINT "pages_hero_media_preview_id_media_id_fk"
          FOREIGN KEY ("hero_media_preview_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
        CREATE INDEX "pages_hero_hero_media_preview_idx"
          ON "pages" USING btree ("hero_media_preview_id");
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'hero_badge_label'
      ) THEN
        ALTER TABLE "pages" ADD COLUMN "hero_badge_label" varchar;
      END IF;
    END $$;
  `)

  // ----------------------------------------------------------------
  // 2. Hero column fixes on `_pages_v`
  //    - rename version_hero_media_id → version_hero_media_preview_id
  //    - add version_hero_badge_label (if missing)
  // ----------------------------------------------------------------
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = '_pages_v' AND column_name = 'version_hero_media_id'
      ) THEN
        ALTER TABLE "_pages_v"
          DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_media_id_media_id_fk";
        DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_media_idx";
        ALTER TABLE "_pages_v"
          RENAME COLUMN "version_hero_media_id" TO "version_hero_media_preview_id";
        ALTER TABLE "_pages_v"
          ADD CONSTRAINT "_pages_v_version_hero_media_preview_id_media_id_fk"
          FOREIGN KEY ("version_hero_media_preview_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
        CREATE INDEX "_pages_v_version_hero_version_hero_media_preview_idx"
          ON "_pages_v" USING btree ("version_hero_media_preview_id");
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = '_pages_v' AND column_name = 'version_hero_badge_label'
      ) THEN
        ALTER TABLE "_pages_v" ADD COLUMN "version_hero_badge_label" varchar;
      END IF;
    END $$;
  `)

  // ----------------------------------------------------------------
  // 3. Logo Cloud block tables
  // ----------------------------------------------------------------
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_cloud_type" AS ENUM('section1', 'section3');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_type" AS ENUM('section1', 'section3');
  CREATE TABLE "pages_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer
  );

  CREATE TABLE "pages_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_logo_cloud_type" DEFAULT 'section1',
  	"heading" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_logo_cloud_type" DEFAULT 'section1',
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud" ADD CONSTRAINT "pages_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_cloud_logos_order_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_logos_parent_id_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_logos_logo_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_cloud_order_idx" ON "pages_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_parent_id_idx" ON "pages_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_path_idx" ON "pages_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_order_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_parent_id_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_logo_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_order_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_parent_id_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_path_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reverse logo cloud tables
  await db.execute(sql`
   DROP TABLE "pages_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_type";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_type";`)

  // Reverse hero column renames
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'hero_media_preview_id'
      ) THEN
        ALTER TABLE "pages"
          DROP CONSTRAINT IF EXISTS "pages_hero_media_preview_id_media_id_fk";
        DROP INDEX IF EXISTS "pages_hero_hero_media_preview_idx";
        ALTER TABLE "pages"
          RENAME COLUMN "hero_media_preview_id" TO "hero_media_id";
        ALTER TABLE "pages"
          ADD CONSTRAINT "pages_hero_media_id_media_id_fk"
          FOREIGN KEY ("hero_media_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_badge_label";

    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = '_pages_v' AND column_name = 'version_hero_media_preview_id'
      ) THEN
        ALTER TABLE "_pages_v"
          DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_media_preview_id_media_id_fk";
        DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_media_preview_idx";
        ALTER TABLE "_pages_v"
          RENAME COLUMN "version_hero_media_preview_id" TO "version_hero_media_id";
        ALTER TABLE "_pages_v"
          ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk"
          FOREIGN KEY ("version_hero_media_id")
          REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_badge_label";
  `)
}
