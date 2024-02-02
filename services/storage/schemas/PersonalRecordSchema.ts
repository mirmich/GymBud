import {
    RxCollection,
    RxJsonSchema,
    RxDocument,
  } from 'rxdb';

export type PersonalRecordType = {
    id: string;
    exerciseName: string;
    date?: string;
    weight: number;
    reps: number;
}
export const PersonalRecordSchema: RxJsonSchema<PersonalRecordType> = {
    version: 0,
    primaryKey: {
        key: 'id',
        fields: [
            'exerciseName',
            'reps'
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
        },
        weight: {
            type : 'number'
        },
        reps: {
            type: 'number'
        }
    },
    required: ['id','exerciseName', 'weight', 'reps'],
    indexes: ['exerciseName']
};

export type PersonalRecordDocument = RxDocument<PersonalRecordType>;
export type PersonalRecordCollection = RxCollection<PersonalRecordType>;