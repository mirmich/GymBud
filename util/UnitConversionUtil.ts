import { UnitOfExercise, WeightAndReps } from "../model/Category";

class UnitConversionUtil {

    static toPresent(kilos: number, reps0: number, index: number): UnitOfExercise {
        return { 
          key: `${index}`, 
          units: 'kg',
          amount: kilos,
          reps: reps0,
          text: `${index+1}    ${kilos} kgs    ${reps0} reps`
        } as UnitOfExercise;
    }

}

export default UnitConversionUtil;