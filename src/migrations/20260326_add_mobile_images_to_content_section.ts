import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add columns to pages_blocks_content_section table
    ALTER TABLE "pages_blocks_content_section" ADD COLUMN IF NOT EXISTS "image_dark_mobile_id" integer;
    ALTER TABLE "pages_blocks_content_section" ADD COLUMN IF NOT EXISTS "image_light_mobile_id" integer;

    -- Add constraints to pages_blocks_content_section table
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_image_dark_mobile_id_media_id_fk" 
      FOREIGN KEY ("image_dark_mobile_id") REFERENCES "public"."media"("id") 
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_image_light_mobile_id_media_id_fk" 
      FOREIGN KEY ("image_light_mobile_id") REFERENCES "public"."media"("id") 
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Create indexes for pages_blocks_content_section table
    CREATE INDEX IF NOT EXISTS "pages_blocks_content_section_image_dark_mobile_idx" ON "pages_blocks_content_section" USING btree ("image_dark_mobile_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_content_section_image_light_mobile_idx" ON "pages_blocks_content_section" USING btree ("image_light_mobile_id");

    -- Add columns to _pages_v_blocks_content_section table (versions)
    ALTER TABLE "_pages_v_blocks_content_section" ADD COLUMN IF NOT EXISTS "image_dark_mobile_id" integer;
    ALTER TABLE "_pages_v_blocks_content_section" ADD COLUMN IF NOT EXISTS "image_light_mobile_id" integer;

    -- Add constraints to _pages_v_blocks_content_section table
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_image_dark_mobile_id_media_id_fk" 
      FOREIGN KEY ("image_dark_mobile_id") REFERENCES "public"."media"("id") 
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_image_light_mobile_id_media_id_fk" 
      FOREIGN KEY ("image_light_mobile_id") REFERENCES "public"."media"("id") 
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Create indexes for _pages_v_blocks_content_section table
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_section_image_dark_mobile_idx" ON "_pages_v_blocks_content_section" USING btree ("image_dark_mobile_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_section_image_light_mobile_idx" ON "_pages_v_blocks_content_section" USING btree ("image_light_mobile_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Drop indexes for _pages_v_blocks_content_section table
    DROP INDEX IF EXISTS "_pages_v_blocks_content_section_image_light_mobile_idx";
    DROP INDEX IF EXISTS "_pages_v_blocks_content_section_image_dark_mobile_idx";

    -- Drop constraints for _pages_v_blocks_content_section table
    ALTER TABLE "_pages_v_blocks_content_section" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_content_section_image_light_mobile_id_media_id_fk";
    ALTER TABLE "_pages_v_blocks_content_section" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_content_section_image_dark_mobile_id_media_id_fk";

    -- Drop columns for _pages_v_blocks_content_section table
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "image_light_mobile_id";
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "image_dark_mobile_id";

    -- Drop indexes for pages_blocks_content_section table
    DROP INDEX IF EXISTS "pages_blocks_content_section_image_light_mobile_idx";
    DROP INDEX IF EXISTS "pages_blocks_content_section_image_dark_mobile_idx";

    -- Drop constraints for pages_blocks_content_section table
    ALTER TABLE "pages_blocks_content_section" DROP CONSTRAINT IF EXISTS "pages_blocks_content_section_image_light_mobile_id_media_id_fk";
    ALTER TABLE "pages_blocks_content_section" DROP CONSTRAINT IF EXISTS "pages_blocks_content_section_image_dark_mobile_id_media_id_fk";

    -- Drop columns for pages_blocks_content_section table
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "image_light_mobile_id";
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "image_dark_mobile_id";
  `)
}
