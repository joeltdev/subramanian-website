import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_section_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum_pages_blocks_content_section_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_section_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_section_variant" AS ENUM('splitImage', 'overlayFeatures', 'wideImageCta', 'textCta', 'centeredGrid');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_items_icon" AS ENUM('Activity', 'BarChart', 'Bolt', 'ChartBarIncreasing', 'CheckCircle', 'Cloud', 'Code', 'Cpu', 'Database', 'Fingerprint', 'Globe', 'IdCard', 'Layers', 'Lock', 'Map', 'MessageCircle', 'Pencil', 'RefreshCw', 'Rocket', 'Settings', 'Settings2', 'Shield', 'Sparkles', 'Star', 'Users', 'Zap');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_section_variant" AS ENUM('splitImage', 'overlayFeatures', 'wideImageCta', 'textCta', 'centeredGrid');
  CREATE TABLE "pages_blocks_content_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_content_section_items_icon",
  	"rich_text" jsonb
  );
  
  CREATE TABLE "pages_blocks_content_section_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_content_section_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_section_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_content_section_variant" DEFAULT 'splitImage',
  	"intro" jsonb,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"image_id" integer,
  	"quote" jsonb,
  	"quote_author" varchar,
  	"quote_logo_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_section_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_content_section_items_icon",
  	"rich_text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_section_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_content_section_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_section_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_content_section_variant" DEFAULT 'splitImage',
  	"intro" jsonb,
  	"image_dark_id" integer,
  	"image_light_id" integer,
  	"image_id" integer,
  	"quote" jsonb,
  	"quote_author" varchar,
  	"quote_logo_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_content_section_items" ADD CONSTRAINT "pages_blocks_content_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section_links" ADD CONSTRAINT "pages_blocks_content_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_quote_logo_id_media_id_fk" FOREIGN KEY ("quote_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_section" ADD CONSTRAINT "pages_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section_items" ADD CONSTRAINT "_pages_v_blocks_content_section_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section_links" ADD CONSTRAINT "_pages_v_blocks_content_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_image_dark_id_media_id_fk" FOREIGN KEY ("image_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_image_light_id_media_id_fk" FOREIGN KEY ("image_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_quote_logo_id_media_id_fk" FOREIGN KEY ("quote_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_section" ADD CONSTRAINT "_pages_v_blocks_content_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_section_items_order_idx" ON "pages_blocks_content_section_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_section_items_parent_id_idx" ON "pages_blocks_content_section_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_section_links_order_idx" ON "pages_blocks_content_section_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_section_links_parent_id_idx" ON "pages_blocks_content_section_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_section_order_idx" ON "pages_blocks_content_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_section_parent_id_idx" ON "pages_blocks_content_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_section_path_idx" ON "pages_blocks_content_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_section_image_dark_idx" ON "pages_blocks_content_section" USING btree ("image_dark_id");
  CREATE INDEX "pages_blocks_content_section_image_light_idx" ON "pages_blocks_content_section" USING btree ("image_light_id");
  CREATE INDEX "pages_blocks_content_section_image_idx" ON "pages_blocks_content_section" USING btree ("image_id");
  CREATE INDEX "pages_blocks_content_section_quote_logo_idx" ON "pages_blocks_content_section" USING btree ("quote_logo_id");
  CREATE INDEX "_pages_v_blocks_content_section_items_order_idx" ON "_pages_v_blocks_content_section_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_section_items_parent_id_idx" ON "_pages_v_blocks_content_section_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_section_links_order_idx" ON "_pages_v_blocks_content_section_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_section_links_parent_id_idx" ON "_pages_v_blocks_content_section_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_section_order_idx" ON "_pages_v_blocks_content_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_section_parent_id_idx" ON "_pages_v_blocks_content_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_section_path_idx" ON "_pages_v_blocks_content_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_section_image_dark_idx" ON "_pages_v_blocks_content_section" USING btree ("image_dark_id");
  CREATE INDEX "_pages_v_blocks_content_section_image_light_idx" ON "_pages_v_blocks_content_section" USING btree ("image_light_id");
  CREATE INDEX "_pages_v_blocks_content_section_image_idx" ON "_pages_v_blocks_content_section" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_content_section_quote_logo_idx" ON "_pages_v_blocks_content_section" USING btree ("quote_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_content_section_items" CASCADE;
  DROP TABLE "pages_blocks_content_section_links" CASCADE;
  DROP TABLE "pages_blocks_content_section" CASCADE;
  DROP TABLE "_pages_v_blocks_content_section_items" CASCADE;
  DROP TABLE "_pages_v_blocks_content_section_links" CASCADE;
  DROP TABLE "_pages_v_blocks_content_section" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_content_section_items_icon";
  DROP TYPE "public"."enum_pages_blocks_content_section_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_section_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_section_variant";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_section_variant";`)
}
