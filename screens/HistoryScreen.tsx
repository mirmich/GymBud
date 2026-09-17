import React from "react";
import { View, StyleSheet } from "react-native";
import { darkMode } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import { safeArray } from "../util/ArrayUtil";
import ExpGeneralList from "../components/ExpGeneralList";
import { WeightAndReps } from "../model/Category";
import ConversionUtil from "../util/UnitConversionUtil";
import { formatDate } from "../util/DateUtil";
import { RootStackParamList } from "../App";
import { RouteProp } from "@react-navigation/native";
import ExerciseTabBar from "../components/ExerciseTabBar";

type HistoryScreenRouteProp = RouteProp<RootStackParamList, "History">;

type HistoryScreenProps = {
  route: HistoryScreenRouteProp;
};


export default function HistoryScreen({ route }: HistoryScreenProps) {
  const { data: allSets } =
    ExerciseUnitQueries.listAllExerciseUnitsByName(route.params.exerciseName);

  const itemPressed = (name: string) => {
    console.log(name);
  };

  return (
    <View style={styles.centeredView}>
      <ExerciseTabBar
        activeTab="History"
        exerciseName={route.params.exerciseName}
        date={route.params.date}
      />
      {safeArray(allSets).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((eUnit) => {
        const sets: WeightAndReps[] = eUnit.weightAndReps;
        const setsString = sets.map(
          (x, i) => ConversionUtil.toPresent(x.weight, x.reps, i).text
        );
        return (
          <View style={styles.listItem}>
            <ExpGeneralList
              key={formatDate(eUnit.date)}
              headerName={formatDate(eUnit.date)}
              innerList={setsString}
              weightAndReps={sets}
              showChildIcon={false}
              expandedInitial={true}
              weightUnit="kgs"
              exerciseUnit="reps"
              onItemPress={itemPressed}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 0,
    width: "100%",
    height: "100%",
    backgroundColor: darkMode.background,
  },
  listItem: {
    flexGrow: 0
  },
});
