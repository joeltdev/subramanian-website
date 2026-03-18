import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ 
    BEGIN 
      -- pages_rels
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages_rels' AND column_name = 'media_id') THEN
        ALTER TABLE "pages_rels" ADD COLUMN "media_id" integer;
        ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
        CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
      END IF;

      -- _pages_v_rels
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_pages_v_rels' AND column_name = 'media_id') THEN
        ALTER TABLE "_pages_v_rels" ADD COLUMN "media_id" integer;
        ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
        CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
      END IF;

      -- products_rels
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products_rels' AND column_name = 'media_id') THEN
        ALTER TABLE "products_rels" ADD COLUMN "media_id" integer;
        ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
        CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
      END IF;

      -- _products_v_rels
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_products_v_rels' AND column_name = 'media_id') THEN
        ALTER TABLE "_products_v_rels" ADD COLUMN "media_id" integer;
        ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
        CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Optional: define how to undo this if needed, 
    -- but usually adding columns is safe to leave.
  `)
}
