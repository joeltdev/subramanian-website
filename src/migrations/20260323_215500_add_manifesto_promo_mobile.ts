import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_manifesto_promo_background_position" AS ENUM('center', 'left', 'right', 'top', 'bottom');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_manifesto_promo_background_position" AS ENUM('center', 'left', 'right', 'top', 'bottom');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "pages_blocks_manifesto_promo" ADD COLUMN IF NOT EXISTS "mobile_background_image_id" integer;
  ALTER TABLE "pages_blocks_manifesto_promo" ADD COLUMN IF NOT EXISTS "background_position" "enum_pages_blocks_manifesto_promo_background_position" DEFAULT 'center';
  
  ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD COLUMN IF NOT EXISTS "mobile_background_image_id" integer;
  ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD COLUMN IF NOT EXISTS "background_position" "enum__pages_v_blocks_manifesto_promo_background_position" DEFAULT 'center';

  DO $$ BEGIN
    ALTER TABLE "pages_blocks_manifesto_promo" ADD CONSTRAINT "pages_blocks_manifesto_promo_mobile_background_image_id_media_id_fk" FOREIGN KEY ("mobile_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_manifesto_promo" ADD CONSTRAINT "_pages_v_blocks_manifesto_promo_mobile_background_image_id_media_id_fk" FOREIGN KEY ("mobile_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN others THEN null;
  END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_manifesto_promo" DROP COLUMN IF EXISTS "mobile_background_image_id";
  ALTER TABLE "pages_blocks_manifesto_promo" DROP COLUMN IF EXISTS "background_position";
  ALTER TABLE "_pages_v_blocks_manifesto_promo" DROP COLUMN IF EXISTS "mobile_background_image_id";
  ALTER TABLE "_pages_v_blocks_manifesto_promo" DROP COLUMN IF EXISTS "background_position";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_manifesto_promo_background_position";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_manifesto_promo_background_position";
  `)
}
