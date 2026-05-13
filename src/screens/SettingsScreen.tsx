import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import * as Haptics from 'expo-haptics';

type Props = {
  navigation: any;
};

interface SettingItem {
  id: string;
  icon: string;
  label: string;
  description?: string;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  rightElement?: React.ReactNode;
}

export default function SettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { user, clearUser, settings, setSettings } = useAppStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme.isDark);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;

  // Entry animation
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Button press animation
    Animated.sequence([
      Animated.timing(logoutScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(logoutScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearUser();
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleToggleNotifications = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(value);
    setSettings({ ...settings, notificationsEnabled: value });
  };

  const handleToggleDarkMode = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDarkModeEnabled(value);
    theme.toggleTheme();
  };

  const handleSettingPress = (item: SettingItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.onPress) {
      item.onPress();
    }
  };

  const styles = createStyles(theme);

  const settingSections: SettingItem[][] = [
    // Account Section
    [
      {
        id: 'profile',
        icon: 'person',
        label: 'Thông tin cá nhân',
        description: user.displayName || 'Người dùng',
        type: 'navigation',
        onPress: () => navigation.navigate('Profile'),
      },
      {
        id: 'email',
        icon: 'email',
        label: 'Email',
        description: user.email || 'Chưa cập nhật',
        type: 'navigation',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Thông báo', 'Tính năng thay đổi email đang được phát triển');
        },
      },
    ],
    // Preferences Section
    [
      {
        id: 'notifications',
        icon: 'notifications',
        label: 'Thông báo',
        description: 'Nhận thông báo về món ăn mới',
        type: 'toggle',
        value: notificationsEnabled,
        onToggle: handleToggleNotifications,
      },
      {
        id: 'darkMode',
        icon: 'dark-mode',
        label: 'Chế độ tối',
        description: 'Giao diện tối cho mắt',
        type: 'toggle',
        value: darkModeEnabled,
        onToggle: handleToggleDarkMode,
      },
      {
        id: 'language',
        icon: 'language',
        label: 'Ngôn ngữ',
        description: settings.language === 'vi' ? 'Tiếng Việt' : 'English',
        type: 'navigation',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Thông báo', 'Tính năng thay đổi ngôn ngữ đang được phát triển');
        },
        rightElement: (
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        ),
      },
    ],
    // Support Section
    [
      {
        id: 'help',
        icon: 'help-outline',
        label: 'Trợ giúp & Hỗ trợ',
        type: 'navigation',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Trợ giúp', 'Liên hệ: support@luckyfood.com\nHotline: 1900-xxxx');
        },
        rightElement: (
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        ),
      },
      {
        id: 'about',
        icon: 'info',
        label: 'Về LuckyFood',
        description: 'Phiên bản 1.0.0',
        type: 'navigation',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Về LuckyFood', 'LuckyFood v1.0.0\n\nỨng dụng giúp bạn khám phá và chọn món ăn ngon mỗi ngày.\n\nDesign & Development by zney_LQK');
        },
        rightElement: (
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        ),
      },
    ],
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <Animated.View
        key={item.id}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }],
        }}
      >
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress(item)}
          activeOpacity={0.7}
          disabled={item.type === 'toggle'}
        >
          <View style={styles.settingItemLeft}>
            <View style={styles.iconBox}>
              <MaterialIcons
                name={item.icon as any}
                size={22}
                color={item.type === 'toggle' && item.value ? theme.colors.primary : theme.colors.text}
              />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemLabel}>{item.label}</Text>
              {item.description && (
                <Text style={styles.settingItemDescription}>{item.description}</Text>
              )}
            </View>
          </View>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme.colors.borderSubtle, true: theme.colors.primary }}
              thumbColor={item.value ? theme.colors.surface : theme.colors.textSecondary}
              ios_backgroundColor={theme.colors.borderSubtle}
            />
          ) : (
            item.rightElement || (
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
            )
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={40} color={theme.colors.surface} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.displayName || 'Người dùng'}</Text>
              <Text style={styles.profileEmail}>{user.email || 'user@example.com'}</Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Profile');
              }}
            >
              <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.map((item) => renderSettingItem(item))}
          </View>
        ))}

        {/* Logout Button */}
        <Animated.View
          style={{
            transform: [{ scale: logoutScale }],
          }}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialIcons name="logout" size={24} color={theme.colors.surface} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>LuckyFood v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💕 by zney_LQK</Text>
        </View>
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
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.primaryContainer,
      margin: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.small,
    },
    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    profileEmail: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      opacity: 0.8,
    },
    editProfileButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    section: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      ...theme.shadows.small,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.borderSubtle,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingItemContent: {
      flex: 1,
    },
    settingItemLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    settingItemDescription: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.error,
      margin: theme.spacing.xl,
      paddingVertical: 18,
      borderRadius: theme.borderRadius.xl,
      ...theme.shadows.medium,
    },
    logoutText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      gap: 4,
    },
    versionText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    versionSubtext: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      opacity: 0.6,
    },
  });
