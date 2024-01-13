import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import ExerciseScreen from './components/ExerciseScreen';
import { useFonts } from 'expo-font';
import { Text, StyleSheet } from 'react-native';
// Fonts
import { Raleway_700Bold_Italic } from "@expo-google-fonts/raleway";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { darkMode, globalStyle } from './model/GlobalStyles';

export type ExerciseRouteParams = { 
  date: string, 
  exerciseName: string 
};

export type RootStackParamList = {
  Home: undefined;
  Exercise: ExerciseRouteParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [fontsLoaded] = useFonts({
    Raleway_700Bold_Italic,
    Roboto_400Regular
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerShadowVisible: false
      }}>
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: darkMode.accentPurple,
            },
            headerTintColor: darkMode.fontColor,
          }}
          />
        <Stack.Screen 
        name="Exercise" 
        component={ExerciseScreen}
        options={{
          title: 'Exercise',
          headerStyle: {
            backgroundColor: darkMode.accentPurple,
          },
          headerTintColor: darkMode.fontColor,
        }} />
      </Stack.Navigator> 
      </NavigationContainer>
      </QueryClientProvider>
  );
}
