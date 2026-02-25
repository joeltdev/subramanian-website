import * as migration_20260225_054934 from './20260225_054934';
import * as migration_20260225_102735 from './20260225_102735';
import * as migration_20260225_add_header_tabs from './20260225_add_header_tabs';
import * as migration_20260225_add_header_logo from './20260225_add_header_logo';

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
];
