import * as migration_20260223_091443 from './20260223_091443';
import * as migration_20260224_113958 from './20260224_113958';

export const migrations = [
  {
    up: migration_20260223_091443.up,
    down: migration_20260223_091443.down,
    name: '20260223_091443',
  },
  {
    up: migration_20260224_113958.up,
    down: migration_20260224_113958.down,
    name: '20260224_113958'
  },
];
