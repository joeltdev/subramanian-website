import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "pages_blocks_stats_stats" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "rich_text" jsonb
    );

    CREATE TABLE "pages_blocks_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_stats_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "rich_text" jsonb,
      "_uuid" varchar
    );

    CREATE TABLE "_pages_v_blocks_stats" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    ALTER TABLE "pages_blocks_stats_stats"
      ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_stats"
      ADD CONSTRAINT "pages_blocks_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_stats_stats"
      ADD CONSTRAINT "_pages_v_blocks_stats_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_stats"
      ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
    CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
    CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_stats_stats_order_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_stats_stats_parent_id_idx" ON "_pages_v_blocks_stats_stats" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_stats" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_stats" CASCADE;
  `)
}
