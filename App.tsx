import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      try {
        // Khởi tạo DB + seed data (nếu là lần chạy đầu)
        await bootstrapDatabase(settings.isFirstLaunch);

        if (settings.isFirstLaunch) {
          // Đánh dấu đã chạy lần đầu để không seed lại
          setFirstLaunch(false);
        }

        setDbReady(true);
      } catch (err) {
        console.error('[App] Initialization error:', err);
        setError('Không thể khởi tạo ứng dụng. Vui lòng thử lại.');
      }
    };

    init();
  }, []);

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorTitle}>Lỗi khởi tạo</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Splash / Loading screen
  if (!dbReady || !fontsLoaded) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashContent}>
          <MaterialIcons name="restaurant" size={64} color={theme.colors.primary} />
          <Text style={styles.splashTitle}>LuckyFood</Text>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.spinner}
          />
          <Text style={styles.splashText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  splashContent: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  splashTitle: {
    fontFamily: 'Newsreader',
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -1,
  },
  splashText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
  },
  spinner: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorTitle: {
    fontFamily: 'Newsreader',
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  errorMessage: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});