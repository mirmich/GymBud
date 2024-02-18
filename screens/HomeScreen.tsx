import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import ExerciseSession from "../components/ExerciseSession";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import { format } from "date-fns";
import { useState } from "react";
import { darkMode } from "../model/GlobalStyles";

export default function HomeScreen({ navigation }) {
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
                    }}
                markedDates={{
                [selected]: {selected: true, disableTouchEvent: true}
                }}
                theme={{
                    backgroundColor: darkMode.fontColor,
                    calendarBackground: darkMode.background,
                    textSectionTitleColor: darkMode.fontColor,
                    selectedDayBackgroundColor: darkMode.accentPurple,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: darkMode.accentBlue,
                    dayTextColor: darkMode.fontColor,
                    textDisabledColor: darkMode.accentGrey,
                    monthTextColor: darkMode.fontColor
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