import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Live block table
    ALTER TABLE "pages_blocks_media_cards"
      ADD COLUMN IF NOT EXISTS "background_media_id" integer;

    ALTER TABLE "pages_blocks_media_cards"
      ADD CONSTRAINT "pages_blocks_media_cards_background_media_id_media_id_fk"
      FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "pages_blocks_media_cards_background_media_idx"
      ON "pages_blocks_media_cards" USING btree ("background_media_id");

    -- Versioned block table
    ALTER TABLE "_pages_v_blocks_media_cards"
      ADD COLUMN IF NOT EXISTS "background_media_id" integer;

    ALTER TABLE "_pages_v_blocks_media_cards"
      ADD CONSTRAINT "_pages_v_blocks_media_cards_background_media_id_media_id_fk"
      FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_media_cards_background_media_idx"
      ON "_pages_v_blocks_media_cards" USING btree ("background_media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Live block table
    DROP INDEX IF EXISTS "pages_blocks_media_cards_background_media_idx";

    ALTER TABLE "pages_blocks_media_cards"
      DROP CONSTRAINT IF EXISTS "pages_blocks_media_cards_background_media_id_media_id_fk";

    ALTER TABLE "pages_blocks_media_cards"
      DROP COLUMN IF EXISTS "background_media_id";

    -- Versioned block table
    DROP INDEX IF EXISTS "_pages_v_blocks_media_cards_background_media_idx";

    ALTER TABLE "_pages_v_blocks_media_cards"
      DROP CONSTRAINT IF EXISTS "_pages_v_blocks_media_cards_background_media_id_media_id_fk";

    ALTER TABLE "_pages_v_blocks_media_cards"
      DROP COLUMN IF EXISTS "background_media_id";
  `)
}
