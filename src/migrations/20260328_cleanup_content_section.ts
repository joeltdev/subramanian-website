import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "pdf_file_id";
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "button_text";
    ALTER TABLE "pages_blocks_content_section" DROP COLUMN IF EXISTS "button_link";
    
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "pdf_file_id";
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "button_text";
    ALTER TABLE "_pages_v_blocks_content_section" DROP COLUMN IF EXISTS "button_link";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No need to restore these old columns
}
