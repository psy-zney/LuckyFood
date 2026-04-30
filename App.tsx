import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { bootstrapDatabase } from './src/database/db-service';
import { useAppStore, useSettings } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/utils/theme';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
  Newsreader_400Regular_Italic,
} from '@expo-google-fonts/newsreader';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const settings = useSettings();
  const setFirstLaunch = useAppStore((s) => s.setFirstLaunch);

  const [fontsLoaded] = useFonts({
    Newsreader: Newsreader_400Regular,
    Newsreader_Medium: Newsreader_500Medium,
    Newsreader_SemiBold: Newsreader_600SemiBold,
    Newsreader_Bold: Newsreader_700Bold,
    Newsreader_Italic: Newsreader_400Regular_Italic,
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    'Plus Jakarta Sans_Medium': PlusJakartaSans_500Medium,
    'Plus Jakarta Sans_SemiBold': PlusJakartaSans_600SemiBold,
    'Plus Jakarta Sans_Bold': PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    const init = async () => {
      // Khởi tạo DB + seed data (nếu là lần chạy đầu)
      await bootstrapDatabase(settings.isFirstLaunch);

      if (settings.isFirstLaunch) {
        // Đánh dấu đã chạy lần đầu để không seed lại
        setFirstLaunch(false);
      }

      setDbReady(true);
    };

    init().catch(console.error);
  }, []);

  // Splash / Loading screen đơn giản
  if (!dbReady || !fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
