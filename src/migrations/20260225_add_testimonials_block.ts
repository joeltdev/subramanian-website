import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "pages_blocks_testimonials_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "logo_id" integer,
      "rich_text" jsonb,
      "author" varchar,
      "role" varchar,
      "avatar_id" integer
    );

    CREATE TABLE "pages_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "block_name" varchar
    );

    CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "logo_id" integer,
      "rich_text" jsonb,
      "author" varchar,
      "role" varchar,
      "avatar_id" integer,
      "_uuid" varchar
    );

    CREATE TABLE "_pages_v_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    ALTER TABLE "pages_blocks_testimonials_testimonials"
      ADD CONSTRAINT "pages_blocks_testimonials_testimonials_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_testimonials_testimonials"
      ADD CONSTRAINT "pages_blocks_testimonials_testimonials_avatar_id_media_id_fk"
      FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "pages_blocks_testimonials_testimonials"
      ADD CONSTRAINT "pages_blocks_testimonials_testimonials_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "pages_blocks_testimonials"
      ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_testimonials_testimonials"
      ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_testimonials_testimonials"
      ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_avatar_id_media_id_fk"
      FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_testimonials_testimonials"
      ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_pages_v_blocks_testimonials"
      ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_testimonials_testimonials_order_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_order");
    CREATE INDEX "pages_blocks_testimonials_testimonials_parent_id_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("_parent_id");
    CREATE INDEX "pages_blocks_testimonials_testimonials_logo_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("logo_id");
    CREATE INDEX "pages_blocks_testimonials_testimonials_avatar_idx" ON "pages_blocks_testimonials_testimonials" USING btree ("avatar_id");
    CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
    CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_testimonials_testimonials" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_testimonials" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_testimonials" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_testimonials" CASCADE;
  `)
}
