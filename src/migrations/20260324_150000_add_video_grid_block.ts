import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Block table (live pages)
    CREATE TABLE "pages_blocks_video_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "block_name" varchar
    );

    -- Videos array (live pages)
    CREATE TABLE "pages_blocks_video_grid_videos" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar NOT NULL,
      "title" varchar NOT NULL
    );

    -- Block table (page versions)
    CREATE TABLE "_pages_v_blocks_video_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Videos array (page versions)
    CREATE TABLE "_pages_v_blocks_video_grid_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "url" varchar NOT NULL,
      "title" varchar NOT NULL
    );

    -- FK: block -> pages
    ALTER TABLE "pages_blocks_video_grid"
      ADD CONSTRAINT "pages_blocks_video_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: videos -> block
    ALTER TABLE "pages_blocks_video_grid_videos"
      ADD CONSTRAINT "pages_blocks_video_grid_videos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_grid"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version block -> _pages_v
    ALTER TABLE "_pages_v_blocks_video_grid"
      ADD CONSTRAINT "_pages_v_blocks_video_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version videos -> version block
    ALTER TABLE "_pages_v_blocks_video_grid_videos"
      ADD CONSTRAINT "_pages_v_blocks_video_grid_videos_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_grid"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes (live)
    CREATE INDEX "pages_blocks_video_grid_order_idx" ON "pages_blocks_video_grid" USING btree ("_order");
    CREATE INDEX "pages_blocks_video_grid_parent_id_idx" ON "pages_blocks_video_grid" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_video_grid_path_idx" ON "pages_blocks_video_grid" USING btree ("_path");
    CREATE INDEX "pages_blocks_video_grid_videos_order_idx" ON "pages_blocks_video_grid_videos" USING btree ("_order");
    CREATE INDEX "pages_blocks_video_grid_videos_parent_id_idx" ON "pages_blocks_video_grid_videos" USING btree ("_parent_id");

    -- Indexes (versions)
    CREATE INDEX "_pages_v_blocks_video_grid_order_idx" ON "_pages_v_blocks_video_grid" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_video_grid_parent_id_idx" ON "_pages_v_blocks_video_grid" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_video_grid_path_idx" ON "_pages_v_blocks_video_grid" USING btree ("_path");
    CREATE INDEX "_pages_v_blocks_video_grid_videos_order_idx" ON "_pages_v_blocks_video_grid_videos" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_video_grid_videos_parent_id_idx" ON "_pages_v_blocks_video_grid_videos" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_video_grid_videos" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_video_grid" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_video_grid_videos" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_video_grid" CASCADE;
  `)
}
