import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RandomWheelScreen from '../screens/RandomWheelScreen';
import FilterScreen from '../screens/FilterScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  RandomWheel: undefined;
  Filter: undefined;
  Favourites: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(252,252,250,0.97)',
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#1A1523',
            shadowOpacity: 0.12,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: -8 },
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: {
            fontFamily: theme.typography.families.body,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Khám Phá',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Tìm Món',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="search" size={24} color={color} />
            ),
          }}
        />
        {/* Center Tab – RandomWheel with visual highlight */}
        <Tab.Screen
          name="RandomWheel"
          component={RandomWheelScreen}
          options={{
            tabBarLabel: 'Xúc Xắc',
            tabBarIcon: ({ focused }) => (
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: focused ? theme.colors.primary : theme.colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                shadowColor: theme.colors.primaryContainer,
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
              }}>
                <MaterialIcons name="casino" size={26} color={theme.colors.surface} />
              </View>
            ),
            tabBarLabelStyle: {
              fontFamily: theme.typography.families.body,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            },
          }}
        />
        <Tab.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            tabBarLabel: 'Nguyên Liệu',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="tune" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{
            tabBarLabel: 'Yêu Thích',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="favorite-border" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
