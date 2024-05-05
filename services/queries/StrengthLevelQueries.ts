import { useQuery } from "@tanstack/react-query";
import StrengthLevelService from "../StrengthLevelService";

export default class StrengthLevelQueries {
  private static queryKey = "strength";

  static getPosition = (
    exerciseName: string,
    bodyWeight: number,
    oneRepMax: number
  ) => {
    return useQuery({
      queryKey: [
        StrengthLevelQueries.queryKey,
        exerciseName,
        bodyWeight,
        oneRepMax,
      ],
      queryFn: () => {
        return StrengthLevelService.getStrengthLevel(
          exerciseName,
          bodyWeight,
          oneRepMax
        );
      },
    });
  };
}
