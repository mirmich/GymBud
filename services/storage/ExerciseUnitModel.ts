import { Model } from "@nozbe/watermelondb";
import { json, text } from "@nozbe/watermelondb/decorators";

const sanitizeWeightAndReps = (json) => json;
export class ExerciseUnit extends Model {
  static table = "exerciseUnit"; // bind the model to specific table
  @text("exerciseName") exerciseName: string; // binds a table column to a model property
  @text("date") date: string; // binds a table column to a model property
  @json("weightAndReps", sanitizeWeightAndReps) weightAndReps;
}
