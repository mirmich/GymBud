import { Model } from "@nozbe/watermelondb";
import { json, text } from "@nozbe/watermelondb/decorators";

// const sanitizeWeightAndReps = rawWeightAndReps => {
//     return Array.isArray(rawWeightAndReps) ? rawWeightAndReps.map(WeightAndReps) : []
// } 
const sanitizeWeightAndReps = json => json
export class ExerciseUnit extends Model {
    static table = 'exerciseUnit'; // bind the model to specific table
    // @ts-ignore
    @text('exerciseName') exerciseName: string; // binds a table column to a model property
    // @ts-ignore
    @text('date') date: string; // binds a table column to a model property
    // @ts-ignore
    @json('weightAndReps', sanitizeWeightAndReps) weightAndReps 
}