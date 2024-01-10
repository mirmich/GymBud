import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import ExerciseScreen from './components/ExerciseScreen';

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



//const queryClient = new QueryClient();
export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
      </Stack.Navigator>
      
      </NavigationContainer>
      </QueryClientProvider>
  );
}
