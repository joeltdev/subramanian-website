import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_feature_cards_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_feature_cards_variant" AS ENUM('floating', 'outlined', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_feature_showcase_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_feature_showcase_variant" AS ENUM('split', 'perspective');
  CREATE TYPE "public"."enum_pages_blocks_feature_bento_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_feature_bento_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_feature_bento_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_feature_bento_variant" AS ENUM('stats', 'metrics', 'panels', 'accordion');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_cards_variant" AS ENUM('floating', 'outlined', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_showcase_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_showcase_variant" AS ENUM('split', 'perspective');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_bento_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_bento_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_bento_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_bento_variant" AS ENUM('stats', 'metrics', 'panels', 'accordion');
  CREATE TABLE "pages_blocks_feature_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_cards_items_icon",
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_feature_cards_variant" DEFAULT 'floating',
  	"intro" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_showcase_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_showcase_items_icon",
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_feature_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_feature_showcase_variant" DEFAULT 'split',
  	"intro" jsonb,
  	"image_foreground_id" integer,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_bento_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_bento_items_icon",
  	"title" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_feature_bento_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_bento_panel_items_icon",
  	"label" varchar,
  	"heading" jsonb
  );
  
  CREATE TABLE "pages_blocks_feature_bento_image_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"image_dark_id" integer,
  	"image_light_id" integer
  );
  
  CREATE TABLE "pages_blocks_feature_bento_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_feature_bento_accordion_items_icon",
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_feature_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_feature_bento_variant" DEFAULT 'stats',
  	"stat" varchar,
  	"intro" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_cards_items_icon",
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_feature_cards_variant" DEFAULT 'floating',
  	"intro" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_showcase_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_showcase_items_icon",
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_feature_showcase_variant" DEFAULT 'split',
  	"intro" jsonb,
  	"image_foreground_id" integer,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_bento_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_bento_items_icon",
  	"title" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_bento_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_bento_panel_items_icon",
  	"label" varchar,
  	"heading" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_bento_image_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_bento_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_feature_bento_accordion_items_icon",
  	"title" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_bento" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_feature_bento_variant" DEFAULT 'stats',
  	"stat" varchar,
  	"intro" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_features_features" CASCADE;
  DROP TABLE "pages_blocks_features_panel_items" CASCADE;
  DROP TABLE "pages_blocks_features_image_panels" CASCADE;
  DROP TABLE "pages_blocks_features_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features_features" CASCADE;
  DROP TABLE "_pages_v_blocks_features_panel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_image_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_features_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  ALTER TABLE "pages_blocks_feature_cards_items" ADD CONSTRAINT "pages_blocks_feature_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_cards" ADD CONSTRAINT "pages_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase_items" ADD CONSTRAINT "pages_blocks_feature_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_image_foreground_id_media_id_fk" FOREIGN KEY ("image_foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_showcase" ADD CONSTRAINT "pages_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_items" ADD CONSTRAINT "pages_blocks_feature_bento_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_panel_items" ADD CONSTRAINT "pages_blocks_feature_bento_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_image_panels" ADD CONSTRAINT "pages_blocks_feature_bento_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_image_panels" ADD CONSTRAINT "pages_blocks_feature_bento_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_image_panels" ADD CONSTRAINT "pages_blocks_feature_bento_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_accordion_items" ADD CONSTRAINT "pages_blocks_feature_bento_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento_accordion_items" ADD CONSTRAINT "pages_blocks_feature_bento_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_bento" ADD CONSTRAINT "pages_blocks_feature_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards_items" ADD CONSTRAINT "_pages_v_blocks_feature_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_cards" ADD CONSTRAINT "_pages_v_blocks_feature_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase_items" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_image_foreground_id_media_id_fk" FOREIGN KEY ("image_foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_showcase" ADD CONSTRAINT "_pages_v_blocks_feature_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_items" ADD CONSTRAINT "_pages_v_blocks_feature_bento_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_panel_items" ADD CONSTRAINT "_pages_v_blocks_feature_bento_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" ADD CONSTRAINT "_pages_v_blocks_feature_bento_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" ADD CONSTRAINT "_pages_v_blocks_feature_bento_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_image_panels" ADD CONSTRAINT "_pages_v_blocks_feature_bento_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" ADD CONSTRAINT "_pages_v_blocks_feature_bento_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento_accordion_items" ADD CONSTRAINT "_pages_v_blocks_feature_bento_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_bento"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_bento" ADD CONSTRAINT "_pages_v_blocks_feature_bento_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_feature_cards_items_order_idx" ON "pages_blocks_feature_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_items_parent_id_idx" ON "pages_blocks_feature_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_order_idx" ON "pages_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_cards_parent_id_idx" ON "pages_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_cards_path_idx" ON "pages_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_showcase_items_order_idx" ON "pages_blocks_feature_showcase_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_showcase_items_parent_id_idx" ON "pages_blocks_feature_showcase_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_showcase_order_idx" ON "pages_blocks_feature_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_showcase_parent_id_idx" ON "pages_blocks_feature_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_showcase_path_idx" ON "pages_blocks_feature_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_showcase_image_foreground_idx" ON "pages_blocks_feature_showcase" USING btree ("image_foreground_id");
  CREATE INDEX "pages_blocks_feature_showcase_image_dark_idx" ON "pages_blocks_feature_showcase" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_feature_showcase_image_light_idx" ON "pages_blocks_feature_showcase" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_feature_bento_items_order_idx" ON "pages_blocks_feature_bento_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_bento_items_parent_id_idx" ON "pages_blocks_feature_bento_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_bento_panel_items_order_idx" ON "pages_blocks_feature_bento_panel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_bento_panel_items_parent_id_idx" ON "pages_blocks_feature_bento_panel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_bento_image_panels_order_idx" ON "pages_blocks_feature_bento_image_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_bento_image_panels_parent_id_idx" ON "pages_blocks_feature_bento_image_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_bento_image_panels_image_dark_idx" ON "pages_blocks_feature_bento_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_feature_bento_image_panels_image_light_idx" ON "pages_blocks_feature_bento_image_panels" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_feature_bento_accordion_items_order_idx" ON "pages_blocks_feature_bento_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_bento_accordion_items_parent_id_idx" ON "pages_blocks_feature_bento_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_bento_accordion_items_image_idx" ON "pages_blocks_feature_bento_accordion_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_feature_bento_order_idx" ON "pages_blocks_feature_bento" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_bento_parent_id_idx" ON "pages_blocks_feature_bento" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_bento_path_idx" ON "pages_blocks_feature_bento" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_cards_items_order_idx" ON "_pages_v_blocks_feature_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_items_parent_id_idx" ON "_pages_v_blocks_feature_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_order_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_cards_parent_id_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_cards_path_idx" ON "_pages_v_blocks_feature_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_showcase_items_order_idx" ON "_pages_v_blocks_feature_showcase_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_showcase_items_parent_id_idx" ON "_pages_v_blocks_feature_showcase_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_order_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_showcase_parent_id_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_path_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_showcase_image_foreground_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("image_foreground_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_image_dark_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_feature_showcase_image_light_idx" ON "_pages_v_blocks_feature_showcase" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_items_order_idx" ON "_pages_v_blocks_feature_bento_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_bento_items_parent_id_idx" ON "_pages_v_blocks_feature_bento_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_panel_items_order_idx" ON "_pages_v_blocks_feature_bento_panel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_bento_panel_items_parent_id_idx" ON "_pages_v_blocks_feature_bento_panel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_image_panels_order_idx" ON "_pages_v_blocks_feature_bento_image_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_bento_image_panels_parent_id_idx" ON "_pages_v_blocks_feature_bento_image_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_image_panels_image_dark_idx" ON "_pages_v_blocks_feature_bento_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_image_panels_image_light_idx" ON "_pages_v_blocks_feature_bento_image_panels" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_accordion_items_order_idx" ON "_pages_v_blocks_feature_bento_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_bento_accordion_items_parent_id_idx" ON "_pages_v_blocks_feature_bento_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_accordion_items_image_idx" ON "_pages_v_blocks_feature_bento_accordion_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_order_idx" ON "_pages_v_blocks_feature_bento" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_bento_parent_id_idx" ON "_pages_v_blocks_feature_bento" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_bento_path_idx" ON "_pages_v_blocks_feature_bento" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_features_features_icon";
  DROP TYPE "public"."enum_pages_blocks_features_panel_items_icon";
  DROP TYPE "public"."enum_pages_blocks_features_accordion_items_icon";
  DROP TYPE "public"."enum_pages_blocks_features_type";
  DROP TYPE "public"."enum__pages_v_blocks_features_features_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_panel_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_accordion_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_features_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_features_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_features_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_features_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_features_type" AS ENUM('section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section11', 'section12');
  CREATE TYPE "public"."enum__pages_v_blocks_features_features_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_panel_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_accordion_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_features_type" AS ENUM('section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section11', 'section12');
  CREATE TABLE "pages_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_features_icon",
  	"title" varchar,
  	"description" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_features_type" DEFAULT 'section6',
  	"heading" varchar,
  	"subheading" varchar,
  	"image_foreground_id" integer,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"stat" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_features_features_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
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
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_features_type" DEFAULT 'section6',
  	"heading" varchar,
  	"subheading" varchar,
  	"image_foreground_id" integer,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"stat" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_feature_cards_items" CASCADE;
  DROP TABLE "pages_blocks_feature_cards" CASCADE;
  DROP TABLE "pages_blocks_feature_showcase_items" CASCADE;
  DROP TABLE "pages_blocks_feature_showcase" CASCADE;
  DROP TABLE "pages_blocks_feature_bento_items" CASCADE;
  DROP TABLE "pages_blocks_feature_bento_panel_items" CASCADE;
  DROP TABLE "pages_blocks_feature_bento_image_panels" CASCADE;
  DROP TABLE "pages_blocks_feature_bento_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_feature_bento" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_showcase_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_bento_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_bento_panel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_bento_image_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_bento_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_bento" CASCADE;
  ALTER TABLE "pages_blocks_features_features" ADD CONSTRAINT "pages_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_panel_items" ADD CONSTRAINT "pages_blocks_features_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_image_panels" ADD CONSTRAINT "pages_blocks_features_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_accordion_items" ADD CONSTRAINT "pages_blocks_features_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_accordion_items" ADD CONSTRAINT "pages_blocks_features_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_image_foreground_id_media_id_fk" FOREIGN KEY ("image_foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_features" ADD CONSTRAINT "_pages_v_blocks_features_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_panel_items" ADD CONSTRAINT "_pages_v_blocks_features_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_image_panels" ADD CONSTRAINT "_pages_v_blocks_features_image_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_accordion_items" ADD CONSTRAINT "_pages_v_blocks_features_accordion_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_accordion_items" ADD CONSTRAINT "_pages_v_blocks_features_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_image_foreground_id_media_id_fk" FOREIGN KEY ("image_foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_features_features_order_idx" ON "pages_blocks_features_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_features_parent_id_idx" ON "pages_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_panel_items_order_idx" ON "pages_blocks_features_panel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_panel_items_parent_id_idx" ON "pages_blocks_features_panel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_image_panels_order_idx" ON "pages_blocks_features_image_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_image_panels_parent_id_idx" ON "pages_blocks_features_image_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_image_panels_image_dark_idx" ON "pages_blocks_features_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_features_image_panels_image_light_idx" ON "pages_blocks_features_image_panels" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_features_accordion_items_order_idx" ON "pages_blocks_features_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_accordion_items_parent_id_idx" ON "pages_blocks_features_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_accordion_items_image_idx" ON "pages_blocks_features_accordion_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_image_foreground_idx" ON "pages_blocks_features" USING btree ("image_foreground_id");
  CREATE INDEX "pages_blocks_features_image_dark_idx" ON "pages_blocks_features" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_features_image_light_idx" ON "pages_blocks_features" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_features_features_order_idx" ON "_pages_v_blocks_features_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_features_parent_id_idx" ON "_pages_v_blocks_features_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_panel_items_order_idx" ON "_pages_v_blocks_features_panel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_panel_items_parent_id_idx" ON "_pages_v_blocks_features_panel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_order_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_image_panels_parent_id_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_image_dark_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_features_image_panels_image_light_idx" ON "_pages_v_blocks_features_image_panels" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_order_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_parent_id_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_accordion_items_image_idx" ON "_pages_v_blocks_features_accordion_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_image_foreground_idx" ON "_pages_v_blocks_features" USING btree ("image_foreground_id");
  CREATE INDEX "_pages_v_blocks_features_image_dark_idx" ON "_pages_v_blocks_features" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_features_image_light_idx" ON "_pages_v_blocks_features" USING btree ("image_light_id");
  DROP TYPE "public"."enum_pages_blocks_feature_cards_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_cards_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_showcase_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_showcase_variant";
  DROP TYPE "public"."enum_pages_blocks_feature_bento_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_bento_panel_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_bento_accordion_items_icon";
  DROP TYPE "public"."enum_pages_blocks_feature_bento_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_cards_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_cards_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_showcase_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_showcase_variant";
  DROP TYPE "public"."enum__pages_v_blocks_feature_bento_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_bento_panel_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_bento_accordion_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_feature_bento_variant";`)
}
