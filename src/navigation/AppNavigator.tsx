import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../utils/theme';

import HomeScreen from '../screens/HomeScreen';
import RandomWheelScreen from '../screens/RandomWheelScreen';
import FilterScreen from '../screens/FilterScreen';

// ─── Route Params Map ─────────────────────────────────────────────────────────
export type RootStackParamList = {
  Home: undefined;
  RandomWheel: undefined;
  Filter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Cấu hình header mặc định ─────────────────────────────────────────────────
const screenOptions = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: {
    fontWeight: theme.typography.weights.bold as 'bold',
    fontSize: theme.typography.sizes.lg,
  },
  contentStyle: { backgroundColor: theme.colors.background },
};

// ─── Navigator chính ──────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '🍜 LuckyFood' }}
        />
        <Stack.Screen
          name="RandomWheel"
          component={RandomWheelScreen}
          options={{ title: 'Quay Random' }}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{ title: 'Lọc Món Ăn' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
