import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { dbSchema } from './schemas/DBSchema';

export const adapter = new LokiJSAdapter({
  schema: dbSchema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'gymLogWeb', // optional db name
  onQuotaExceededError: (error) => {
    console.log(`quota exceed error: ${error}`);
  },
  onSetUpError: (error) => {
    console.log(`set up error: ${error}`);
  },
  extraIncrementalIDBOptions: {
    onDidOverwrite: () => {},
    onversionchange: () => {},
  },
});
