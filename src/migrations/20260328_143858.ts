import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Drop the orphaned poster_bento tables that are causing crashes
    DROP TABLE IF EXISTS "pages_blocks_poster_bento_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_poster_bento" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_poster_bento_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_poster_bento" CASCADE;
    
    -- Drop the associated enum types
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_poster_bento_items_aspect_ratio";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_poster_bento_items_aspect_ratio";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // This is a cleanup migration, no easy way to restore dropped data without knowing the schema perfectly
  // but since the block was removed from code, we don't want these tables back anyway.
}
