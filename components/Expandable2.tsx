import  { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from '@rneui/themed';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const Expandable2 = (categoryName, listOfExercises) => {
  const log = () => {
    console.log('pressed');
  };

  const openModal = () => {

  }
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
    <ListItem.Accordion
      content={
        <>
          <ListItem.Content>
            <ListItem.Title>{categoryName}</ListItem.Title>
          </ListItem.Content>
        </>
      }
      isExpanded={expanded}
      onPress={() => {
        setExpanded(!expanded);
      }}
    >
      {listOfExercises.map((l, i) => (
        <ListItem key={i} onPress={log} bottomDivider>
          <ListItem.Content style={styles.listContent}>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
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

export default Expandable2;