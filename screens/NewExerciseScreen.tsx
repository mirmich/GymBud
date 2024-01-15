import { View, StyleSheet } from "react-native";
import { darkMode } from "../model/GlobalStyles";
import ExpandableList from "../components/ExpandableList";
import initialData from '../assets/initialExercises.json';
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../App';

type NewExerciseScreenRouteProp = RouteProp<RootStackParamList, 'NewExercise'>;
type NewExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewExercise'>;

type NewExerciseScreenProps = {
  route: NewExerciseScreenRouteProp;
  navigation: NewExerciseScreenNavigationProp;
};

export default function NewExerciseScreen({ route, navigation }: NewExerciseScreenProps) {
    const { date } = route.params;
    const itemPressed = (name: string) => {
        console.log(name);
        navigation.navigate('Exercise', {
            date: date,
            exerciseName: name
          });   
    };

    return (
        <View style={styles.container}>
        {
            initialData.categories.map((category) => (
            <ExpandableList 
                categoryName={category.name}
                listOfExercises={category.exercises}
                showChildIcon={false}
                onItemPress={itemPressed}
            />
            ))
        }
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