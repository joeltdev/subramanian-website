import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_features_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_features_type" AS ENUM('section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section11', 'section12');
  CREATE TYPE "public"."enum__pages_v_blocks_features_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_type" AS ENUM('section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section11', 'section12');
  CREATE TABLE "pages_blocks_features_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_panel_items_icon",
  	"label" varchar,
  	"heading" varchar
  );
  
  CREATE TABLE "pages_blocks_features_image_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_dark_id" integer,
  	"image_light_id" integer
  );
  
  CREATE TABLE "pages_blocks_features_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_accordion_items_icon",
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_features_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_features_panel_items_icon",
  	"label" varchar,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_image_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_features_accordion_items_icon",
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_features_features_icon" USING "icon"::"public"."enum_pages_blocks_features_features_icon";
  ALTER TABLE "_pages_v_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_features_features_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  ALTER TABLE "_pages_v_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_features_features_icon" USING "icon"::"public"."enum__pages_v_blocks_features_features_icon";
  ALTER TABLE "pages_blocks_features" ADD COLUMN "type" "enum_pages_blocks_features_type" DEFAULT 'section6';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "stat" varchar;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "type" "enum__pages_v_blocks_features_type" DEFAULT 'section6';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "stat" varchar;
  ALTER TABLE "pages_blocks_features_panel_items" ADD CONSTRAINT "pages_blocks_features_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_accordion_items" ADD CONSTRAINT "pages_blocks_features_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_accordion_items" ADD CONSTRAINT "pages_blocks_features_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_panel_items" ADD CONSTRAINT "_pages_v_blocks_features_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_accordion_items" ADD CONSTRAINT "_pages_v_blocks_features_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_accordion_items" ADD CONSTRAINT "_pages_v_blocks_features_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_features_panel_items_order_idx" ON "pages_blocks_features_panel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_panel_items_parent_id_idx" ON "pages_blocks_features_panel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_image_panels_order_idx" ON "pages_blocks_features_image_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_image_panels_parent_id_idx" ON "pages_blocks_features_image_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_image_panels_image_dark_idx" ON "pages_blocks_features_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_features_image_panels_image_light_idx" ON "pages_blocks_features_image_panels" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_features_accordion_items_order_idx" ON "pages_blocks_features_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_accordion_items_parent_id_idx" ON "pages_blocks_features_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_accordion_items_image_idx" ON "pages_blocks_features_accordion_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_features_panel_items_order_idx" ON "_pages_v_blocks_features_panel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_panel_items_parent_id_idx" ON "_pages_v_blocks_features_panel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_order_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_image_panels_parent_id_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_image_dark_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_image_light_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_order_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_parent_id_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_image_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_features_panel_items" CASCADE;
  DROP TABLE "pages_blocks_features_image_panels" CASCADE;
  DROP TABLE "pages_blocks_features_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_panel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_image_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_features_accordion_items" CASCADE;
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('Zap', 'Cpu', 'Lock', 'Sparkles', 'Shield', 'Globe', 'Layers', 'Code', 'Settings', 'Star', 'Rocket', 'BarChart', 'Cloud', 'Database', 'Users', 'RefreshCw', 'CheckCircle', 'Bolt');
  ALTER TABLE "pages_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_features_features_icon" USING "icon"::"public"."enum_pages_blocks_features_features_icon";
  ALTER TABLE "_pages_v_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_features_features_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_icon" AS ENUM('Zap', 'Cpu', 'Lock', 'Sparkles', 'Shield', 'Globe', 'Layers', 'Code', 'Settings', 'Star', 'Rocket', 'BarChart', 'Cloud', 'Database', 'Users', 'RefreshCw', 'CheckCircle', 'Bolt');
  ALTER TABLE "_pages_v_blocks_features_features" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_features_features_icon" USING "icon"::"public"."enum__pages_v_blocks_features_features_icon";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "type";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "stat";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "type";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "stat";
  DROP TYPE "public"."enum_pages_blocks_features_panel_items_icon";
  DROP TYPE "public"."enum_pages_blocks_features_accordion_items_icon";
  DROP TYPE "public"."enum_pages_blocks_features_type";
  DROP TYPE "public"."enum__pages_v_blocks_features_panel_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_accordion_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_type";`)
}
