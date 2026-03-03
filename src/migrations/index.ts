import * as migration_20260225_054934 from './20260225_054934';
import * as migration_20260225_102735 from './20260225_102735';
import * as migration_20260225_add_header_tabs from './20260225_add_header_tabs';
import * as migration_20260225_add_header_logo from './20260225_add_header_logo';
import * as migration_20260225_add_stats_block from './20260225_add_stats_block';
import * as migration_20260225_add_testimonials_block from './20260225_add_testimonials_block';
import * as migration_20260226_update_footer_global from './20260226_update_footer_global';
import * as migration_20260226_add_hero_section2_bg_fields from './20260226_add_hero_section2_bg_fields';
import * as migration_20260226_add_hover_highlights_block from './20260226_add_hover_highlights_block';
import * as migration_20260228_add_case_studies_highlight_block from './20260228_add_case_studies_highlight_block';
import * as migration_20260228_add_feature_cards_media_variant from './20260228_add_feature_cards_media_variant';
import * as migration_20260228_add_article_grid_block from './20260228_add_article_grid_block';
import * as migration_20260228_add_media_cards_block from './20260228_add_media_cards_block';
import * as migration_20260301_remove_nav_items_default_style from './20260301_remove_nav_items_default_style';
import * as migration_20260301_remove_nav_items_featured_style from './20260301_remove_nav_items_featured_style';
import * as migration_20260302_add_theme_settings_global from './20260302_add_theme_settings_global';
import * as migration_20260303_add_media_cards_background_media from './20260303_add_media_cards_background_media';
import * as migration_20260303_add_youtube_block from './20260303_add_youtube_block';
import * as migration_20260304_add_parallax_showcase_block from './20260304_add_parallax_showcase_block';
import * as migration_20260304_add_gallery_block from './20260304_add_gallery_block';

export const migrations = [
  {
    up: migration_20260225_054934.up,
    down: migration_20260225_054934.down,
    name: '20260225_054934',
  },
  {
    up: migration_20260225_102735.up,
    down: migration_20260225_102735.down,
    name: '20260225_102735',
  },
  {
    up: migration_20260225_add_header_tabs.up,
    down: migration_20260225_add_header_tabs.down,
    name: '20260225_add_header_tabs',
  },
  {
    up: migration_20260225_add_header_logo.up,
    down: migration_20260225_add_header_logo.down,
    name: '20260225_add_header_logo',
  },
  {
    up: migration_20260225_add_stats_block.up,
    down: migration_20260225_add_stats_block.down,
    name: '20260225_add_stats_block',
  },
  {
    up: migration_20260225_add_testimonials_block.up,
    down: migration_20260225_add_testimonials_block.down,
    name: '20260225_add_testimonials_block',
  },
  {
    up: migration_20260226_update_footer_global.up,
    down: migration_20260226_update_footer_global.down,
    name: '20260226_update_footer_global',
  },
  {
    up: migration_20260226_add_hero_section2_bg_fields.up,
    down: migration_20260226_add_hero_section2_bg_fields.down,
    name: '20260226_add_hero_section2_bg_fields',
  },
  {
    up: migration_20260226_add_hover_highlights_block.up,
    down: migration_20260226_add_hover_highlights_block.down,
    name: '20260226_add_hover_highlights_block',
  },
  {
    up: migration_20260228_add_case_studies_highlight_block.up,
    down: migration_20260228_add_case_studies_highlight_block.down,
    name: '20260228_add_case_studies_highlight_block',
  },
  {
    up: migration_20260228_add_feature_cards_media_variant.up,
    down: migration_20260228_add_feature_cards_media_variant.down,
    name: '20260228_add_feature_cards_media_variant',
  },
  {
    up: migration_20260228_add_article_grid_block.up,
    down: migration_20260228_add_article_grid_block.down,
    name: '20260228_add_article_grid_block',
  },
  {
    up: migration_20260228_add_media_cards_block.up,
    down: migration_20260228_add_media_cards_block.down,
    name: '20260228_add_media_cards_block',
  },
  {
    up: migration_20260301_remove_nav_items_default_style.up,
    down: migration_20260301_remove_nav_items_default_style.down,
    name: '20260301_remove_nav_items_default_style',
  },
  {
    up: migration_20260301_remove_nav_items_featured_style.up,
    down: migration_20260301_remove_nav_items_featured_style.down,
    name: '20260301_remove_nav_items_featured_style',
  },
  {
    up: migration_20260302_add_theme_settings_global.up,
    down: migration_20260302_add_theme_settings_global.down,
    name: '20260302_add_theme_settings_global',
  },
  {
    up: migration_20260303_add_media_cards_background_media.up,
    down: migration_20260303_add_media_cards_background_media.down,
    name: '20260303_add_media_cards_background_media',
  },
  {
    up: migration_20260303_add_youtube_block.up,
    down: migration_20260303_add_youtube_block.down,
    name: '20260303_add_youtube_block',
  },
  {
    up: migration_20260304_add_parallax_showcase_block.up,
    down: migration_20260304_add_parallax_showcase_block.down,
    name: '20260304_add_parallax_showcase_block',
  },
  {
    up: migration_20260304_add_gallery_block.up,
    down: migration_20260304_add_gallery_block.down,
    name: '20260304_add_gallery_block',
  },
];
