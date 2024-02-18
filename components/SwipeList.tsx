import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import ConversionUtil  from '../util/UnitConversionUtil';
import { useQueryClient } from '@tanstack/react-query';
import { Selected } from '../model/Storage';
import { darkMode } from '../model/GlobalStyles';
import { SimpleLineIcons } from '@expo/vector-icons';
import { safeArray } from '../util/ArrayUtil';
import ExerciseUnitQueries from '../services/queries/ExerciseUnitQueries';
import PersonalRecordQueries from '../services/queries/PersonalRecordQueries';
import SelectedSetQueries from '../services/queries/SelectedSetQueries';
import { WeightAndReps } from '../model/Category';
import { ExerciseUnit } from '../services/storage/ExerciseUnitModel';

type SwipeListProps = {
  exerciseName: string
  date: string
}

const { width } = Dimensions.get('window');

export default function SwipeList(props: SwipeListProps) {
  const [animationIsRunning, setAnimationIsRunning] = useState(false);
  const rowTranslateAnimatedValues = Array(999).fill('').map((_) => new Animated.Value(1));
  const queryClient = useQueryClient();

  // List all exercises with given name for given date
  const { data: exerciseUnit} = ExerciseUnitQueries.getExerciseUnitByNameAndDate(
    props.exerciseName,
    props.date
  );

  // List all PRs for given exercise
  const { data: prs } = PersonalRecordQueries.listPersonalRecordsForExercises(
    props.exerciseName
  );

  const selectedSetMutation = SelectedSetQueries.selectedSetMutation(
    props.exerciseName,
    props.date,
    queryClient
  );

  const replaceSets = ExerciseUnitQueries.replaceWeightAndReps(
    exerciseUnit, 
    queryClient
  );

  const isPR = (weight: number, reps: number) => {
    const neco = safeArray(prs).filter(x => x.weight === weight);
    const maxRep = Math.max(...neco.map(x => x.reps));
    return maxRep === reps;
  }

  const renderItem2 = ({item, index }) => {
    return (
      <Animated.View
        style={[
          {
            height: rowTranslateAnimatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 50],
            }),
          },
        ]}
      >
        <Pressable
          key={index}
          onPress={()=> selectedSetMutation.mutateAsync(
            {index: index, unit: {weight: item.amount, reps: item.reps}, operation: 'modify'} as Selected
          )}
          style={false ? styles.selected : styles.rowFront}>
          <View style={styles.trophyWrapper}>
            {isPR(item.amount, item.reps) ?
              <SimpleLineIcons 
              style={styles.trophy} 
              name="trophy" 
              size={24} 
              color={darkMode.fontColor}/> : null
            
            }
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.listTextWithTrophy}>{item.text}</Text>
          </View>
          
          {/* {isPR(item.amount, item. reps) ?
            <Text style={styles.listTextWithTrophy}>{item.text}</Text> :
            <Text style={styles.listTextWithoutTrophy}>{item.text}</Text>
          } */}
          
          
        </Pressable>
      </Animated.View>
    )};

  // Renders the second layer of the swipeable list
  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

    const onSwipeValueChange = (swipeData) => {
      const { key0, value } = swipeData;
      if (value < -Dimensions.get('window').width && !animationIsRunning) {
        setAnimationIsRunning(true);
        Animated.timing(rowTranslateAnimatedValues[swipeData.key], {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start( async () => {
          const newData = [...exerciseUnit.weightAndReps];
          newData.splice(parseInt(swipeData.key), 1);
          await replaceSets.mutateAsync(newData);
          setAnimationIsRunning(false);
        });
      }
    }

    const transformDataForPresentation = (exerciseUnit: ExerciseUnit) => {
      if(exerciseUnit) {
        return safeArray(exerciseUnit.weightAndReps as WeightAndReps[]).filter(Boolean)
          .map((set, i) => ConversionUtil.toPresent(set.weight, set.reps, i));
      } else {
        return [];
      }
      
    };

    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={transformDataForPresentation(exerciseUnit)}
          renderItem={renderItem2}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-Dimensions.get('window').width}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={onSwipeValueChange}
          useNativeDriver={false}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  selected: {
    alignItems: 'center',
    backgroundColor: '#AAA',
    borderBottomColor: darkMode.border,
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  container: {
    backgroundColor: darkMode.background,
    flex: 1,
    width: '90%'
  },
  backTextWhite: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  rowFront: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkMode.background,
    borderBottomColor: darkMode.border,
    borderBottomWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'flex-start',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  textWrapper: {
    display: 'flex',
  },
  listTextWithTrophy: {
    color: darkMode.fontColor,
    marginLeft: (width) / 2 - 130
  },
  trophyWrapper: {
    width: 30
  },
  trophy: {
    alignSelf: 'center',
    zIndex: 50
  }
});
