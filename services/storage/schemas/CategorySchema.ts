
import {
    RxCollection,
    RxJsonSchema,
    RxDocument,
  } from 'rxdb';

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