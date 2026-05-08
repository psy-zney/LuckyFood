import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { StaggerIn } from '../components/animations';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { user, clearUser } = useAppStore();

  // Animation values
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    // Logout after shake
    setTimeout(() => {
      clearUser();
      navigation.replace('Login');
    }, 200);
  };

  const toggleTheme = () => {
    theme.toggleTheme();
  };

  const menuItems = [
    { icon: 'home', label: 'Trang chủ', screen: 'Home' },
    { icon: 'search', label: 'Tìm món', screen: 'Search' },
    { icon: 'casino', label: 'Xúc xắc', screen: 'RandomWheel' },
    { icon: 'tune', label: 'Theo nguyên liệu', screen: 'Filter' },
    { icon: 'favorite', label: 'Yêu thích', screen: 'Favourites' },
    { icon: 'calendar-month', label: 'Lịch ăn', screen: 'Calendar' },
  ];

  const styles = createStyles(theme);

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
        {/* Account Box */}
        <View style={styles.accountBox}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={40} color={theme.colors.surface} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName || 'Người dùng'}</Text>
            <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Main Functions */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <StaggerIn key={index} delay={index * 50} duration={300}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  if (['Home', 'RandomWheel', 'Filter', 'Favourites'].includes(item.screen)) {
                    navigation.navigate('MainTabs', { screen: item.screen });
                  } else {
                    navigation.navigate(item.screen);
                  }
                }}
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

        {/* Settings & System */}
        <View style={styles.menuSection}>
          <StaggerIn delay={menuItems.length * 50} duration={300}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <MaterialIcons name="settings" size={22} color={theme.colors.text} />
                </View>
                <Text style={styles.menuItemText}>Cài đặt</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </StaggerIn>

          <StaggerIn delay={(menuItems.length + 1) * 50} duration={300}>
            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <MaterialIcons name={theme.isDark ? 'light-mode' : 'dark-mode'} size={22} color={theme.colors.text} />
                </View>
                <Text style={styles.menuItemText}>Giao diện tối</Text>
              </View>
              <Text style={styles.settingValue}>{theme.isDark ? 'Bật' : 'Tắt'}</Text>
            </TouchableOpacity>
          </StaggerIn>
        </View>

        {/* Logout */}
        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
          }}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={24} color={theme.colors.surface} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
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
      letterSpacing: -0.5,
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
      opacity: 0.8,
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
    logoutText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
  });
