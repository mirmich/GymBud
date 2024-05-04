import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { darkMode } from "../model/GlobalStyles";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>GymLog</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 3,
    borderBottomColor: darkMode.border,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 1,
  },
  paragraph: {
    fontSize: 32,
    fontFamily: "Raleway_700Bold_Italic",
    textAlign: "center",
    color: "white",
  },
});
