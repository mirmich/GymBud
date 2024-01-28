import {
    RxDatabase,
    RxCollection,
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxDocument,
  } from 'rxdb';
import { WeightAndReps } from '../../model/Category';


export type CategoryDocType = {
    id: string;
    name: string;
    exercises: string[];
}

export const categorySchema:RxJsonSchema<CategoryDocType> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100 // <- the primary key must have set maxLength
        },
        name: {
            type: 'string'
        },
        exercises: {
            type: 'array'
        }
    },
    required: ['id', 'name']
} as const;

export type CategoryDocument = RxDocument<CategoryDocType>;
export type CategoryCollection = RxCollection<CategoryDocType>;

export type ExerciseUnitType = {
    id: string;
    exerciseName: string;
    date: string;
    weightAndReps?: WeightAndReps[];
}
export const ExerciseUnitSchema: RxJsonSchema<ExerciseUnitType> = {
    version: 0,
    primaryKey: {
        // where should the composed string be stored
        key: 'id',
        // fields that will be used to create the composed key
        fields: [
            'exerciseName',
            'date'
        ],
        // separator which is used to concat the fields values.
        separator: '|'
    },
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 1000 // <- the primary key must have set maxLength
        },
        exerciseName: {
            type: 'string',
            maxLength: 1000
        },
        date: {
            type: 'string',
            maxLength: 100
        },
        weightAndReps: {
            type: 'array'
        }
    },
    required: ['id','exerciseName', 'date']
};

export type ExerciseUnitDocument = RxDocument<ExerciseUnitType>;
export type ExerciseUnitCollection = RxCollection<ExerciseUnitType>;

export type MyDatabaseCollections = {
    categories: CategoryCollection
    exercises: ExerciseUnitCollection
}
export type MyDatabase = RxDatabase<MyDatabaseCollections>;


// export type ExerciseDocType = {
//     id: string;
//     name: string;
//     category: string;
// }

// export type ExerciseDocument = RxDocument<CategoryDocType>;