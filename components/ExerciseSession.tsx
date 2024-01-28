
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import ExpandableList from './ExpandableList';
import { darkMode } from '../model/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { ExerciseUnitType } from '../services/storage/Schema';
import ExerciseUnitQueries from '../services/queries/ExerciseUnitQueries';
import { safeArray } from '../util/ArrayUtil';
import CategoryQueries from '../services/queries/CategoryQueries';

type ExerciseSessionProps = {
  selectedDate: string
}

export default function ExerciseSession(props: ExerciseSessionProps) {
  const navigation = useNavigation();
  const { data: exerciseUnits } = ExerciseUnitQueries.listAllExerciseUnitsByDate(props.selectedDate);
  const { data: categories } = CategoryQueries.listAllCategories();
  const exercisesDone = new Map<string, string[]>();
  console.log(categories);
  console.log(exerciseUnits);
  if(categories && exerciseUnits) {
    safeArray(categories).forEach((category) => exercisesDone.set(category.name, []));
    safeArray(exerciseUnits).forEach((exercise) => {
      const category = categories.find((cat) => cat.exercises.includes(exercise.exerciseName));
      const exercises = exercisesDone.get(category.name).concat([exercise.exerciseName])
      exercisesDone.set(category.name, [...new Set(exercises)]);
    })
  }
  
  

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
      </View>
      {
        Array.from(exercisesDone)
        .filter((cat) => cat[1].length > 0)
        .map(([cat, exercises]) => (
          <ExpandableList 
            categoryName={cat}
            listOfExercises={exercises}
            showChildIcon={true}
            onItemPress={itemPressed}
          />
        ))
      }
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