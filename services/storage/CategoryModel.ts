import { Model } from "@nozbe/watermelondb";
import { json, text } from "@nozbe/watermelondb/decorators";

const sanitizeExercises = (rawExercises) => {
  return Array.isArray(rawExercises) ? rawExercises.map(String) : [];
};

export class Category extends Model {
  static table = "category"; // bind the model to specific table
  @text("name") name: string; // binds a table column to a model property
  @json("exercises", sanitizeExercises) exercises; // for non-text fields you the "field" decorator
}
