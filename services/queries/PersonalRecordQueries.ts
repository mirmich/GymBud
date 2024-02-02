import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import StorageService from '../storage/StorageService';
import { CategoryDocType } from '../storage/schemas/CategorySchema';
import { PersonalRecordType } from '../storage/schemas/PersonalRecordSchema';
import { ExerciseUnitType } from '../storage/schemas/ExerciseUnitSchema';

export default class PersonalRecordQueries {

    private static queryPrefix = 'personalRecords';

    static listPersonalRecordsForExercises(exerciseName: string) {
      return useQuery({
        queryKey: [this.queryPrefix, 'list', exerciseName],
        queryFn: async () => {
          return (await StorageService.getPrsForExercise(exerciseName))
            .map((pr) => pr.toJSON() as PersonalRecordType)
                
        }  
      });
    }

    static addPersonalRecord(
      exerciseName0: string,
      date0: string,
      queryClient: QueryClient
  ) {
      return useMutation({
          mutationFn: (pr: {
            weight: number,
            reps: number
          }) => {
              return StorageService.addPersonalRecord(
                exerciseName0,
                date0,
                pr.weight,
                pr.reps
              );
          },
          onSuccess: () => {
              queryClient.invalidateQueries({
              queryKey: [this.queryPrefix]
              })
          }
      });  
  }
  }