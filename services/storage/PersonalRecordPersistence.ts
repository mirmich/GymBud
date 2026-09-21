import PersistenceService from "./PersistenceService";
import { Q } from "@nozbe/watermelondb";
import { PersonalRecord } from "./PersonalRecordModel";

const tableName = "personalRecord";

export default class PersonalRecordPersistence {
  static async add(
    exerciseName: string,
    date: string,
    weight: number,
    reps: number
  ) {
    try {
      const records = await PersistenceService.database
        .get<PersonalRecord>(tableName)
        .query(
          Q.and(
            Q.where("date", date),
            Q.where("exerciseName", exerciseName),
            Q.where("reps", reps)
          )
        );
      const present = records.find(
        (row) =>
          row.exerciseName === exerciseName &&
          row.reps === reps &&
          row.syncStatus !== "deleted"
      );
      await PersistenceService.database.write(async () => {
        if (present) {
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
      console.error(e);
    }
  }

  static async softDeleteRecord(
    exerciseName: string,
    date: string,
    weight: number,
    newWeight: number,
    reps: number
  ) {
    try {
      const records = await PersistenceService.database
        .get<PersonalRecord>(tableName)
        .query(
          Q.and(
            Q.where("date", date),
            Q.where("exerciseName", exerciseName),
            Q.where("reps", reps)
          ),
          Q.where("weight", weight)
        );
      const present = records.find(
        (row) =>
          row.exerciseName === exerciseName &&
          row.reps === reps &&
          row.weight === weight &&
          row.syncStatus !== "deleted"
      );
      await PersistenceService.database.write(async () => {
        if (present) {
          return await present.update((personalRecord) => {
            personalRecord.weight = newWeight;
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
      console.error(e);
    }
  }

  static async listAllPersonalRecordByExercise(exerciseName: string) {
    return PersistenceService.database
      .get<PersonalRecord>(tableName)
      .query(Q.where("exerciseName", exerciseName));
  }

  static async syncForSession(
    exerciseName: string,
    date: string,
    sets: { weight: number; reps: number }[]
  ) {
    try {
      // 1. Calculate expected PRs for this session
      const expectedPrs = new Map<number, number>(); // reps -> max weight
      sets.forEach((set) => {
        const indices = Array.from(Array(set.reps + 1).keys()).slice(1);
        indices.forEach((rep) => {
          const currentMax = expectedPrs.get(rep);
          if (!currentMax || currentMax < set.weight) {
            expectedPrs.set(rep, set.weight);
          }
        });
      });

      // 2. Fetch existing PRs for this session
      const existingRecords = await PersistenceService.database
        .get<PersonalRecord>(tableName)
        .query(
          Q.and(
            Q.where("date", date),
            Q.where("exerciseName", exerciseName)
          )
        );
      
      const existingPrsByReps = new Map<number, PersonalRecord>();
      existingRecords.forEach(record => {
         if (record.syncStatus !== "deleted") {
             existingPrsByReps.set(record.reps, record);
         }
      });

      // 3. Batch process differences
      await PersistenceService.database.write(async () => {
          const batchOperations: any[] = [];
          
          expectedPrs.forEach((expectedWeight, rep) => {
             const existing = existingPrsByReps.get(rep);
             if (existing) {
                 if (existing.weight !== expectedWeight) {
                     batchOperations.push(existing.prepareUpdate((pr) => {
                         pr.weight = expectedWeight;
                     }));
                 }
                 existingPrsByReps.delete(rep); // Handled
             } else {
                 batchOperations.push(
                     PersistenceService.database.get<PersonalRecord>(tableName).prepareCreate((pr) => {
                         pr.exerciseName = exerciseName;
                         pr.date = date;
                         pr.weight = expectedWeight;
                         pr.reps = rep;
                     })
                 );
             }
          });

          // Any remaining in existingPrsByReps are no longer valid for this session
          existingPrsByReps.forEach(existing => {
              batchOperations.push(existing.prepareMarkAsDeleted());
          });

          if (batchOperations.length > 0) {
              await PersistenceService.database.batch(...batchOperations);
          }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
