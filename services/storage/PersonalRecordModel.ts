import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class PersonalRecord extends Model {
  static table = "personalRecord";

  @text("exerciseName") exerciseName!: string;
  @text("date") date: string;
  @field("weight") weight: number;
  @field("reps") reps: number;
}
