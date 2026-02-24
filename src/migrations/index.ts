import * as migration_20260223_091443 from './20260223_091443';
import * as migration_20260224_113958 from './20260224_113958';
import * as migration_20260224_124202 from './20260224_124202';
import * as migration_20260224_132352 from './20260224_132352';
import * as migration_20260224_155555 from './20260224_155555';

export const migrations = [
  {
    up: migration_20260223_091443.up,
    down: migration_20260223_091443.down,
    name: '20260223_091443',
  },
  {
    up: migration_20260224_113958.up,
    down: migration_20260224_113958.down,
    name: '20260224_113958',
  },
  {
    up: migration_20260224_124202.up,
    down: migration_20260224_124202.down,
    name: '20260224_124202',
  },
  {
    up: migration_20260224_132352.up,
    down: migration_20260224_132352.down,
    name: '20260224_132352',
  },
  {
    up: migration_20260224_155555.up,
    down: migration_20260224_155555.down,
    name: '20260224_155555'
  },
];
