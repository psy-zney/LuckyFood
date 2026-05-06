import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { user, clearUser, incrementStreak } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigation.replace('Login');
  };

  const handleCookComplete = () => {
    incrementStreak();
    alert('Chúc mừng! Chuỗi nấu ăn của bạn đã được cập nhật! 🎉');
  };

  const menuItems = [
    { icon: 'home', label: 'Trang chủ', screen: 'Home' },
    { icon: 'search', label: 'Tìm món', screen: 'Search' },
    { icon: 'favorite', label: 'Yêu thích', screen: 'Favourites' },
    { icon: 'tune', label: 'Theo nguyên liệu', screen: 'Filter' },
    { icon: 'calendar-month', label: 'Lịch ăn', screen: 'Calendar' },
    { icon: 'casino', label: 'Xúc xắc', screen: 'RandomWheel' },
  ];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={48} color={theme.colors.surface} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName || 'Người dùng'}</Text>
            <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="local-fire-department" size={32} color={theme.colors.primary} />
            <Text style={styles.statValue}>{user.currentStreak}</Text>
            <Text style={styles.statLabel}>Ngày hiện tại</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="emoji-events" size={32} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{user.highestStreak}</Text>
            <Text style={styles.statLabel}>Cao nhất</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCookComplete}>
            <MaterialIcons name="restaurant" size={24} color={theme.colors.surface} />
            <Text style={styles.actionButtonText}>Đã nấu xong món ăn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={() => navigation.navigate('Favourites')}>
            <MaterialIcons name="favorite" size={24} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Xem yêu thích</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Cài đặt</Text>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.text} />
            <Text style={styles.settingText}>Thông báo</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="language" size={24} color={theme.colors.text} />
            <Text style={styles.settingText}>Ngôn ngữ</Text>
            <Text style={styles.settingValue}>Tiếng Việt</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="dark-mode" size={24} color={theme.colors.text} />
            <Text style={styles.settingText}>Chế độ tối</Text>
            <Text style={styles.settingValue}>Theo hệ thống</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="info" size={24} color={theme.colors.text} />
            <Text style={styles.settingText}>Về ứng dụng</Text>
            <Text style={styles.settingValue}>v1.0.0</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={theme.colors.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Design & Development by zney_LQK</Text>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.menuList}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate(item.screen);
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name={item.icon as any} size={24} color={theme.colors.primary} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.lg,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    userEmail: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.small,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    statLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    statDivider: {
      width: 1,
      backgroundColor: theme.colors.borderSubtle,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    actionButtonText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    settingsContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
    },
    settingsTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    settingText: {
      flex: 1,
      fontFamily: theme      .typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
    },
    settingValue: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.errorContainer,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.lg,
    },
    logoutText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onErrorContainer,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    footerText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      width: '80%',
      maxWidth: 320,
      ...theme.shadows.large,
    },
    menuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    menuTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    menuList: {
      paddingVertical: theme.spacing.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    menuItemText: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
    },
  });
