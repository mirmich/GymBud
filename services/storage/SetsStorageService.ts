
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WeightAndReps } from '../../model/Category';
import StorageService from './StorageService';

class SetsStorageService {

  static getSets(key: string) {
    return useQuery({
      queryKey: ['sets', 'get', key],
      queryFn: () => {
        return StorageService.getItem(key);
      }  
    });
    //return (data as WeightAndReps[]) ?? []; 
  }
}

export default SetsStorageService;