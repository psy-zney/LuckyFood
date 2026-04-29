import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { bootstrapDatabase } from './src/database/db-service';
import { useAppStore, useSettings } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/utils/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const settings = useSettings();
  const setFirstLaunch = useAppStore((s) => s.setFirstLaunch);

  useEffect(() => {
    const init = async () => {
      // Khởi tạo DB + seed data (nếu là lần chạy đầu)
      await bootstrapDatabase(settings.isFirstLaunch);

      if (settings.isFirstLaunch) {
        // Đánh dấu đã chạy lần đầu để không seed lại
        setFirstLaunch(false);
      }

      setReady(true);
    };

    init().catch(console.error);
  }, []);

  // Splash / Loading screen đơn giản
  if (!ready) {
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
