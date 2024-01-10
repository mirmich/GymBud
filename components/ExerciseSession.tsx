
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ExerciseScreen from './ExerciseScreen';
import ExpandableList from './ExpandableList';

type ExerciseSessionProps = {
  selectedDate: string
}

export default function ExerciseSession(props: ExerciseSessionProps) {
  return (
    <View>
      <View style={styles.container}>
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
      {/* {ExpandableList('Back',c)} */}
      {/* <ExerciseModal date={props.selectedDate} exerciseName='Deadlift' /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  day: {
    flexGrow: 4,
    marginLeft: 50,
  },
  calendarIcon: {
    marginRight: 5,
  },
});