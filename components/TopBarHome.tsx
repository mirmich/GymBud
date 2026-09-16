import { Text, View, StyleSheet, Pressable } from "react-native";
import { format } from "date-fns";
import React from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { darkMode } from "../model/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import TopBarGeneral from "./TopBarGeneral";

interface TopBarHomeProps {
  selectedDay: string;
  onCalendarPressed: () => void;
}

export default function TopBar(props: TopBarHomeProps) {
  const { selectedDay, onCalendarPressed } = props;
  const navigation = useNavigation();

  const formatDate = (selectedDay: string): string => {
    return selectedDay === format(new Date(), "yyyy-MM-dd")
      ? "Today"
      : format(new Date(selectedDay), "MMMM dd yyyy");
  };

  const navigateNewExercise = () => {
    navigation.navigate("NewExercise", {
      date: selectedDay,
    });
  };

  const navigateProfile = () => {
    navigation.navigate("Profile");
  };

  const elements = [
    <Text style={styles.text}>{formatDate(selectedDay)}</Text>,
    <Pressable onPress={navigateNewExercise}>
      <FontAwesome name="plus" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <Pressable onPress={onCalendarPressed}>
      <FontAwesome5 name="calendar-alt" size={24} color={darkMode.fontColor} />
    </Pressable>,
    <Pressable onPress={navigateProfile}>
      <FontAwesome name="user" size={24} color={darkMode.fontColor} />
    </Pressable>,
  ];

  return (
    <TopBarGeneral innerElements={[elements]}></TopBarGeneral>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: darkMode.fontColor,
  },
});
