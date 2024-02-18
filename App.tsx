import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import { useFonts } from 'expo-font';
import { Text, Pressable, View } from 'react-native';
// Fonts
import { Raleway_700Bold_Italic } from "@expo-google-fonts/raleway";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { darkMode } from './model/GlobalStyles';
import { AntDesign } from '@expo/vector-icons';
import NewExerciseScreen from './screens/NewExerciseScreen';
import StorageService from './services/storage/StorageService';
import PersistenceService from './services/storage/PersistenceService';

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [isDBInit, setDBInit] = useState(false);
  const [fontsLoaded] = useFonts({
    Raleway_700Bold_Italic,
    Roboto_400Regular
  });

  useEffect(() => {
    // StorageService.init()
    //.then(_ => PersistenceService.initDB())
    PersistenceService.initDB()
    .then(_ => setDBInit(true))
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {
          isDBInit ? (
            <Stack.Navigator initialRouteName="Home"
              screenOptions={{
                headerShadowVisible: false
              }}>
                {makeScreen({
                  name0: "Home",
                  component0: HomeScreen,
                  title: "Home",
                  backButton: () => undefined
                })}
                {makeScreen({
                  name0: "Exercise",
                  component0: ExerciseScreen,
                  title: "Exercise",
                  backButton: backToHome
                })}
                {makeScreen({
                  name0: "NewExercise",
                  component0: NewExerciseScreen,
                  title: "Add",
                  backButton: backToHome
                })}
              </Stack.Navigator> 
        ) : <View><Text>DB not loaded</Text></View>
        }
      
      </NavigationContainer>
      </QueryClientProvider>
  );
}

export type ExerciseRouteParams = { 
  date: string, 
  exerciseName: string 
};

export type NewExerciseRouteParams = { 
  date: string
};

export type RootStackParamList = {
  Home: undefined;
  Exercise: ExerciseRouteParams;
  NewExercise: NewExerciseRouteParams;
};

type Component = (a, b) => React.JSX.Element

type MakeScreenOptions = {
  name0: any,
  component0: Component,
  title: any,
  backButton: ((navigation) => React.JSX.Element) | undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

const backToHome = (navigation) => (
  <Pressable onPress={() => navigation.navigate('Home')} style={{paddingLeft: 16}}>
    <AntDesign name="left" size={24} color={darkMode.fontColor} />
  </Pressable>
);

const makeScreen = (props: MakeScreenOptions) => {
  const {name0, component0, title, backButton} = props;
  return(
    <Stack.Screen 
        name={name0} 
        component={component0}
        options={({ navigation, route }) =>({
          title: title,
          headerStyle: {
            backgroundColor: darkMode.accentPurple,
          },
          headerTintColor: darkMode.fontColor,
          headerLeft: () => (
            backButton(navigation)
          )
        })}
    />
  );
}
