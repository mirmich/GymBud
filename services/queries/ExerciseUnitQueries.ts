import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import StorageService from '../storage/StorageService';
import { safeArray } from '../../util/ArrayUtil';
import { WeightAndReps } from '../../model/Category';
import { ExerciseUnitType } from '../storage/schemas/ExerciseUnitSchema';

export default class ExerciseUnitQueries {

    static getExerciseUnitByNameAndDate(exerciseName: string, date: string) {
      return useQuery({
        queryKey: ['exerciseUnit', 'get', exerciseName, date],
        queryFn: async () => {
            const res = (await StorageService.exerciseUnitById(exerciseName, date))._data;
            return res as ExerciseUnitType;
        }  
      });
    }
    static getExerciseUnitById(id: string) {
        return useQuery({
          queryKey: ['exerciseUnit', 'get', id],
          queryFn: async () => {
              const split = id.split('|');
              const res = (await StorageService.exerciseUnitById(split[1], split[0]))._data;
              return res as ExerciseUnitType;
          }  
        });
      }

    static listAllExerciseUnitsByDate(date: string) {
        return useQuery({
          queryKey: ['exerciseUnit', 'list', 'all'],
          queryFn: async () => {
            return (await StorageService.listAllExerciseUnitsByDate(date))
                .map((exe) => exe.toJSON() as ExerciseUnitType);
          }  
        });
      }

    static addExerciseUnit(
        exerciseName0: string,
        date0: string,
        currentExerciseUnit: ExerciseUnitType, 
        queryClient: QueryClient
    ) {
        return useMutation({
            mutationFn: (set: WeightAndReps) => {
                const sets = (currentExerciseUnit) 
                    ? currentExerciseUnit.weightAndReps.concat([set])
                    : [set]; 
                return StorageService.addExerciseUnit(
                    exerciseName0,
                    date0,
                    safeArray(sets)
                );
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                queryKey: ['exerciseUnit']
                })
            }
        });  
    }

    static updateExerciseUnit(
        currentExerciseUnit: ExerciseUnitType,
        queryClient: QueryClient
        ) {
            return useMutation({
            mutationFn: async (update: {
              set: WeightAndReps 
              index: number}
              ) => {
                const currentSets = safeArray([...currentExerciseUnit.weightAndReps]);
                const updatedSet: WeightAndReps = {
                  weight: update.set.weight,
                  reps: update.set.reps
                }; 
                currentSets[update.index] = updatedSet;
                return StorageService.updateExerciseUnit(
                    currentExerciseUnit.exerciseName, 
                    currentExerciseUnit.date,
                    currentSets
                );
            },
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ['exerciseUnit']
              });
            }
          });
    }

    static replaceWeightAndReps(
        currentExerciseUnit: ExerciseUnitType,
        queryClient: QueryClient
        ) {
            return useMutation({
            mutationFn: (sets: WeightAndReps[]) => {
                return StorageService.updateExerciseUnit(
                    currentExerciseUnit.exerciseName, 
                    currentExerciseUnit.date,
                    sets
                );
            },
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ['exerciseUnit']
              });
            }
          });
    }
  }