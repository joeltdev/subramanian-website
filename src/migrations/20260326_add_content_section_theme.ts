import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
     CREATE TYPE "public"."enum_pages_blocks_content_section_theme" AS ENUM('brand', 'dark', 'light');
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "pages_blocks_content_section" ADD COLUMN IF NOT EXISTS "theme" "enum_pages_blocks_content_section_theme" DEFAULT 'brand';
    ALTER TABLE "_pages_v_blocks_content_section" ADD COLUMN IF NOT EXISTS "theme" "enum_pages_blocks_content_section_theme" DEFAULT 'brand';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "theme";
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "theme";
  `)
}
