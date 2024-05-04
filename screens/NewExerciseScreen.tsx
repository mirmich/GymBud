import { View, StyleSheet } from "react-native";
import React from "react";
import { darkMode } from "../model/GlobalStyles";
import ExpandableList from "../components/ExpandableList";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import TopBarPlain from "../components/TopBarPlain";
import CategoryQueries from "../services/queries/CategoryQueries";
import { safeArray } from "../util/ArrayUtil";
import { Category } from "../services/storage/CategoryModel";

type NewExerciseScreenRouteProp = RouteProp<RootStackParamList, "NewExercise">;
type NewExerciseScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewExercise"
>;

type NewExerciseScreenProps = {
  route: NewExerciseScreenRouteProp;
  navigation: NewExerciseScreenNavigationProp;
};

export default function NewExerciseScreen({
  route,
  navigation,
}: NewExerciseScreenProps) {
  const { date } = route.params;
  const { data }: { data: Category[] } = CategoryQueries.listAllCategoriesNew();
  const itemPressed = (name: string) => {
    navigation.navigate("Exercise", {
      date: date,
      exerciseName: name,
    });
  };
  return (
    <View style={styles.container}>
      <TopBarPlain></TopBarPlain>
      {safeArray(data).map((category) => (
        <ExpandableList
          key={category.name}
          categoryName={category.name}
          listOfExercises={category.exercises}
          showChildIcon={false}
          onItemPress={itemPressed}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkMode.background,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
