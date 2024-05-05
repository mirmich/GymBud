type ExerciseType = NonNullable<unknown>;

type Weights = {
  weight: number;
};

type Reps = {
  reps: number;
};

type Time = {
  seconds: number;
};

type Distance = {
  meters: number;
};

export type DistanceAndTime = Distance & Time & ExerciseType;
export type WeightAndReps = Weights & Reps & ExerciseType;
export type WeightAndTime = Weights & Time & ExerciseType;
export type WeightAndDistance = Weights & Distance & ExerciseType;
export type RepsAndTime = Reps & Time & ExerciseType;
export type RepsAndDistance = Reps & Distance & ExerciseType;

export type Exercise = {
  name: string;
  exerciseType: ExerciseType;
};
/**
 * key: `${index}`, 
      units: 'kg',
      amount: kilos,
      reps: reps0,
      text: `${index+1}    ${kilos} kgs    ${reps0} reps`
      };
 */

export type UnitOfExercise = {
  key: string;
  units: string;
  amount: number;
  reps: number;
  text: string;
};
