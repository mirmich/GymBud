import { WeightAndReps } from "./Category";

type Operation = "modify" | "add";

export type Selected = {
  index: number;
  unit: WeightAndReps;
  operation: Operation;
};
