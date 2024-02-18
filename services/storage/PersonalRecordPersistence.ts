
import PersistenceService from './PersistenceService';
import { Q } from '@nozbe/watermelondb';
import { PersonalRecord } from './PersonalRecordModel';

const tableName = 'personalRecord'


export default class PersonalRecordPersistence {

    static async add(
        exerciseName: string, 
        date: string,
        weight: number,
        reps: number
    ) {
        try {
          const records = await  PersistenceService.database
            .get<PersonalRecord>(tableName)
            .query(Q.and(
              Q.where('date', date),
              Q.where('exerciseName', exerciseName),
              Q.where('reps', reps))
            );
          let present = records.find(
            row =>
              row.exerciseName === exerciseName &&
              row.reps === reps &&
              row.syncStatus !== "deleted"
          )
          await PersistenceService.database.write(async () => {
            if(present) {
              return await present.update((personalRecord) => {
                personalRecord.weight = weight;
                personalRecord.reps = reps;
              });
            } else {
              return PersistenceService.database
                .get<PersonalRecord>(tableName)
                .create((personalRecord) => {
                    personalRecord.exerciseName = exerciseName;
                    personalRecord.date = date;
                    personalRecord.weight = weight;
                    personalRecord.reps = reps;
                });
            }
          });
        } catch (e) {
          console.error(e)
        }
    }

    static async listAllPersonalRecordByExercise(exerciseName: string) {
        return PersistenceService.database.get<PersonalRecord>(tableName)
          .query(Q.where('exerciseName', exerciseName));
      }
}