import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeProvider';
import { useAppStore } from '../store';
import { getDb } from '../database/db-service';

type DashboardStats = {
  foodCount: number;
  ingredientCount: number;
  linkCount: number;
};

export default function AdminDashboardScreen({ navigation }: any) {
  const theme = useTheme();
  const { user } = useAppStore();
  const [stats, setStats] = React.useState<DashboardStats>({
    foodCount: 0,
    ingredientCount: 0,
    linkCount: 0,
  });

  const isAdmin = user.uid !== null && user.role === 'admin';

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const db = await getDb();
        const food = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM Foods;');
        const ingredient = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM Ingredients;');
        const link = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM Food_Ingredients;');

        setStats({
          foodCount: food?.count ?? 0,
          ingredientCount: ingredient?.count ?? 0,
          linkCount: link?.count ?? 0,
        });
      } catch (error) {
        console.error('[Admin] Load stats failed:', error);
      }
    };

    loadStats();
  }, []);

  const styles = createStyles(theme);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
        <View style={styles.unauthorizedWrap}>
          <MaterialIcons name="lock" size={36} color={theme.colors.error} />
          <Text style={styles.unauthorizedTitle}>Không có quyền truy cập</Text>
          <Text style={styles.unauthorizedText}>Trang này chỉ dành cho tài khoản admin.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Xin chào {user.displayName || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={8}>
          <MaterialIcons name="person" size={26} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Món ăn</Text>
            <Text style={styles.cardValue}>{stats.foodCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Nguyên liệu</Text>
            <Text style={styles.cardValue}>{stats.ingredientCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Liên kết</Text>
            <Text style={styles.cardValue}>{stats.linkCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Vai trò</Text>
            <Text style={styles.cardValue}>ADMIN</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chức năng quản trị</Text>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('AdminFoods')}>
            <MaterialIcons name="restaurant-menu" size={22} color={theme.colors.primary} />
            <Text style={styles.actionText}>Quản lý món ăn (xem, sửa, xóa)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Settings')}>
            <MaterialIcons name="settings" size={22} color={theme.colors.primary} />
            <Text style={styles.actionText}>Cài đặt hệ thống</Text>
          </TouchableOpacity>
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
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: 4,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    card: {
      width: '48%',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      padding: theme.spacing.md,
    },
    cardLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    cardValue: {
      marginTop: 8,
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
    },
    section: {
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.xs,
      marginTop: 6,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    actionText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
    },
    unauthorizedWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
    },
    unauthorizedTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
    },
    unauthorizedText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
