import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import ExerciseModal from './components/ExerciseModal';

const Stack = createNativeStackNavigator();

//const queryClient = new QueryClient();
export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Exercise" component={ExerciseModal} />
      </Stack.Navigator>
      
      </NavigationContainer>
      </QueryClientProvider>
  );
}
