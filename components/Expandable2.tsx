import  { useState } from 'react';
import { View } from 'react-native';
import { ListItem } from '@rneui/themed';
import React from 'react';

const Expandable2 = (categoryName, listOfExercises) => {
  const log = () => {
    console.log('pressed');
  };
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
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ListItem.Accordion>
    </View>
    
    );
};

export default Expandable2;