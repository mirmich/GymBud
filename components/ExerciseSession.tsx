
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ExpandableList from './ExpandableList';
import { darkMode } from '../model/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import ExerciseUnitQueries from '../services/queries/ExerciseUnitQueries';
import { safeArray } from '../util/ArrayUtil';
import CategoryQueries from '../services/queries/CategoryQueries';

type ExerciseSessionProps = {
  selectedDate: string
}

export default function ExerciseSession(props: ExerciseSessionProps) {
  const navigation = useNavigation();
  const { data: exerciseUnits } = ExerciseUnitQueries.listAllExerciseUnitsByDate(props.selectedDate);
  const { data: categories } = CategoryQueries.listAllCategoriesNew();
  const findExerciseForSession = () => {
    if(categories && exerciseUnits) {
      const exercisesDone = new Map<string, string[]>();
      safeArray(categories).forEach((category) => exercisesDone.set(category.name, []));
        safeArray(exerciseUnits).forEach((exercise) => {
          const category = categories.find((cat) => cat.exercises.includes(exercise.exerciseName));
          const exercises = exercisesDone.get(category.name).concat([exercise.exerciseName])
          exercisesDone.set(category.name, [...new Set(exercises)]);
        })
      return Array.from(exercisesDone);
  } else {
    return [];
  }
  }
  

  const itemPressed = (name: string) => {
    navigation.navigate('Exercise', {
      date: props.selectedDate,
      exerciseName: name
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headingContainer}>
        <View style={styles.day}>
          <Text style={styles.paragraph}>Session</Text>
        </View>
      </View>
      { (categories && exerciseUnits) ? (
        findExerciseForSession()
        .filter((cat) => cat[1].length > 0)
        .map(([cat, exercises]) => (
          <ExpandableList 
            categoryName={cat}
            listOfExercises={exercises}
            showChildIcon={false}
            onItemPress={itemPressed}
          />
        ))) : null
      }
    </ScrollView>
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