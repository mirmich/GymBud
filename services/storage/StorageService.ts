
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {
  createRxDatabase,
} from 'rxdb';
import { addRxPlugin } from 'rxdb';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
addRxPlugin(RxDBMigrationPlugin);
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin);

import initialData from '../../assets/initialExercises.json';
import { WeightAndReps } from '../../model/Category';
import { categorySchema } from './schemas/CategorySchema';
import { ExerciseUnitSchema } from './schemas/ExerciseUnitSchema';

import { RxDatabase } from 'rxdb';
import { CategoryCollection } from './schemas/CategorySchema';
import { ExerciseUnitCollection } from './schemas/ExerciseUnitSchema';
import { PersonalRecordCollection, PersonalRecordDocument, PersonalRecordSchema } from './schemas/PersonalRecordSchema';

export type MyDatabaseCollections = {
    categories: CategoryCollection
    exercises: ExerciseUnitCollection
    personalrecords: PersonalRecordCollection
}
export type MyDatabase = RxDatabase<MyDatabaseCollections>;


class StorageService {

  static myDatabase: MyDatabase;

  static async init() {
    this.myDatabase = await createRxDatabase<MyDatabaseCollections>({
      name: 'mydatabase',
      storage: getRxStorageDexie()
    });
    //  await this.myDatabase.destroy();
    //  await this.myDatabase.remove();
    try {
      await this.myDatabase.addCollections({
        categories: {
          schema: categorySchema,
          // migrationStrategies: {
          //   // 1 means, this transforms data from version 0 to version 1
          //   1: async function(oldDoc){
          //     oldDoc.exercises = []; // string to unix
          //     return oldDoc;
          //   }
          // }
        },
        exercises: {
          schema: ExerciseUnitSchema,
        },
        personalrecords: {
          schema : PersonalRecordSchema
        }
      });
    } catch(error) {
      console.error('Error during DB init:', error);
      throw error;
    }
    
    await this.populate();
  }

  private static async populate() {
    initialData.categories.map(async (category) => {
      const dbCategory = await this.findCategoryById(category.name);
      if(dbCategory) {
        const dbExercises: string[] = dbCategory.get('exercises');
        await dbCategory.patch({
          exercises: [...new Set(dbExercises.concat(category.exercises))]
        });
      } else {
        await this.addCategory(category.name);
      }

    });

  }


  /**
   * Adds a new personal record to DB
   * @param name0 id/name of the category
   */
  static async addPersonalRecord(
    execiseName0: string, 
    date0: string,
    weight0: number,
    reps0: number
  ) {
    await this.myDatabase.personalrecords.upsert({
      exerciseName: execiseName0,
      date: date0,
      weight: weight0,
      reps: reps0
    })
    console.log("pr added")
  }

  static async getPrsForExercise(
    execiseName0: string, 
  ) {
    try {
      return await this.myDatabase.personalrecords.find({
        selector: {
          exerciseName: execiseName0
        }
      }).exec();
    } catch(error) {
      console.error('Error in getPrsForExercise', error);
      throw error;
    }
  }

  /**
   * Adds a new category with empty array of exercises
   * @param name0 id/name of the category
   */
  static async addCategory(name0: string) {
    await this.myDatabase.categories.insert({
      id: name0,
      name: name0,
      exercises: []
    })
    console.log("category added")
  }
  /**
   * Deletes given category
   * @param name id/name of the category
   */
  static async deleteCategory(name: string) {
    const foundDocument = await this.myDatabase.categories.findOne({
      selector: {
          id: name
      }
  }).exec();
    foundDocument.remove();
  }

  static async findCategoryById(name0: string) {
    return await this.myDatabase.categories.findOne({
      selector: {
          id: name0
      }
    }).exec();
  }

  static async listAllCategories() {
    return await this.myDatabase.categories.find().exec();
  }

  static async exerciseUnitById(exerciseName0: string, date0: string) {
    const id0 = this.myDatabase.exercises.schema.getPrimaryOfDocumentData({
      exerciseName: exerciseName0,
      date: date0
    });

    return await this.myDatabase.exercises.findOne({
      selector: {
        id: id0
      }
    }).exec();
  }

  static async listAllExerciseUnits() {
    return await this.myDatabase.exercises.find().exec();
  }

  static async listAllExerciseUnitsByDate(date0: string) {
    try {
      const result = await this.myDatabase.exercises.find({
        selector: {
          date: date0
        } 
      }).exec();
      return result;
  } catch (error) {
      console.error('Error in listAllExerciseUnitsByDate:', error);
      throw error; // Propagate the error
  }
  }

  static async addExerciseUnit(
    name0: string, 
    date0: string,
    sets: WeightAndReps[]
  ){
    try{
      await this.myDatabase.exercises.upsert({
        exerciseName: name0,
        date: date0,
        weightAndReps: sets
      })
      console.log("exercise unit added")
    } catch (error) {
      console.error('Error in addExerciseUnit:', error);
      throw error; // Propagate the error

    }
    
  }

  static async updateExerciseUnit(
    exerciseName0: string,
    date0: string,
    sets: WeightAndReps[]
  ){
    const currentExerciseUnit = await this.exerciseUnitById(exerciseName0, date0);
    await currentExerciseUnit.patch({
      weightAndReps: sets
    });
    console.log("exercise unit updated")
  }

  static async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('AsyncStorage setItem error:', e);
    }
  }

  static async getItem(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value == null) {
        return null;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error('AsyncStorage getItem error:', e);
    }
  }

  static async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('AsyncStorage removeItem error:', e);
    }
  }

}

export default StorageService;