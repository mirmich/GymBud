import { Text, View, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import React from 'react';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'; 
import { darkMode } from '../model/GlobalStyles';
import { useNavigation } from '@react-navigation/native';

interface TopBarProps {
  selectedDay: string;
  onCalendarPressed: () => void;
}

export default function TopBar(props: TopBarProps) {
  const { selectedDay, onCalendarPressed } = props;
  const navigation = useNavigation();

  const formatDate = (selectedDay: string): string => {
    if (selectedDay === format(new Date(),'yyyy-MM-dd')) {
      return 'Today';
    }
    return format(new Date(selectedDay), 'MMMM dd yyyy');
  }

  const navigateNewExercise = () => {
    navigation.navigate('NewExercise', {
      date: selectedDay,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {formatDate(selectedDay)}
      </Text>
      <Pressable onPress={navigateNewExercise}>
        <FontAwesome 
          name="plus" 
          size={24} 
          color={darkMode.fontColor} />
      </Pressable>
      <Pressable onPress={onCalendarPressed}>
        <FontAwesome5 
          name="calendar-alt" 
          size={24} 
          color={darkMode.fontColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkMode.accentPurple,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 32,
    paddingLeft: 16,
    paddingRight: 16
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: darkMode.fontColor,
  }
});