import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import ExerciseSession from "../components/ExerciseSession";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { darkMode } from "../model/GlobalStyles";
import ExerciseUnitQueries from "../services/queries/ExerciseUnitQueries";
import { safeArray } from "../util/ArrayUtil";
import * as R from "ramda";

declare type MarkedDates = {
    [key: string]: any;
};

export default function HomeScreen({ navigation }) {
    const [selected, setSelected] = useState(format(new Date(),'yyyy-MM-dd'));
    const [showCalendar, setShowCalendar] = useState(false);
    const [neco, setNeco] = useState({});

    const { data: allDates } = ExerciseUnitQueries.listAllDates();
    const populateDates = () => {
        const currentDay: MarkedDates = {
            [selected]: {selected: true}
        }
        const markedDates: MarkedDates = safeArray(allDates).reduce((acc, date) => {
            acc[date] = { marked: true };
            return acc;
        }, {} as MarkedDates);
        if(safeArray(allDates).includes(selected)) {
            setNeco({ ...markedDates});
        } else {
            setNeco({ ...currentDay, ...markedDates});
        }
        
    }
    
    useEffect(() => {
        populateDates();
    }, [allDates]);

    const deleteDay = (
        markedDates: MarkedDates,
        date: string
    ) => {
        console.log('deleting')
        console.log('deleting date' + date);
        const tempM = R.clone(markedDates);
        if (tempM[date]) {
        delete tempM[date].selected;
        }
        return tempM;
    };

    const select = (
        markedDates: MarkedDates,
        date: string
    ) => {
        const tempM = R.clone(markedDates);
        if (tempM[date]) {
            // Set the selected attribute to true and keep other existing attributes
            tempM[date].selected = true;
        } else {
            // If the date doesn't exist, create a new entry with selected: true
            tempM[date] = {selected: true};
        }
        return tempM;
    };

    const calendarPress = () => {
        setShowCalendar(!showCalendar);
    };
    
    

    return (
        <View style={styles.container}>
            <TopBar 
            selectedDay={selected} 
            onCalendarPressed={calendarPress}/>
                { showCalendar && <Calendar
                    onDayPress={ day => {
                        setNeco(
                            select(
                                deleteDay(neco, selected), 
                                day.dateString)
                        );
                        setSelected(day.dateString);
                        
                        calendarPress();
                    }}
                markedDates={neco}
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