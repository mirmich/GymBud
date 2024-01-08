import React, { useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable } from 'react-native';

import FloatStepInput from './FloatStepInput';
import SwipeList from './SwipeList';
import { WeightAndReps } from '../model/Category';
import SetsStorageService from '../services/storage/SetsStorageService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StorageService from '../services/storage/StorageService';
import { Selected } from '../model/Storage';
import { AntDesign } from '@expo/vector-icons';

type ExerciseModalProps = {
  date: string,
  exerciseName: string
}

export default function ExerciseModal(props: ExerciseModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const key = props.date.concat(props.exerciseName);
  const [filter, setFilter] = React.useState(true);
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
    },
    enabled: filter
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
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}> */}
        <View style={styles.centeredView}>
          <View style={styles.header}>
            <Pressable 
              style={styles.backButton} 
              onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            <Text style={styles.modalText}>{props.exerciseName}</Text>   
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
      {/* </Modal> */}
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 60
  },
  buttonAdd: {
    backgroundColor: '#48CD90',
    padding: 10,
    marginTop: 10
  },
  buttonUpdate: {
    backgroundColor: '#fca031',
    padding: 10,
    marginTop: 10
  },
  addUpdateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  backButton: {
    marginLeft: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    flexGrow: 4,
    textAlign: 'center',
    marginRight: 50
  },
  calendarIcon: {
    marginRight: 5
  }
});