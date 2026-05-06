import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { FoodItem } from '../database/mockData';
import { getDb } from '../database/db-service';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList>;
};

const MEAL_TYPES = [
  { key: 'breakfast' as const, label: 'Sáng', icon: 'wb-sunny' },
  { key: 'lunch' as const, label: 'Trưa', icon: 'restaurant' },
  { key: 'dinner' as const, label: 'Tối', icon: 'nights-stay' },
  { key: 'snack' as const, label: 'Ăn vặt', icon: 'cookie' },
];

export default function CalendarScreen({ navigation }: Props) {
  const theme = useTheme();
  const { getMealsByDate, getMealDates, addMeal, removeMeal } = useAppStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<FoodItem[]>([]);
  const [mealEntries, setMealEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mealDates, setMealDates] = useState<string[]>([]);

  useEffect(() => {
    loadMealDates();
  }, []);

  useEffect(() => {
    loadMealsForDate(selectedDate);
  }, [selectedDate]);

  const loadMealDates = () => {
    const dates = getMealDates();
    setMealDates(dates);
  };

  const loadMealsForDate = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const entries = getMealsByDate(dateStr);
      setMealEntries(entries);

      if (entries.length > 0) {
        const db = await getDb();
        const foodIds = entries.map(e => e.foodId);
        const placeholders = foodIds.map(() => '?').join(',');
        const foods = await db.getAllAsync<FoodItem>(
          `SELECT * FROM foods WHERE id IN (${placeholders})`,
          foodIds
        );
        setMeals(foods);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getMealsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entries = getMealsByDate(dateStr);
    return entries;
  };

  const hasMealOnDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mealDates.includes(dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  const getMealTypeLabel = (type: string) => {
    const mealType = MEAL_TYPES.find(m => m.key === type);
    return mealType ? mealType.label : type;
  };

  const getMealTypeIcon = (type: string) => {
    const mealType = MEAL_TYPES.find(m => m.key === type);
    return mealType ? mealType.icon : 'restaurant';
  };

  const getMealTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      breakfast: '#FF6B6B',
      lunch: '#4ECDC4',
      dinner: '#FFE66D',
      snack: '#95E1D3',
    };
    return colors[type] || theme.colors.primary;
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="calendar-month" size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Lịch Ăn</Text>
        </View>
        <Text style={styles.headerSubtitle}>Theo dõi bữa ăn hàng ngày</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Weekday Headers */}
          <View style={styles.weekdayRow}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <Text key={day} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>

          {/* Days */}
          <View style={styles.daysGrid}>
            {getDaysInMonth(currentDate).map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const hasMeal = hasMealOnDay(day);
              const today = isToday(day);
              const selected = isSelected(day);
              const dayMeals = getMealsForDay(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    selected && styles.dayCellSelected,
                    today && styles.dayCellToday,
                  ]}
                  onPress={() => selectDate(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selected && styles.dayTextSelected,
                      today && styles.dayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {/* Meal Images - Stacked like Locket */}
                  {dayMeals.length > 0 && (
                    <View style={styles.mealImagesContainer}>
                      {dayMeals.slice(0, 3).map((entry, idx) => (
                        <View
                          key={entry.foodId}
                          style={[
                            styles.mealImageDot,
                            { backgroundColor: getMealTypeColor(entry.mealType) },
                            idx > 0 && styles.mealImageDotStacked,
                          ]}
                        />
                      ))}
                      {dayMeals.length > 3 && (
                        <View style={styles.mealImageMore}>
                          <Text style={styles.mealImageMoreText}>+{dayMeals.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Meals */}
        <View style={styles.mealsSection}>
          <View style={styles.mealsHeader}>
            <MaterialIcons name="event" size={20} color={theme.colors.primary} />
            <Text style={styles.mealsHeaderTitle}>{formatDate(selectedDate)}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : meals.length > 0 ? (
            <View style={styles.mealsList}>
              {meals.map((food) => {
                const entry = mealEntries.find(e => e.foodId === food.id);
                return (
                  <View key={food.id} style={styles.mealCard}>
                    <View style={styles.mealCardHeader}>
                      <View style={styles.mealTypeBadge}>
                        <MaterialIcons
                          name={getMealTypeIcon(entry?.mealType) as any}
                          size={16}
                          color={theme.colors.surface}
                        />
                        <Text style={styles.mealTypeText}>{getMealTypeLabel(entry?.mealType)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeMealBtn}
                        onPress={() => {
                          const dateStr = selectedDate.toISOString().split('T')[0];
                          removeMeal(dateStr, food.id);
                          loadMealsForDate(selectedDate);
                          loadMealDates();
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.mealName}>{food.name}</Text>
                    <View style={styles.mealMeta}>
                      <MaterialIcons name="schedule" size={14} color={theme.colors.textSecondary} />
                      <Text style={styles.mealMetaText}>{food.prepTime} phút</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="restaurant-menu" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>Chưa có bữa ăn nào</Text>
              <Text style={styles.emptySubtext}>Chọn món ăn từ trang chủ để thêm vào lịch</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Thống kê tháng này</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="restaurant" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}>{mealDates.length}</Text>
              <Text style={styles.statLabel}>Ngày có ăn</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={24} color={theme.colors.secondary} />
              <Text style={styles.statValue}>{meals.length}</Text>
              <Text style={styles.statLabel}>Tổng món</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Design & Development by zney_LQK</Text>
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
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
    },
    monthNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    calendarContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      ...theme.shadows.medium,
    },
    weekdayRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekdayText: {
      flex: 1,
      textAlign: 'center',
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      position: 'relative',
    },
    dayCellSelected: {
      backgroundColor: theme.colors.primary,
    },
    dayCellToday: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    dayText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    dayTextSelected: {
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
    },
    dayTextToday: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.bold,
    },
    mealIndicator: {
      position: 'absolute',
      bottom: 4,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.secondary,
    },
    mealImagesContainer: {
      position: 'absolute',
      bottom: 4,
      flexDirection: 'row',
      gap: 2,
    },
    mealImageDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    mealImageDotStacked: {
      marginLeft: -4,
    },
    mealImageMore: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -2,
    },
    mealImageMoreText: {
      fontSize: 8,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    mealsSection: {
      marginBottom: theme.spacing.xl,
    },
    mealsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    mealsHeaderTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
    },
    mealsList: {
      gap: theme.spacing.sm,
    },
    mealCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    mealCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    mealTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    mealTypeText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
    },
    removeMealBtn: {
      padding: theme.spacing.xs,
    },
    mealName: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    mealMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    mealMetaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    emptyText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    emptySubtext: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    statsSection: {
      marginBottom: theme.spacing.xl,
    },
    statsTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    statValue: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    statLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
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
  });
