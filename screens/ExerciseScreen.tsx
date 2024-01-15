import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import FloatStepInput from '../components/FloatStepInput';
import SwipeList from '../components/SwipeList';
import { WeightAndReps } from '../model/Category';
import SetsStorageService from '../services/storage/SetsStorageService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StorageService from '../services/storage/StorageService';
import { Selected } from '../model/Storage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { darkMode, globalStyle } from '../model/GlobalStyles';

type ExerciseScreenRouteProp = RouteProp<RootStackParamList, 'Exercise'>;
type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercise'>;

type ExerciseScreenProps = {
  route: ExerciseScreenRouteProp;
  navigation: ExerciseScreenNavigationProp;
};


export default function ExerciseScreen({ route, navigation }: ExerciseScreenProps) {
  const { date, exerciseName } = route.params;
  const key = date.concat(exerciseName);
  const { data }: {data: WeightAndReps[]} = SetsStorageService.getSets(key);

  const { data: selected }: {data: Selected}  = useQuery({
    queryKey: ['sets', 'selected', key],
    queryFn: () => {
      return StorageService.getItem(key + '-selected');
    },
    initialData: {
      index: 0,
      unit: { weight: 0, reps: 0 },
      operation: 'add'
    }
  });
  const queryClient = useQueryClient();

  const addSetMutation = useMutation({
    mutationFn: (sets: {weight: number, reps: number}) => {
        const currentSets = data ?? [];
        const newSet: WeightAndReps = {
          weight: sets.weight,
          reps: sets.reps
        };  
        return StorageService.setItem(key, currentSets.concat([newSet]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sets', 'get', key]
      })
    }
  });


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

  const updateSetMutation = useMutation({
    mutationFn: async (update: {
      weight: number, 
      reps: number, 
      index: number}
      ) => {
        const currentSets = data ?? [];
        const updatedSet: WeightAndReps = {
          weight: update.weight,
          reps: update.reps
        }; 
        currentSets[update.index] = updatedSet;
        const backtoAdd: Selected = {
          ...selected,
          operation: 'add'
        };
        await selectedSetMutation.mutateAsync(backtoAdd);
        return StorageService.setItem(key, currentSets);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sets']
      });
    }
  });

  const handleWeight = async (newValue: number) => {
    const unit0: WeightAndReps = {
      weight: newValue, 
      reps: (selected?.unit?.reps) ?? 0.0
    };
    const neco: Selected = {
      index: selected?.index ?? 0.0, 
      unit: unit0, 
      operation: selected?.operation ?? 'add'
    };
    await selectedSetMutation.mutateAsync(neco);
  };

  const handleReps = async (newValue: number) => {
    const unit0: WeightAndReps = {
      weight: (selected?.unit?.weight) ?? 0.0, 
      reps: newValue
    };
    const neco: Selected = {
      index: selected?.index ?? 0.0, 
      unit: unit0, 
      operation: selected?.operation ?? 'add'
    };
    await selectedSetMutation.mutateAsync(neco);
  };

  return (
    <View style={styles.centeredView}>
        <View style={styles.centeredView}>
          <View style={styles.header}>
            <Text style={styles.modalText}>{exerciseName}</Text>   
          </View>
          <FloatStepInput 
            text='Weight' 
            step={2.5} 
            value={selected?.unit?.weight ?? 0.0} 
            onChangeValue={handleWeight}/>
          <FloatStepInput 
            text='Reps'
            step={1}
            value={selected?.unit?.reps ?? 0.0}
            onChangeValue={handleReps}/>
          {(selected != null && selected.operation === 'modify') ?
          <Pressable 
            style={styles.buttonUpdate} 
            onPress={() => updateSetMutation.mutateAsync({
              weight: selected.unit.weight,
              reps: selected.unit.reps,
              index: (selected.index)
            })}>
            <Text style={styles.addUpdateText}>Update</Text>
          </Pressable> : 
          <Pressable
          style={styles.buttonAdd} 
          onPress={async () => {
            await addSetMutation.mutateAsync({
            weight: selected.unit.weight, 
            reps: selected.unit.reps
          });
          }}>
            <Text style={styles.addUpdateText}>Add</Text>
          </Pressable>
          }
          <SwipeList key0={key}/>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: darkMode.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonAdd: {
    backgroundColor: darkMode.accentGreen,
    padding: 10,
    marginTop: 10,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    borderRadius: 3,
  },
  buttonUpdate: {
    backgroundColor: darkMode.accentYellow,
    padding: 10,
    marginTop: 10,
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    borderRadius: 3,
  },
  addUpdateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  header: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 3,
    borderBottomColor: darkMode.border,
    borderRadius: 1
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: globalStyle.fontFamilyRegular,
    color: darkMode.fontColor,
    flexGrow: 4,
    textAlign: 'center',
  }
});