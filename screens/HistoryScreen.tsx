import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { darkMode } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import { safeArray } from "../util/ArrayUtil";
import ExpGeneralList from "../components/ExpGeneralList";
import { WeightAndReps } from "../model/Category";
import ConversionUtil from "../util/UnitConversionUtil";
import { formatDate } from "../util/DateUtil";
import { RootStackParamList } from "../App";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HistoryScreenRouteProp = RouteProp<RootStackParamList, "History">;
type HistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "History"
>;

type HistoryScreenProps = {
  route: HistoryScreenRouteProp;
  navigation: HistoryScreenNavigationProp;
};


export default function HistoryScreen({ route }: HistoryScreenProps) {
  const { data: allSets } =
    ExerciseUnitQueries.listAllExerciseUnitsByName(route.params.exerciseName);
  console.log(allSets);

  const itemPressed = (name: string) => {
    console.log(name);
  };

  return (
    <View style={styles.centeredView}>
      {safeArray(allSets).map((eUnit) => {
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 10,
    width: "100%",
    height: "100%",
    backgroundColor: darkMode.background,
  },
  listItem: {
    flexGrow: 0
  }
});
