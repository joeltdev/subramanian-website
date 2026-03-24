import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_pages_blocks_home_slider_items_overlay_color" AS ENUM('black', 'brand');
  
  ALTER TABLE "pages_blocks_home_slider_items" ADD COLUMN "overlay_color" "public"."enum_pages_blocks_home_slider_items_overlay_color" DEFAULT 'black';
  ALTER TABLE "pages_blocks_home_slider_items" ADD COLUMN "overlay_opacity" numeric DEFAULT 50;
  
  ALTER TABLE "_pages_v_blocks_home_slider_items" ADD COLUMN "overlay_color" "public"."enum_pages_blocks_home_slider_items_overlay_color" DEFAULT 'black';
  ALTER TABLE "_pages_v_blocks_home_slider_items" ADD COLUMN "overlay_opacity" numeric DEFAULT 50;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_home_slider_items" DROP COLUMN IF EXISTS "overlay_color";
  ALTER TABLE "pages_blocks_home_slider_items" DROP COLUMN IF EXISTS "overlay_opacity";
  
  ALTER TABLE "_pages_v_blocks_home_slider_items" DROP COLUMN IF EXISTS "overlay_color";
  ALTER TABLE "_pages_v_blocks_home_slider_items" DROP COLUMN IF EXISTS "overlay_opacity";
  
  DROP TYPE "public"."enum_pages_blocks_home_slider_items_overlay_color";
  `)
}
