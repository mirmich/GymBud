
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ExpandableList from './ExpandableList';
import { darkMode } from '../model/GlobalStyles';
import { useNavigation } from '@react-navigation/native';

type ExerciseSessionProps = {
  selectedDate: string
}

export default function ExerciseSession(props: ExerciseSessionProps) {
  const navigation = useNavigation();

  const itemPressed = (name: string) => {
    navigation.navigate('Exercise', {
      date: props.selectedDate,
      exerciseName: name
    });
  };
  
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
        categoryName='Back'
        listOfExercises={['Deadlift', 'Pull-up']}
        showChildIcon={true}
        onItemPress={itemPressed}
      ></ExpandableList>
      <ExpandableList 
        categoryName='Legs'
        listOfExercises={['Squat', 'Leg press']}
        showChildIcon={true}
        onItemPress={itemPressed}
      ></ExpandableList>
      <ExpandableList 
        categoryName='Biceps'
        listOfExercises={['Barbell curl', 'Ez-bar curl']}
        showChildIcon={true}
        onItemPress={itemPressed}
      ></ExpandableList>
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