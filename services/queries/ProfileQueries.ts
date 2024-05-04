import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import StorageService from "../storage/StorageService";

export default class ProfileQueries {
  private static queryKey = "profile";

  static getProfileProperty = (key: string) => {
    return useQuery({
      queryKey: [ProfileQueries.queryKey, key],
      queryFn: () => {
        return StorageService.getItem(key);
      },
    });
  };

  static makeMutation = (key: string, queryClient: QueryClient) => {
    return useMutation({
      mutationFn: (value: string) => {
        return StorageService.setItem(key, value);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [ProfileQueries.queryKey, key],
        });
      },
    });
  };
}
