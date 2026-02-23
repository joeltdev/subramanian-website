import * as migration_20260223_091443 from './20260223_091443';

export const migrations = [
  {
    up: migration_20260223_091443.up,
    down: migration_20260223_091443.down,
    name: '20260223_091443'
  },
];
