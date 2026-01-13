import * as migration_20260105_211103_init_schema from './20260105_211103_init_schema';
import * as migration_20260113_161334_add_multi_collection_relation from './20260113_161334_add_multi_collection_relation';

export const migrations = [
  {
    up: migration_20260105_211103_init_schema.up,
    down: migration_20260105_211103_init_schema.down,
    name: '20260105_211103_init_schema',
  },
  {
    up: migration_20260113_161334_add_multi_collection_relation.up,
    down: migration_20260113_161334_add_multi_collection_relation.down,
    name: '20260113_161334_add_multi_collection_relation'
  },
];
