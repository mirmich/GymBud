import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import React, {useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Header from './components/Header';
import TopBar from './components/TopBar';
import { format } from 'date-fns';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ExerciseSession from './components/ExerciseSession';

//const queryClient = new QueryClient();
export default function App() {
  const [selected, setSelected] = useState(format(new Date(),'yyyy-MM-dd'));
  const [showCalendar, setShowCalendar] = useState(true);
  const [queryClient] = useState(() => new QueryClient());
  const calendarPress = () => {
    setShowCalendar(!showCalendar);
  };
  //<QueryClientProvider client={queryClient}>
  //</QueryClientProvider>
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
      <Header />
      <TopBar selectedDay={selected} onCalendarPressed={calendarPress}/>
        { showCalendar && <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
          console.log(selected);
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
        }}
      /> }
      <ExerciseSession selectedDate={selected} />
      </View>
      </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }
});
