import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Block table (live pages)
    CREATE TABLE "pages_blocks_youtube" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar NOT NULL,
      "title" varchar,
      "block_name" varchar
    );

    -- Block table (page versions)
    CREATE TABLE "_pages_v_blocks_youtube" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar NOT NULL,
      "title" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- FK: block -> pages
    ALTER TABLE "pages_blocks_youtube"
      ADD CONSTRAINT "pages_blocks_youtube_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version block -> _pages_v
    ALTER TABLE "_pages_v_blocks_youtube"
      ADD CONSTRAINT "_pages_v_blocks_youtube_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes
    CREATE INDEX "pages_blocks_youtube_order_idx"
      ON "pages_blocks_youtube" USING btree ("_order");
    CREATE INDEX "pages_blocks_youtube_parent_id_idx"
      ON "pages_blocks_youtube" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_youtube_path_idx"
      ON "pages_blocks_youtube" USING btree ("_path");

    CREATE INDEX "_pages_v_blocks_youtube_order_idx"
      ON "_pages_v_blocks_youtube" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_youtube_parent_id_idx"
      ON "_pages_v_blocks_youtube" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_youtube_path_idx"
      ON "_pages_v_blocks_youtube" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_youtube"
      DROP CONSTRAINT IF EXISTS "pages_blocks_youtube_parent_id_fk";
    ALTER TABLE "_pages_v_blocks_youtube"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_youtube_parent_id_fk";

    DROP TABLE IF EXISTS "pages_blocks_youtube" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_youtube" CASCADE;
  `)
}

