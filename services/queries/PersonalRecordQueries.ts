import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import PersonalRecordPersistence from "../storage/PersonalRecordPersistence";

export default class PersonalRecordQueries {
  private static queryPrefix = "personalRecords";

  static listPersonalRecordsForExercises(exerciseName: string) {
    return useQuery({
      queryKey: [this.queryPrefix, "list", exerciseName],
      queryFn: async () => {
        return PersonalRecordPersistence.listAllPersonalRecordByExercise(
          exerciseName
        );
      },
    });
  }
}
