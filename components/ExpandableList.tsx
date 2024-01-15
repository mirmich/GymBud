import  { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from '@rneui/themed';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { globalStyle, darkMode } from '../model/GlobalStyles';

type ExpandableListProps = {
  categoryName: string,
  listOfExercises: string[],
  showChildIcon: boolean,
  onItemPress: (itemName: string) => void;
}

export default function ExpandableList(props: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View>
    <ListItem.Accordion 
      containerStyle={styles.listContainer}
      content={
          <ListItem.Content style={styles.topListContentContainer}>
            <ListItem.Title style={styles.item}>{props.categoryName}</ListItem.Title>
            {expanded ? (
              <AntDesign style={styles.item} name="up" size={24} color={darkMode.fontColor} />
            ) : (
              <AntDesign style={styles.item} name="down" size={24} color={darkMode.fontColor} />
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
          key={i} 
          onPress={() => props.onItemPress(name)} 
          bottomDivider>
          <ListItem.Content style={styles.topListContentContainer}>
            <ListItem.Title style={styles.bottomItem}>{name}</ListItem.Title>
            {props.showChildIcon &&
              <AntDesign name="right" size={24} color={darkMode.fontColor} />
            }
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ListItem.Accordion>
    </View>
    ); 
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: darkMode.background,
  },
  topListContentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10
  },
  item: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto'
  },
  bottomItem: {
    color: darkMode.fontColor,
    fontFamily: globalStyle.fontFamilyRegular,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    marginLeft: 10
  }
});