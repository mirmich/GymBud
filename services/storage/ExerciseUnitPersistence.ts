import { map } from '@nozbe/watermelondb/utils/rx';
import { WeightAndReps } from '../../model/Category';
import { ExerciseUnit } from './ExerciseUnitModel';
import PersistenceService from './PersistenceService';
import { Q } from '@nozbe/watermelondb';

const tableName = 'exerciseUnit'


export default class ExerciseUnitPersistence {

  static async add(
    exerciseName: string, 
    date: string,
    sets: WeightAndReps[]
    ) {
    try {
      const records = await  PersistenceService.database
        .get<ExerciseUnit>(tableName)
        .query(Q.and(
          Q.where('date', date)),
          Q.where('exerciseName', exerciseName)
        );
      let present = records.find(
        row =>
          row.exerciseName === exerciseName &&
          row.date === date &&
          row.syncStatus !== "deleted"
      )
      await PersistenceService.database.write(async () => {
        if(present) {
          return await present.update((exerciseUnit) => {
            exerciseUnit.weightAndReps = sets;
          });
        } else {
          return PersistenceService.database
            .get<ExerciseUnit>(tableName)
            .create((exerciseUnit) => {
              exerciseUnit.exerciseName = exerciseName;
              exerciseUnit.date = date;
              exerciseUnit.weightAndReps = sets;
            });
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
 
      
  static async listAllExerciseUnitsByDate(date: string) {
    return PersistenceService.database.get<ExerciseUnit>(tableName)
      .query(Q.where('date', date));
  }
      
  static async listAllExerciseUnitsByNameAndDate(
    exerciseName: string,
    date: string
  ) {
    return PersistenceService.database.get<ExerciseUnit>(tableName)
      .query(Q.where('date', date),
        Q.and(
          Q.where('exerciseName', exerciseName)
        ));
  }

  static async listAllDates() {
    const allExercises = await PersistenceService.database.get<ExerciseUnit>(tableName).query();

    const uniqueDates = Array.from(
      new Set(allExercises.map(exercise => exercise.date))
    );
    return uniqueDates;
  } 
}