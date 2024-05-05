import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ListItem } from "@rneui/themed";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { globalStyle, darkMode } from "../model/GlobalStyles";

type ExpandableListProps = {
  categoryName: string;
  listOfExercises: string[];
  showChildIcon: boolean;
  onItemPress: (itemName: string) => void;
};

export default function ExpandableList(props: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ScrollView>
      <ListItem.Accordion
        key={props.categoryName}
        containerStyle={styles.listContainer}
        content={
          <ListItem.Content
            key={props.categoryName + "content"}
            style={styles.topListContentContainer}
          >
            <ListItem.Title
              key={props.categoryName + "title"}
              style={styles.item}
            >
              {props.categoryName}
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
        {props.listOfExercises.map((name, i) => (
          <ListItem
            containerStyle={styles.listContainer}
            key={name + i}
            onPress={() => props.onItemPress(name)}
            bottomDivider
          >
            <ListItem.Content
              key={name + i + "content"}
              style={styles.topListContentContainer}
            >
              <ListItem.Title
                key={name + i + "title"}
                style={styles.bottomItem}
              >
                {name}
              </ListItem.Title>
              {props.showChildIcon && (
                <AntDesign name="right" size={24} color={darkMode.fontColor} />
              )}
            </ListItem.Content>
          </ListItem>
        ))}
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
