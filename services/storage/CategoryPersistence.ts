import PersistenceService from './PersistenceService';
import { Category } from './CategoryModel';

export default class CategoryPersistence {
    static async addCategory(name: string, exercises: string[]) {
        try {
          const records = await  PersistenceService.database.get<Category>('category').query();
          let localRecord = records.find(
            row =>
              row.name === name &&
              row.syncStatus !== "deleted"
          )
          await PersistenceService.database.write(async () => {
            if(localRecord) {
              return await localRecord.update((category) => {
                category.exercises = exercises;
              });
            } else {
              return PersistenceService.database
                .get<Category>('category')
                .create((category) => {
                  category.name = name;
                  category.exercises = exercises;
                });
            }
          });
        } catch (e) {
          console.error(e)
        }
        
      }
      
      static async listAllCategories() {
        return PersistenceService.database.get<Category>('category').query();
      } 
}