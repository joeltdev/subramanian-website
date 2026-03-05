import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- Handle pages_blocks_form_block
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = 'intro_content') THEN
        ALTER TABLE "pages_blocks_form_block" RENAME COLUMN "intro_content" TO "intro";
      ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = 'intro') THEN
        ALTER TABLE "pages_blocks_form_block" ADD COLUMN "intro" jsonb;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = 'enable_intro') THEN
        ALTER TABLE "pages_blocks_form_block" DROP COLUMN "enable_intro";
      END IF;

      -- Handle _pages_v_blocks_form_block
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = 'intro_content') THEN
        ALTER TABLE "_pages_v_blocks_form_block" RENAME COLUMN "intro_content" TO "intro";
      ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = 'intro') THEN
        ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "intro" jsonb;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = 'enable_intro') THEN
        ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "enable_intro";
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = 'intro') THEN
        ALTER TABLE "pages_blocks_form_block" RENAME COLUMN "intro" TO "intro_content";
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_blocks_form_block' AND column_name = 'enable_intro') THEN
        ALTER TABLE "pages_blocks_form_block" ADD COLUMN "enable_intro" boolean DEFAULT true;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = 'intro') THEN
        ALTER TABLE "_pages_v_blocks_form_block" RENAME COLUMN "intro" TO "intro_content";
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_blocks_form_block' AND column_name = 'enable_intro') THEN
        ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "enable_intro" boolean DEFAULT true;
      END IF;
    END
    $$;
  `)
}
