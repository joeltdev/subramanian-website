import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_poster_hero" ADD COLUMN "link_type" "link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_poster_hero" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_poster_hero" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_poster_hero" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_poster_hero" ADD COLUMN "link_appearance" "link_appearance" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD COLUMN "link_type" "link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD COLUMN "link_appearance" "link_appearance" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_poster_hero" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_poster_hero" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_poster_hero" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_poster_hero" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_poster_hero" DROP COLUMN "link_appearance";
  ALTER TABLE "_pages_v_blocks_poster_hero" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_poster_hero" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_poster_hero" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_poster_hero" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_poster_hero" DROP COLUMN "link_appearance";`)
}
