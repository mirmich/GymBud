import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, { useState } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import ConversionUtil  from '../util/UnitConversionUtil';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StorageService from '../services/storage/StorageService';
import { Selected } from '../model/Storage';
import SetsStorageService from '../services/storage/SetsStorageService';
import { WeightAndReps } from '../model/Category';

type SwipeListProps = {
  key0: string
}

export default function SwipeList(props: SwipeListProps) {
  const [animationIsRunning, setAnimationIsRunning] = useState(false);
  const rowTranslateAnimatedValues = Array(999).fill('').map((_) => new Animated.Value(1));
  const queryClient = useQueryClient();
  const key  = props.key0;
  const { data } = SetsStorageService.getSets(key);

  const selectedSetMutation = useMutation({
    mutationFn: (selected: Selected) => { 
        return StorageService.setItem(key + '-selected', selected);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sets', 'selected', key]
      })
    }
  });

  const updateSetsMutation = useMutation({
    mutationFn: async (update: WeightAndReps[]) => {
        return StorageService.setItem(key, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sets', 'get', key]
      });
    }
  });

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
        <TouchableHighlight
        key={index}
        onPress={()=> selectedSetMutation.mutateAsync(
          {index: index, unit: {weight: item.amount, reps: item.reps}, operation: 'modify'} as Selected
          )}
        style={false ? styles.selected : styles.rowFront}
        underlayColor={'#AAA'}>
        <Text>{item.text}</Text>
      </TouchableHighlight>
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
          const newData = [...data];
          newData.splice(parseInt(swipeData.key), 1);
          await updateSetsMutation.mutateAsync(newData);
          setAnimationIsRunning(false);
        });
      }
    }

    const transformDataForPresentation = (data: WeightAndReps[]) => {
      const currentSets = (data as WeightAndReps[]) ?? []
      return currentSets.map((set, i) => ConversionUtil.toPresent(set.weight, set.reps, i));
    };

    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={transformDataForPresentation(data)}
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    width: '90%'
  },
  backTextWhite: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
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
});