import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_poster_bento_items_aspect_ratio" AS ENUM('portrait', 'landscape');
    CREATE TYPE "public"."enum__pages_v_blocks_poster_bento_items_aspect_ratio" AS ENUM('portrait', 'landscape');

    CREATE TABLE "pages_blocks_poster_bento_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL,
      "alt_text" varchar NOT NULL,
      "aspect_ratio" "enum_pages_blocks_poster_bento_items_aspect_ratio" DEFAULT 'portrait'
    );

    CREATE TABLE "pages_blocks_poster_bento" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_poster_bento_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer NOT NULL,
      "alt_text" varchar NOT NULL,
      "aspect_ratio" "enum__pages_v_blocks_poster_bento_items_aspect_ratio" DEFAULT 'portrait',
      "_parent_path" text NOT NULL
    );

    CREATE TABLE "_pages_v_blocks_poster_bento" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "block_name" varchar
    );

    ALTER TABLE "pages_blocks_poster_bento_items" ADD CONSTRAINT "pages_blocks_poster_bento_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_poster_bento_items" ADD CONSTRAINT "pages_blocks_poster_bento_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_poster_bento"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "pages_blocks_poster_bento" ADD CONSTRAINT "pages_blocks_poster_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_poster_bento_items" ADD CONSTRAINT "_pages_v_blocks_poster_bento_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_pages_v_blocks_poster_bento_items" ADD CONSTRAINT "_pages_v_blocks_poster_bento_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_poster_bento"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_blocks_poster_bento" ADD CONSTRAINT "_pages_v_blocks_poster_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_poster_bento_items_order_idx" ON "pages_blocks_poster_bento_items" USING btree ("_order");
    CREATE INDEX "pages_blocks_poster_bento_items_parent_id_idx" ON "pages_blocks_poster_bento_items" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_poster_bento_items_image_idx" ON "pages_blocks_poster_bento_items" USING btree ("image_id");

    CREATE INDEX "pages_blocks_poster_bento_order_idx" ON "pages_blocks_poster_bento" USING btree ("_order");
    CREATE INDEX "pages_blocks_poster_bento_parent_id_idx" ON "pages_blocks_poster_bento" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_poster_bento_path_idx" ON "pages_blocks_poster_bento" USING btree ("_path");

    CREATE INDEX "_pages_v_blocks_poster_bento_items_order_idx" ON "_pages_v_blocks_poster_bento_items" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_poster_bento_items_parent_id_idx" ON "_pages_v_blocks_poster_bento_items" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_poster_bento_items_image_idx" ON "_pages_v_blocks_poster_bento_items" USING btree ("image_id");

    CREATE INDEX "_pages_v_blocks_poster_bento_order_idx" ON "_pages_v_blocks_poster_bento" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_poster_bento_parent_id_idx" ON "_pages_v_blocks_poster_bento" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_poster_bento_path_idx" ON "_pages_v_blocks_poster_bento" USING btree ("_path");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "pages_blocks_poster_bento_items" CASCADE;
    DROP TABLE "pages_blocks_poster_bento" CASCADE;
    DROP TABLE "_pages_v_blocks_poster_bento_items" CASCADE;
    DROP TABLE "_pages_v_blocks_poster_bento" CASCADE;
    DROP TYPE "public"."enum_pages_blocks_poster_bento_items_aspect_ratio";
    DROP TYPE "public"."enum__pages_v_blocks_poster_bento_items_aspect_ratio";
  `)
}
