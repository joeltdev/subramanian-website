import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_poster_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" jsonb,
  	"subheadline" varchar,
  	"highlight_color" varchar DEFAULT '#B59449',
  	"subject_image_id" integer,
  	"texture_overlay" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_poster_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"headline" jsonb,
  	"subheadline" varchar,
  	"highlight_color" varchar DEFAULT '#B59449',
  	"subject_image_id" integer,
  	"texture_overlay" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_poster_hero" ADD CONSTRAINT "pages_blocks_poster_hero_subject_image_id_media_id_fk" FOREIGN KEY ("subject_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_poster_hero" ADD CONSTRAINT "pages_blocks_poster_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD CONSTRAINT "_pages_v_blocks_poster_hero_subject_image_id_media_id_fk" FOREIGN KEY ("subject_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_poster_hero" ADD CONSTRAINT "_pages_v_blocks_poster_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_poster_hero_order_idx" ON "pages_blocks_poster_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_poster_hero_parent_id_idx" ON "pages_blocks_poster_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_poster_hero_path_idx" ON "pages_blocks_poster_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_poster_hero_subject_image_idx" ON "pages_blocks_poster_hero" USING btree ("subject_image_id");
  CREATE INDEX "_pages_v_blocks_poster_hero_order_idx" ON "_pages_v_blocks_poster_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_poster_hero_parent_id_idx" ON "_pages_v_blocks_poster_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_poster_hero_path_idx" ON "_pages_v_blocks_poster_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_poster_hero_subject_image_idx" ON "_pages_v_blocks_poster_hero" USING btree ("subject_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "pages_blocks_poster_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_poster_hero" CASCADE;`)
}
