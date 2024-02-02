import {
    RxCollection,
    RxJsonSchema,
    RxDocument,
  } from 'rxdb';
import { WeightAndReps } from '../../../model/Category';

export type ExerciseUnitType = {
    id: string;
    exerciseName: string;
    date: string;
    weightAndReps?: WeightAndReps[];
}
export const ExerciseUnitSchema: RxJsonSchema<ExerciseUnitType> = {
    version: 0,
    primaryKey: {
        key: 'id',
        fields: [
            'exerciseName',
            'date'
        ],
        separator: '|'
    },
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 1000
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