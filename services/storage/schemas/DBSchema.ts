import { appSchema, tableSchema } from '@nozbe/watermelondb';
export const dbSchema = appSchema({
    version: 7,
    tables: [
      tableSchema({
        name: 'category',
        columns: [
          { name: 'name', type: 'string', isIndexed: true }, // indexed means that we can search the column based on the title
          { name: 'exercises', type: 'string' },
        ],
      }),
      tableSchema({
        name: 'exerciseUnit',
        columns: [
          { name: 'exerciseName', type: 'string', isIndexed: true },
          { name: 'date', type: 'string', isIndexed: true },
          { name: 'weightAndReps', type: 'string' },
        ],
      }),
      tableSchema({
        name: 'personalRecord',
        columns: [
          { name: 'exerciseName', type: 'string', isIndexed: true },
          { name: 'date', type: 'string', isIndexed: true },
          { name: 'weight', type: 'number' },
          { name: 'reps', type: 'number' },
        ],
      }),
    ],
  });