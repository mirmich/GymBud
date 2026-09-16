import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import { safeArray } from "../util/ArrayUtil";
import ExpGeneralList from "../components/ExpGeneralList";
import { WeightAndReps } from "../model/Category";
import ConversionUtil from "../util/UnitConversionUtil";
import { formatDate } from "../util/DateUtil";
import { RootStackParamList } from "../App";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TopBarGeneral from "../components/TopBarGeneral";

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
  const navigation = useNavigation();
  const { data: allSets } =
    ExerciseUnitQueries.listAllExerciseUnitsByName(route.params.exerciseName);
  console.log(allSets);

  const itemPressed = (name: string) => {
    console.log(name);
  };

  const separator = (
    <View style={styles.separator} />
  );

  const elements = [
    <Pressable onPress={() => navigation.navigate('Home')}>
      <AntDesign name="left" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <View style={styles.spacer} />,
    <Pressable onPress={() =>
      navigation.navigate("Exercise", {
        exerciseName: route.params.exerciseName,
        date: route.params.date
      })
    }>
      <Text style={styles.tabText}>Track</Text>
    </Pressable>,
    separator,
    <Text style={styles.activeTabText}>History</Text>,
    <View style={styles.spacer} />,
  ];

  return (
    <View style={styles.centeredView}>
      <View style={styles.topBar}>
        <TopBarGeneral innerElements={[elements]}></TopBarGeneral>
      </View>
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
    paddingTop: 0,
    width: "100%",
    height: "100%",
    backgroundColor: darkMode.background,
  },
  listItem: {
    flexGrow: 0
  },
  topBar: {
    width: "100%"
  },
  activeTabText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.5,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: darkMode.fontColor,
    opacity: 0.4,
  },
  spacer: {
    flex: 1,
  },
});
