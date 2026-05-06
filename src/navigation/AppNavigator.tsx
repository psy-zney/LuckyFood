import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RandomWheelScreen from '../screens/RandomWheelScreen';
import FilterScreen from '../screens/FilterScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  RandomWheel: undefined;
  Filter: undefined;
  Favourites: undefined;
  Calendar: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Search: undefined;
  Calendar: undefined;
  Profile: undefined;
  FoodDetail: {
    food: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      category: 'com' | 'bun-pho' | 'banh' | 'chay' | 'nuoc';
      prepTime: number;
    };
  };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="FoodDetail"
          component={FoodDetailScreen}
          options={({ route }) => ({
            title: route.params.food.name,
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              fontFamily: theme.typography.families.display,
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.text,
            },
            headerBackTitleStyle: {
              fontFamily: theme.typography.families.body,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.text,
            },
            headerTintColor: theme.colors.text,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => (
        <View style={{
          backgroundColor: theme.isDark ? 'rgba(18,18,18,0.98)' : 'rgba(255,255,255,0.98)',
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
          elevation: 8,
          shadowColor: theme.colors.text,
          shadowOpacity: theme.isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        }}>
          <BottomTabBar {...props} />
          <View style={{ paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 60, marginBottom: 4 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.borderSubtle, opacity: 0.6 }} />
              <MaterialIcons name="favorite" size={12} color="#FFB6C1" style={{ marginHorizontal: 8 }} />
              <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.borderSubtle, opacity: 0.6 }} />
            </View>
            <Text style={{
              textAlign: 'center',
              fontSize: 9,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.families.body,
              opacity: 0.6,
              letterSpacing: 0.3,
            }}>
              Design & Development by zney_LQK
            </Text>
          </View>
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 4,
          paddingTop: 8,
          paddingHorizontal: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: theme.typography.families.body,
          fontSize: 11,
          fontWeight: theme.typography.weights.medium,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Khám Phá',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="home"
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
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
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: focused
                  ? theme.colors.primary
                  : theme.colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -24,
                shadowColor: theme.colors.primary,
                shadowOpacity: focused ? 0.4 : 0.2,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: focused ? 8 : 4,
              }}
            >
              <MaterialIcons
                name="casino"
                size={26}
                color={focused ? theme.colors.surface : theme.colors.primary}
              />
            </View>
          ),
          tabBarLabelStyle: {
            fontFamily: theme.typography.families.body,
            fontSize: 11,
            fontWeight: theme.typography.weights.bold,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginTop: 8,
          },
        }}
      />
      <Tab.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          tabBarLabel: 'Nguyên Liệu',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="tune"
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Yêu Thích',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? 'favorite' : 'favorite-border'}
              size={24}
              color={color}
              style={{ opacity: focused ? 1 : 0.6 }}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
