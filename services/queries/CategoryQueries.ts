import { useQuery } from '@tanstack/react-query';
import CategoryPersistence from '../storage/CategoryPersistence';


export default class CategoryQueries {

    static listAllCategoriesNew() {
      return useQuery({
        queryKey: ['categories', 'list', 'all'],
        queryFn: async () => {
            return CategoryPersistence.listAllCategories();
        }  
      });
    }
  }