import standardMen from "../assets/standards.json";
import { slidingWindow } from "../util/ArrayUtil";
import initialData from "../assets/initialExercises.json";

type StrengthLevel = {
  index: number;
  position: number;
};

export default class StrengthLevelService {
  static async getStrengthLevel(
    exerciseName0: string,
    bodyWeight: number,
    oneRepMax: number
  ) {
    console.log("im in");

    const strengthLevelExercises = standardMen.exercises.map((x) =>
      x.exerciseName.toLocaleLowerCase().trim()
    );
    const initialExercises = initialData.categories.reduce(
      (acc, currentValue) =>
        acc.concat(
          currentValue.exercises.map((x) => x.toLocaleLowerCase().trim())
        ),
      [] as string[]
    );
    console.log(initialExercises);
    const diff = initialExercises.filter(
      (x) => !strengthLevelExercises.includes(x)
    );
    console.log(diff);
    console.log(strengthLevelExercises);

    const exerciseStrLevel = standardMen.exercises.find(
      (x) => x.exerciseName.toLowerCase() === exerciseName0.toLowerCase()
    );
    const bodyRange = exerciseStrLevel.ranges.find(
      (x) => x.rangeStart >= bodyWeight
    );
    const thresholdsAdjusted = [...bodyRange.thresholds];
    thresholdsAdjusted.push(Infinity);
    thresholdsAdjusted.unshift(0);
    const slided = slidingWindow(thresholdsAdjusted, 2, 1);
    console.log(slided);
    const index0 = slided.findIndex(
      (x) => x[0] < oneRepMax && x[1] > oneRepMax
    );
    console.log(index0);
    const position =
      (oneRepMax - slided[index0][0]) / (slided[index0][1] - slided[index0][0]);
    console.log(position);
    const position2 = oneRepMax / (slided[5][0] / 100);
    if (position2 > 100) {
      return {
        position: 105 / 100,
        index: index0,
      } as StrengthLevel;
    } else {
      return {
        position: position2 / 100,
        index: index0,
      } as StrengthLevel;
    }

    /**
            [0, 71] < 5%
            [71, 94]   5% - 20%  
            [94, 122]  20% - 50%
            [122, 153] 50% - 80%
            [153, 187] 80% - 95%
            [187, Infinity] > 95% 

            (187-153) / 15 = 2.26
            34
            15
            (168-153) / 2.26
         * 
         */
  }
}
