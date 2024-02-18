import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import StorageService from "../storage/StorageService";
import { Selected } from '../../model/Storage';




export default class SelectedSetQueries {


    static selectedSetMutation = (
        exerciseName: string,
        date: string,
        queryClient: QueryClient
    ) => {
        const key = date.concat('|').concat(exerciseName);;
        return useMutation({
            mutationFn: (selected: Selected) => { 
                return StorageService.setItem(key + '-selected', selected);
            },
            onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sets', 'selected', key]
            })
            }
        });
    }
}