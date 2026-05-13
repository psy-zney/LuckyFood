import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { StaggerIn } from '../components/animations';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { user, clearUser } = useAppStore();
  const isAuthenticated = user.uid !== null;
  const isAdmin = isAuthenticated && user.role === 'admin';

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearUser();
    }, 200);
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Auth');
  };

  const toggleTheme = () => {
    theme.toggleTheme();
  };

  const menuItems = isAdmin
    ? [
        { icon: 'admin-panel-settings', label: 'Trang quản trị', screen: 'AdminDashboard' },
        { icon: 'settings', label: 'Cài đặt', screen: 'Settings' },
      ]
    : [
        { icon: 'home', label: 'Trang chủ', screen: 'Home' },
        { icon: 'search', label: 'Tìm món', screen: 'Search' },
        { icon: 'casino', label: 'Xúc xắc', screen: 'RandomWheel' },
        { icon: 'tune', label: 'Theo nguyên liệu', screen: 'Filter' },
        { icon: 'favorite', label: 'Yêu thích', screen: 'Favourites' },
        { icon: 'calendar-month', label: 'Lịch ăn', screen: 'Calendar' },
      ];

  const styles = createStyles(theme);

  const navigateMenu = (screen: string) => {
    if (['Home', 'RandomWheel', 'Filter', 'Favourites'].includes(screen)) {
      navigation.navigate('MainTabs', { screen });
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.accountBox}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name={isAuthenticated ? 'person' : 'person-outline'} size={40} color={theme.colors.surface} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{isAuthenticated ? user.displayName || 'Người dùng' : 'Khách'}</Text>
            <Text style={styles.userEmail}>
              {isAuthenticated ? user.email || 'user@example.com' : 'Đăng nhập để trải nghiệm đầy đủ'}
            </Text>
            {isAuthenticated ? <Text style={styles.roleBadge}>{isAdmin ? 'ADMIN' : 'USER'}</Text> : null}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <StaggerIn key={item.screen} delay={index * 50} duration={300}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigateMenu(item.screen)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconBox}>
                    <MaterialIcons name={item.icon as any} size={22} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </StaggerIn>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialIcons name={theme.isDark ? 'light-mode' : 'dark-mode'} size={22} color={theme.colors.text} />
              </View>
              <Text style={styles.menuItemText}>Giao diện tối</Text>
            </View>
            <Text style={styles.settingValue}>{theme.isDark ? 'Bật' : 'Tắt'}</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TouchableOpacity
            style={[styles.logoutButton, !isAuthenticated && styles.loginButton]}
            onPress={isAuthenticated ? handleLogout : handleLogin}
            activeOpacity={0.8}
          >
            <MaterialIcons name={isAuthenticated ? 'logout' : 'login'} size={24} color={theme.colors.surface} />
            <Text style={styles.logoutText}>{isAuthenticated ? 'Đăng xuất' : 'Đăng nhập'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      letterSpacing: 0,
    },
    scrollView: {
      flex: 1,
    },
    accountBox: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.primaryContainer,
      margin: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      ...theme.shadows.small,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    userEmail: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      opacity: 0.85,
    },
    roleBadge: {
      marginTop: 8,
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.primary,
      color: theme.colors.surface,
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.body,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
      marginHorizontal: theme.spacing.xl,
      marginVertical: theme.spacing.sm,
    },
    menuSection: {
      paddingVertical: theme.spacing.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    settingValue: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.error,
      margin: theme.spacing.xl,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.medium,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
    },
    logoutText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0,
    },
  });
