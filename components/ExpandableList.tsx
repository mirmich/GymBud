import  { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from '@rneui/themed';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type ExpandableListProps = {
  date: string,
  categoryName: string,
  listOfExercises: string[]
}

export default function ExpandableList(props: ExpandableListProps) {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const log = (date0: string, name: string) => {
    console.log('pressed');
    console.log(date0);
    console.log(name);
    navigation.navigate('Exercise', {
      date: date0,
      exerciseName: name
    });
  };

  const openModal = () => {

  }
  
  return (
    <View>
    <ListItem.Accordion
      content={
        <>
          <ListItem.Content>
            <ListItem.Title>{props.categoryName}</ListItem.Title>
          </ListItem.Content>
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      {props.listOfExercises.map((name, i) => (
        <ListItem key={i} onPress={() => log(props.date, name)} bottomDivider>
          <ListItem.Content style={styles.listContent}>
            <ListItem.Title>{name}</ListItem.Title>
            <AntDesign name="right" size={24} color="black" />
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ListItem.Accordion>
    </View>
    
    );
    
};

const styles = StyleSheet.create({
  listContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  }});