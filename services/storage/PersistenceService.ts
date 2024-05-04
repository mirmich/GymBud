import { Database } from "@nozbe/watermelondb";
import initialData from "../../assets/initialExercises.json";
import { Platform } from "react-native";
import CategoryPersistence from "./CategoryPersistence";
import { Category } from "./CategoryModel";
import { dbSchema } from "./schemas/DBSchema";
import { ExerciseUnit } from "./ExerciseUnitModel";
import { PersonalRecord } from "./PersonalRecordModel";
let Adapter;
if (Platform.OS === "web") {
  Adapter = require("@nozbe/watermelondb/adapters/lokijs").default;
} else {
  Adapter = require("@nozbe/watermelondb/adapters/sqlite").default;
}

const adapter =
  Platform.OS === "web"
    ? new Adapter({
        schema: dbSchema,
        useWebWorker: false,
        useIncrementalIndexedDB: true,
        dbName: "gymLogWeb", // optional db name
        onQuotaExceededError: (error) => {
          console.log(`quota exceed error: ${error}`);
        },
        onSetUpError: (error) => {
          console.log(`set up error: ${error}`);
        },
        extraIncrementalIDBOptions: {
          onDidOverwrite: () => {},
          onversionchange: () => {},
        },
      })
    : new Adapter({
        dbName: "gymLogAndroid",
        schema: dbSchema,
        jsi: false /* enable if Platform.OS === 'ios' */,
      });

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
