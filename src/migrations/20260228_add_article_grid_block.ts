import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Block table (live pages)
    CREATE TABLE "pages_blocks_article_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "populate_by" varchar DEFAULT 'collection',
      "block_name" varchar
    );

    -- Block table (page versions)
    CREATE TABLE "_pages_v_blocks_article_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "populate_by" varchar DEFAULT 'collection',
      "_uuid" varchar,
      "block_name" varchar
    );

    -- FK: block -> pages
    ALTER TABLE "pages_blocks_article_grid"
      ADD CONSTRAINT "pages_blocks_article_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version block -> _pages_v
    ALTER TABLE "_pages_v_blocks_article_grid"
      ADD CONSTRAINT "_pages_v_blocks_article_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "pages_blocks_article_grid_order_idx"
      ON "pages_blocks_article_grid" USING btree ("_order");
    CREATE INDEX "pages_blocks_article_grid_parent_id_idx"
      ON "pages_blocks_article_grid" USING btree ("_parent_id");

    CREATE INDEX "_pages_v_blocks_article_grid_order_idx"
      ON "_pages_v_blocks_article_grid" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_article_grid_parent_id_idx"
      ON "_pages_v_blocks_article_grid" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_article_grid"
      DROP CONSTRAINT IF EXISTS "pages_blocks_article_grid_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_article_grid"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_article_grid_parent_id_fk";

    DROP TABLE IF EXISTS "pages_blocks_article_grid" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_article_grid" CASCADE;
  `)
}
