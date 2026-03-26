import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'footer_logo_id_media_id_fk') THEN
        ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "footer" DROP CONSTRAINT IF EXISTS "footer_logo_id_media_id_fk";
    ALTER TABLE "footer" DROP COLUMN IF EXISTS "logo_id";
  `)
}
