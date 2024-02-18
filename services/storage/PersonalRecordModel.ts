import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class PersonalRecord extends Model {
    static table = 'personalRecord'; 
    // @ts-ignore
    @text('exerciseName') exerciseName: string; 
    // @ts-ignore
    @text('date') date: string;
    // @ts-ignore
    @field('weight') weight: number; 
    // @ts-ignore
    @field('reps') reps: number; 
}