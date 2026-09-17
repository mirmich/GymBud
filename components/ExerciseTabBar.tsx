import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { darkMode, globalStyle } from "../model/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import TopBarGeneral from "./TopBarGeneral";

type ActiveTab = "Track" | "History" | "Chart";

type ExerciseTabBarProps = {
  activeTab: ActiveTab;
  exerciseName: string;
  date: string;
};

export default function ExerciseTabBar({ activeTab, exerciseName, date }: ExerciseTabBarProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navParams = { exerciseName, date };

  const makeTab = (tab: ActiveTab, screenName: "Exercise" | "History" | "Chart", label: string) => {
    if (tab === activeTab) {
      return <Text key={tab} style={styles.activeTabText}>{label}</Text>;
    }
    const params = screenName === "Exercise"
      ? navParams
      : navParams;
    return (
      <Pressable key={tab} onPress={() => navigation.navigate(screenName, params)}>
        <Text style={styles.tabText}>{label}</Text>
      </Pressable>
    );
  };

  const elements = [
    <Pressable key="home" onPress={() => navigation.navigate('Home')}>
      <AntDesign name="left" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <View key="s1" style={styles.spacer} />,
    makeTab("Track", "Exercise", "Track"),
    <View key="sep1" style={styles.separator} />,
    makeTab("History", "History", "History"),
    <View key="sep2" style={styles.separator} />,
    makeTab("Chart", "Chart", "Chart"),
    <View key="s2" style={styles.spacer} />,
  ];

  return (
    <View style={styles.topBar}>
      <TopBarGeneral innerElements={[elements]}></TopBarGeneral>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
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
