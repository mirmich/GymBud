import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import ExerciseSession from "./ExerciseSession";
import Header from "./Header";
import TopBar from "./TopBar";
import { format } from "date-fns";
import Constants from "expo-constants";
import { useState } from "react";
import { darkMode } from "../model/GlobalStyles";




export default function Home({ navigation }) {
    const [selected, setSelected] = useState(format(new Date(),'yyyy-MM-dd'));
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarPress = () => {
        setShowCalendar(!showCalendar);
    };

    return (
        <View style={styles.container}>
            <TopBar selectedDay={selected} onCalendarPressed={calendarPress}/>
                { showCalendar && <Calendar
                    onDayPress={ day => {
                        setSelected(day.dateString);
                        console.log(selected);
                    }}
                markedDates={{
                [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
                }}
                /> }
            <Header />
            
            <ExerciseSession selectedDate={selected} />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode.background,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }
});