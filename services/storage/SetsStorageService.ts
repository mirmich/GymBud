import { useQuery } from "@tanstack/react-query";
import StorageService from "./StorageService";

class SetsStorageService {
  static getSets(key: string) {
    return useQuery({
      queryKey: ["sets", "get", key],
      queryFn: () => {
        return StorageService.getItem(key);
      },
    });
  }
}

export default SetsStorageService;
