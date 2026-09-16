import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { dbSchema } from './schemas/DBSchema';

export const adapter = new SQLiteAdapter({
  dbName: 'gymLogAndroid',
  schema: dbSchema,
  jsi: false /* enable if Platform.OS === 'ios' */,
});
