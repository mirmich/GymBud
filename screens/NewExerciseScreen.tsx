import { View, StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import { AntDesign } from "@expo/vector-icons";
import ExpandableList from "../components/ExpandableList";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import CategoryQueries from "../services/queries/CategoryQueries";
import { safeArray } from "../util/ArrayUtil";
import { Category } from "../services/storage/CategoryModel";
import TopBarGeneral from "../components/TopBarGeneral";

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
  const backElements = [
    <Pressable onPress={() => navigation.navigate('Home')}>
      <AntDesign name="left" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <Text style={styles.titleText}>Add</Text>,
    <View style={styles.spacer} />,
  ];
  return (
    <View style={styles.container}>
      <TopBarGeneral innerElements={[backElements]}></TopBarGeneral>
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
  titleText: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    fontSize: 16,
    fontWeight: "bold",
  },
  spacer: {
    flex: 1,
  },
});
