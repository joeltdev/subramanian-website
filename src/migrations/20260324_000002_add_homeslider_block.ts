import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_home_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_n_a" jsonb,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_home_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tab_label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_home_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_n_a" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_home_slider_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"tab_label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer NOT NULL
  );

  DO $$ BEGIN
   ALTER TABLE "pages_blocks_home_slider" ADD CONSTRAINT "pages_blocks_home_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "pages_blocks_home_slider_items" ADD CONSTRAINT "pages_blocks_home_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_slider"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "pages_blocks_home_slider_items" ADD CONSTRAINT "pages_blocks_home_slider_items_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_home_slider" ADD CONSTRAINT "_pages_v_blocks_home_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_home_slider_items" ADD CONSTRAINT "_pages_v_blocks_home_slider_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_slider"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "_pages_v_blocks_home_slider_items" ADD CONSTRAINT "_pages_v_blocks_home_slider_items_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  EXCEPTION
   WHEN others THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_order_idx" ON "pages_blocks_home_slider" ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_parent_id_idx" ON "pages_blocks_home_slider" ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_path_idx" ON "pages_blocks_home_slider" ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_items_order_idx" ON "pages_blocks_home_slider_items" ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_items_parent_id_idx" ON "pages_blocks_home_slider_items" ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_home_slider_items_image_id_idx" ON "pages_blocks_home_slider_items" ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_order_idx" ON "_pages_v_blocks_home_slider" ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_parent_id_idx" ON "_pages_v_blocks_home_slider" ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_path_idx" ON "_pages_v_blocks_home_slider" ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_items_order_idx" ON "_pages_v_blocks_home_slider_items" ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_items_parent_id_idx" ON "_pages_v_blocks_home_slider_items" ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_home_slider_items_image_id_idx" ON "_pages_v_blocks_home_slider_items" ("image_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_home_slider_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_home_slider" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_home_slider_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_home_slider" CASCADE;
  `)
}
