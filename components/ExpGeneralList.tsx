import { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { ListItem } from "@rneui/themed";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { globalStyle, darkMode } from "../model/GlobalStyles";
import { WeightAndReps } from "../model/Category";
import uuid from 'react-native-uuid';

type ExpGeneralListProps = {
  headerName: string;
  innerList: string[];
  weightAndReps: WeightAndReps[];
  showChildIcon: boolean;
  expandedInitial: boolean;
  weightUnit: string;
  exerciseUnit: string;
  onItemPress: (itemName: string) => void;
};

export default function ExpGeneralList(props: ExpGeneralListProps) {
  const [expanded, setExpanded] = useState(props.expandedInitial);

  return (
    <ScrollView>
      <ListItem.Accordion
        key={props.headerName}
        containerStyle={styles.listContainer}
        content={
          <ListItem.Content
            key={props.headerName + "content"}
            style={styles.topListContentContainer}
          >
            <ListItem.Title
              key={props.headerName + "title"}
              style={styles.item}
            >
              {props.headerName}
            </ListItem.Title>
            {expanded ? (
              <AntDesign
                style={styles.item}
                name="up"
                size={24}
                color={darkMode.fontColor}
              />
            ) : (
              <AntDesign
                style={styles.item}
                name="down"
                size={24}
                color={darkMode.fontColor}
              />
            )}
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        {props.weightAndReps.map((set, i) => {
          var uuid0 = uuid.v4();
          if (typeof uuid0 !== "string") {
            uuid0 = uuid0.join(", ");
          }

          return (
            <ListItem
              containerStyle={styles.listContainer}
              key={uuid0}
              onPress={() => props.onItemPress("lol")}
              bottomDivider
            >
              <ListItem.Content
                key={uuid0 + "content"}
                style={styles.rowContainer}
              >
                <View style={styles.innerContainer}>
                  <Text style={styles.item}>{set.weight.toLocaleString()}</Text>
                  <Text style={styles.item}>{props.weightUnit}</Text>
                </View>
                <View style={styles.innerContainer}>
                  <Text style={styles.item}>{set.reps.toLocaleString()}</Text>
                  <Text style={styles.item}>{props.exerciseUnit}</Text>
                </View>

                {props.showChildIcon && (
                  <AntDesign
                    name="right"
                    size={24}
                    color={darkMode.fontColor}
                  />
                )}
              </ListItem.Content>
            </ListItem>
          );
        })}
      </ListItem.Accordion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: darkMode.background,
  },
  topListContentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  item: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
  bottomItem: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    marginLeft: 10,
  },
});
