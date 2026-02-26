import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- pages table
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_background_video_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_background_image_id" integer;

    ALTER TABLE "pages"
      ADD CONSTRAINT "pages_hero_background_video_id_media_id_fk"
      FOREIGN KEY ("hero_background_video_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages"
      ADD CONSTRAINT "pages_hero_background_image_id_media_id_fk"
      FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "pages_hero_hero_background_video_idx"
      ON "pages" USING btree ("hero_background_video_id");

    CREATE INDEX IF NOT EXISTS "pages_hero_hero_background_image_idx"
      ON "pages" USING btree ("hero_background_image_id");

    -- _pages_v table (versions)
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_background_video_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_background_image_id" integer;

    ALTER TABLE "_pages_v"
      ADD CONSTRAINT "_pages_v_version_hero_background_video_id_media_id_fk"
      FOREIGN KEY ("version_hero_background_video_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v"
      ADD CONSTRAINT "_pages_v_version_hero_background_image_id_media_id_fk"
      FOREIGN KEY ("version_hero_background_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_background_video_idx"
      ON "_pages_v" USING btree ("version_hero_background_video_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_version_hero_background_image_idx"
      ON "_pages_v" USING btree ("version_hero_background_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_background_image_idx";
    DROP INDEX IF EXISTS "_pages_v_version_hero_version_hero_background_video_idx";

    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_background_image_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_background_video_id_media_id_fk";

    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_background_image_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_background_video_id";

    DROP INDEX IF EXISTS "pages_hero_hero_background_image_idx";
    DROP INDEX IF EXISTS "pages_hero_hero_background_video_idx";

    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_background_image_id_media_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_background_video_id_media_id_fk";

    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_background_image_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_background_video_id";
  `)
}
