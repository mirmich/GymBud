import { View, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { darkMode } from "../model/GlobalStyles";

interface TopBarGeneralProps {
  innerElements: ReactNode[];
}

export default function TopBarGeneral(props: TopBarGeneralProps) {
  return (
    <View style={styles.container}>
      {props.innerElements.map((elem, index) => (
        <React.Fragment key={index}>{elem}</React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkMode.accentPurple,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 32,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
