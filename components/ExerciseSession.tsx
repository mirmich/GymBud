
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ExpandableList from './ExpandableList';
import { darkMode } from '../model/GlobalStyles';

type ExerciseSessionProps = {
  selectedDate: string
}

export default function ExerciseSession(props: ExerciseSessionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={styles.day}>
          <Text style={styles.paragraph}>Session</Text>
        </View>
        <TouchableOpacity activeOpacity={0.5}>
          <Image style={styles.calendarIcon} source={require('../assets/icons/add.svg')} />
        </TouchableOpacity>
      </View>
      <ExpandableList 
        date={props.selectedDate} 
        categoryName='Back'
        listOfExercises={['Deadlift', 'Pull-up']}
      ></ExpandableList>
      <ExpandableList 
        date={props.selectedDate} 
        categoryName='Legs'
        listOfExercises={['Squat', 'Leg press']}
      ></ExpandableList>
      <ExpandableList 
        date={props.selectedDate} 
        categoryName='Biceps'
        listOfExercises={['Barbell curl', 'Ez-bar curl']}
      ></ExpandableList>
      {/* {ExpandableList('Back',c)} */}
      {/* <ExerciseModal date={props.selectedDate} exerciseName='Deadlift' /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    paddingTop: 15
  },
  headingContainer: {
    backgroundColor: darkMode.background,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: darkMode.fontColor,
  },
  day: {
    flexGrow: 4,
  },
  calendarIcon: {
    marginRight: 5,
  },
});