import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { safeArray } from "../../util/ArrayUtil";
import { WeightAndReps } from "../../model/Category";
import ExerciseUnitPersistence from "../storage/ExerciseUnitPersistence";
import { ExerciseUnit } from "../storage/ExerciseUnitModel";
import PersonalRecordPersistence from "../storage/PersonalRecordPersistence";

export default class ExerciseUnitQueries {
  static getExerciseUnitByNameAndDate(exerciseName: string, date: string) {
    return useQuery({
      queryKey: ["exerciseUnit", "get", exerciseName, date],
      queryFn: async () => {
        const records =
          await ExerciseUnitPersistence.listAllExerciseUnitsByNameAndDate(
            exerciseName,
            date
          );
        return records[0];
      },
    });
  }

  static listAllExerciseUnitsByDate(date: string) {
    return useQuery({
      queryKey: ["exerciseUnit", "list", "all", date],
      queryFn: async () => {
        return ExerciseUnitPersistence.listAllExerciseUnitsByDate(date);
      },
    });
  }

  static listAllDates() {
    return useQuery({
      queryKey: ["exerciseUnit", "list", "all", "dates"],
      queryFn: async () => {
        return ExerciseUnitPersistence.listAllDates();
      },
    });
  }

  static listAllExerciseUnitsByName(exerciseName: string) {
    return useQuery({
      queryKey: ["exerciseUnit", "list", "all", exerciseName],
      queryFn: async () => {
        return ExerciseUnitPersistence.listAllExerciseUnitsByName(exerciseName);
      },
    });
  }

  static addExerciseUnit(
    exerciseName0: string,
    date0: string,
    currentExerciseUnit: ExerciseUnit,
    queryClient: QueryClient
  ) {
    return useMutation({
      mutationFn: async (set: WeightAndReps) => {
        const sets = currentExerciseUnit
          ? currentExerciseUnit.weightAndReps.concat([set])
          : [set];
        await ExerciseUnitPersistence.add(
          exerciseName0,
          date0,
          safeArray(sets)
        );
        await PersonalRecordPersistence.syncForSession(
          exerciseName0,
          date0,
          safeArray(sets)
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["exerciseUnit"],
        });
        queryClient.invalidateQueries({
          queryKey: ["personalRecords"],
        });
      },
    });
  }

  static updateExerciseUnit(
    currentExerciseUnit: ExerciseUnit,
    queryClient: QueryClient
  ) {
    return useMutation({
      mutationFn: async (update: { set: WeightAndReps; index: number }) => {
        const currentSets = safeArray([...currentExerciseUnit.weightAndReps]);
        const updatedSet: WeightAndReps = {
          weight: update.set.weight,
          reps: update.set.reps,
        };
        currentSets[update.index] = updatedSet;
        await ExerciseUnitPersistence.add(
          currentExerciseUnit.exerciseName,
          currentExerciseUnit.date,
          currentSets
        );
        await PersonalRecordPersistence.syncForSession(
          currentExerciseUnit.exerciseName,
          currentExerciseUnit.date,
          currentSets
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["exerciseUnit"],
        });
        queryClient.invalidateQueries({
          queryKey: ["personalRecords"],
        });
      },
    });
  }

  static replaceWeightAndReps(
    currentExerciseUnit: ExerciseUnit,
    queryClient: QueryClient
  ) {
    return useMutation({
      mutationFn: async (sets: WeightAndReps[]) => {
        await ExerciseUnitPersistence.add(
          currentExerciseUnit.exerciseName,
          currentExerciseUnit.date,
          sets
        );
        await PersonalRecordPersistence.syncForSession(
          currentExerciseUnit.exerciseName,
          currentExerciseUnit.date,
          sets
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["exerciseUnit"],
        });
        queryClient.invalidateQueries({
          queryKey: ["personalRecords"],
        });
      },
    });
  }
}
