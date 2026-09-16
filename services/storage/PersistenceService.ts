import { Database } from "@nozbe/watermelondb";
import initialData from "../../assets/initialExercises.json";
import CategoryPersistence from "./CategoryPersistence";
import { Category } from "./CategoryModel";
import { ExerciseUnit } from "./ExerciseUnitModel";
import { PersonalRecord } from "./PersonalRecordModel";
import { adapter } from "./dbAdapter";

export default class PersistenceService {
  public static database: Database = new Database({
    adapter: adapter,
    modelClasses: [Category, ExerciseUnit, PersonalRecord],
  });

  static async initDB() {
    return initialData.categories.map(async (category) => {
      await CategoryPersistence.addCategory(category.name, category.exercises);
    });
  }
}
