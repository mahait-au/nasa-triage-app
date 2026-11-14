import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GuidedMeasurementScreen from './GuidedMeasurementScreen';
import InterventionScreen from './InterventionScreen';
import HandOffScreen from './HandOffScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator 
        initialRouteName="Measurement"
        screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FF3B30',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackVisible: false, 
        }}
      >
        <Stack.Screen 
          name="Measurement" 
          component={GuidedMeasurementScreen} 
          options={{ title: 'STEP 1: SENSOR INGEST' }} 
        />
        <Stack.Screen 
          name="Intervention" 
          component={InterventionScreen} 
          options={{ title: 'STEP 2: ACTION PROTOCOL' }} 
        />
        <Stack.Screen 
          name="HandOff" 
          component={HandOffScreen} 
          options={{ title: 'STEP 3: HOUSTON UPLINK' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}