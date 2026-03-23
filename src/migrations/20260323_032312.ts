import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_promo_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_promo_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promo_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_promo_hero_links" ADD CONSTRAINT "pages_blocks_promo_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promo_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promo_hero" ADD CONSTRAINT "pages_blocks_promo_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_hero_links" ADD CONSTRAINT "_pages_v_blocks_promo_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promo_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promo_hero" ADD CONSTRAINT "_pages_v_blocks_promo_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  
  CREATE INDEX "pages_blocks_promo_hero_links_order_idx" ON "pages_blocks_promo_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_hero_links_parent_id_idx" ON "pages_blocks_promo_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_hero_order_idx" ON "pages_blocks_promo_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_promo_hero_parent_id_idx" ON "pages_blocks_promo_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promo_hero_path_idx" ON "pages_blocks_promo_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_promo_hero_links_order_idx" ON "_pages_v_blocks_promo_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_hero_links_parent_id_idx" ON "_pages_v_blocks_promo_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_hero_order_idx" ON "_pages_v_blocks_promo_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promo_hero_parent_id_idx" ON "_pages_v_blocks_promo_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promo_hero_path_idx" ON "_pages_v_blocks_promo_hero" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "pages_blocks_promo_hero_links" CASCADE;
  DROP TABLE "pages_blocks_promo_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_promo_hero" CASCADE;`)
}
