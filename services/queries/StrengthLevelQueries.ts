import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import StorageService from "../storage/StorageService";
import { Selected } from '../../model/Storage';
import StrengthLevelService from '../StrengthLevelService';




export default class StrengthLevelQueries {

    private static queryKey = 'strength'

    static getPosition = (
        exerciseName: string, 
        bodyWeight: number,
        oneRepMax: number
    ) => {

        return useQuery({
            queryKey: [StrengthLevelQueries.queryKey, exerciseName, bodyWeight, oneRepMax],
            queryFn: () => {
              return StrengthLevelService.getStrengthLevel(exerciseName, bodyWeight, oneRepMax);
            }
          });
    }
}