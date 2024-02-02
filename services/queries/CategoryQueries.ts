import { useQuery } from '@tanstack/react-query';
import StorageService from '../storage/StorageService';
import { CategoryDocType } from '../storage/schemas/CategorySchema';

export default class CategoryQueries {

    static listAllCategories() {
      return useQuery({
        queryKey: ['categories', 'list', 'all'],
        queryFn: async () => {
            return (await StorageService.listAllCategories())
                .map((cat) => cat.toJSON() as CategoryDocType);
        }  
      });
    }
  }