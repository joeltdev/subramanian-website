import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_manifesto" ADD COLUMN "link_title" varchar DEFAULT 'Download PDF';
  ALTER TABLE "_pages_v_blocks_manifesto" ADD COLUMN "link_title" varchar DEFAULT 'Download PDF';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_manifesto" DROP COLUMN "link_title";
  ALTER TABLE "_pages_v_blocks_manifesto" DROP COLUMN "link_title";`)
}
