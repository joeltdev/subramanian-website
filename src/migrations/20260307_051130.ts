import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_form_block" ADD COLUMN "image_light_id" integer;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "image_dark_id" integer;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "image_light_id" integer;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "image_dark_id" integer;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_form_block_image_light_idx" ON "pages_blocks_form_block" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_form_block_image_dark_idx" ON "pages_blocks_form_block" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_form_block_image_light_idx" ON "_pages_v_blocks_form_block" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_form_block_image_dark_idx" ON "_pages_v_blocks_form_block" USING btree ("image_dark_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_form_block" DROP CONSTRAINT "pages_blocks_form_block_image_light_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_form_block" DROP CONSTRAINT "pages_blocks_form_block_image_dark_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_form_block" DROP CONSTRAINT "_pages_v_blocks_form_block_image_light_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_form_block" DROP CONSTRAINT "_pages_v_blocks_form_block_image_dark_id_media_id_fk";
  
  DROP INDEX "pages_blocks_form_block_image_light_idx";
  DROP INDEX "pages_blocks_form_block_image_dark_idx";
  DROP INDEX "_pages_v_blocks_form_block_image_light_idx";
  DROP INDEX "_pages_v_blocks_form_block_image_dark_idx";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "image_light_id";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "image_dark_id";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "image_light_id";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "image_dark_id";`)
}
