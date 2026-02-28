import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Case Studies collection table
    CREATE TABLE "case_studies" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "intro_content" jsonb,
      "industry" varchar,
      "use_case" varchar,
      "featured_image_id" integer,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    -- Block tables (live pages)
    CREATE TABLE "pages_blocks_case_studies_highlight" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "block_name" varchar
    );

    -- Block tables (page versions)
    CREATE TABLE "_pages_v_blocks_case_studies_highlight" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "intro" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Add case_studies_id to relationship tables
    ALTER TABLE "pages_rels" ADD COLUMN "case_studies_id" integer;
    ALTER TABLE "_pages_v_rels" ADD COLUMN "case_studies_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;

    -- FK: case_studies.featured_image_id -> media
    ALTER TABLE "case_studies"
      ADD CONSTRAINT "case_studies_featured_image_id_media_id_fk"
      FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    -- FK: block -> pages
    ALTER TABLE "pages_blocks_case_studies_highlight"
      ADD CONSTRAINT "pages_blocks_case_studies_highlight_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: version block -> _pages_v
    ALTER TABLE "_pages_v_blocks_case_studies_highlight"
      ADD CONSTRAINT "_pages_v_blocks_case_studies_highlight_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: pages_rels.case_studies_id -> case_studies
    ALTER TABLE "pages_rels"
      ADD CONSTRAINT "pages_rels_case_studies_fk"
      FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: _pages_v_rels.case_studies_id -> case_studies
    ALTER TABLE "_pages_v_rels"
      ADD CONSTRAINT "_pages_v_rels_case_studies_fk"
      FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id")
      ON DELETE cascade ON UPDATE no action;

    -- FK: payload_locked_documents_rels.case_studies_id -> case_studies
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk"
      FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id")
      ON DELETE cascade ON UPDATE no action;

    -- Indexes: case_studies
    CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
    CREATE INDEX "case_studies_featured_image_idx" ON "case_studies" USING btree ("featured_image_id");
    CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
    CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");

    -- Indexes: block tables
    CREATE INDEX "pages_blocks_case_studies_highlight_order_idx" ON "pages_blocks_case_studies_highlight" USING btree ("_order");
    CREATE INDEX "pages_blocks_case_studies_highlight_parent_id_idx" ON "pages_blocks_case_studies_highlight" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_blocks_case_studies_highlight_order_idx" ON "_pages_v_blocks_case_studies_highlight" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_case_studies_highlight_parent_id_idx" ON "_pages_v_blocks_case_studies_highlight" USING btree ("_parent_id");

    -- Indexes: new rels columns
    CREATE INDEX "pages_rels_case_studies_id_idx" ON "pages_rels" USING btree ("case_studies_id");
    CREATE INDEX "_pages_v_rels_case_studies_id_idx" ON "_pages_v_rels" USING btree ("case_studies_id");
    CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_case_studies_fk";
    ALTER TABLE "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_case_studies_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_case_studies_fk";

    ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "case_studies_id";
    ALTER TABLE "_pages_v_rels" DROP COLUMN IF EXISTS "case_studies_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "case_studies_id";

    DROP TABLE IF EXISTS "pages_blocks_case_studies_highlight" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_case_studies_highlight" CASCADE;
    DROP TABLE IF EXISTS "case_studies" CASCADE;
  `)
}
