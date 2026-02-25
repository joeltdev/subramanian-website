import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "logo_id" integer;

    ALTER TABLE "header"
      ADD CONSTRAINT "header_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "header_logo_idx" ON "header" USING btree ("logo_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "header_logo_idx";

    ALTER TABLE "header" DROP CONSTRAINT IF EXISTS "header_logo_id_media_id_fk";

    ALTER TABLE "header" DROP COLUMN IF EXISTS "logo_id";
  `)
}
