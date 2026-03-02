import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_theme_settings_primary_color_preset" AS ENUM(
      'oklch(68.5% 0.169 237.32)',
      'oklch(58.8% 0.158 241.97)',
      'oklch(55% 0.05 240)',
      'oklch(55% 0.15 165)',
      'oklch(60% 0.2 10)'
    );

    CREATE TYPE "public"."enum_theme_settings_radius_preset" AS ENUM(
      '0',
      '0.25rem',
      '0.5rem',
      '1rem'
    );

    CREATE TABLE "theme_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "primary_color_preset" "enum_theme_settings_primary_color_preset",
      "enable_custom_primary" boolean,
      "custom_primary_light" varchar,
      "custom_primary_dark" varchar,
      "radius_preset" "enum_theme_settings_radius_preset",
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "theme_settings" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_theme_settings_primary_color_preset";
    DROP TYPE IF EXISTS "public"."enum_theme_settings_radius_preset";
  `)
}
