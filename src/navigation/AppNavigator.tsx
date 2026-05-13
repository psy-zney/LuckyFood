import React from 'react';
import { View, Text, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeProvider';
import { useAppStore } from '../store';

import HomeScreen from '../screens/HomeScreen';
import RandomWheelScreen from '../screens/RandomWheelScreen';
import FilterScreen from '../screens/FilterScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

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
  AdminDashboard: undefined;
  Auth: undefined;
  Search: undefined;
  Calendar: undefined;
  Profile: undefined;
  Settings: undefined;
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

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const theme = useTheme();
  const { user } = useAppStore();
  const isAdmin = user.uid !== null && user.role === 'admin';

  return (
    <NavigationContainer>
      {isAdmin ? (
        <Stack.Navigator key="admin-stack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
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
              headerTintColor: theme.colors.text,
            })}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator key="user-stack" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
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
              headerTintColor: theme.colors.text,
            })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const AnimatedTabItem = ({ name, label, color, focused, isCenter = false, theme }: any) => {
  const translateY = React.useRef(new Animated.Value(focused ? -6 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: focused ? -6 : 0,
      tension: 100,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [focused, translateY]);

  if (isCenter) {
    return (
      <Animated.View
        style={{
          alignItems: 'center',
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: focused ? theme.colors.primary : theme.colors.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -28,
            shadowColor: theme.colors.primary,
            shadowOpacity: focused ? 0.4 : 0.2,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: focused ? 8 : 4,
          }}
        >
          <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.colors.surface : theme.colors.primary}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            color: focused ? theme.colors.primary : theme.colors.textSecondary,
            fontFamily: theme.typography.families.body,
            fontSize: 10,
            fontWeight: theme.typography.weights.bold,
            letterSpacing: 0,
            marginTop: 6,
            textAlign: 'center',
            width: 75,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ alignItems: 'center', transform: [{ translateY }] }}>
      <MaterialIcons name={name} size={24} color={color} style={{ opacity: focused ? 1 : 0.6 }} />
      <Text
        numberOfLines={1}
        style={{
          color,
          fontFamily: theme.typography.families.body,
          fontSize: 10,
          fontWeight: focused ? theme.typography.weights.bold : theme.typography.weights.medium,
          letterSpacing: 0,
          marginTop: 4,
          opacity: focused ? 1 : 0.8,
          textAlign: 'center',
          width: 75,
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => (
        <View
          style={{
            backgroundColor: theme.isDark ? 'rgba(18,18,18,0.98)' : 'rgba(255,255,255,0.98)',
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderSubtle,
            elevation: 8,
            shadowColor: theme.colors.text,
            shadowOpacity: theme.isDark ? 0.3 : 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
          }}
        >
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabItem name="home" label="Khám phá" color={color} focused={focused} theme={theme} />
          ),
        }}
      />

      <Tab.Screen
        name="RandomWheel"
        component={RandomWheelScreen}
        options={{
          tabBarLabel: 'Xúc xắc',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabItem name="casino" label="Xúc xắc" focused={focused} isCenter theme={theme} />
          ),
        }}
      />

      <Tab.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          tabBarLabel: 'Nguyên liệu',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabItem name="tune" label="Nguyên liệu" color={color} focused={focused} theme={theme} />
          ),
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Yêu thích',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabItem
              name={focused ? 'favorite' : 'favorite-border'}
              label="Yêu thích"
              color={color}
              focused={focused}
              theme={theme}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
