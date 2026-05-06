import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { useStreak, useAppStore } from '../store';
import { useAuth } from '../utils/AuthProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodItem } from '../database/mockData';
import { getDb } from '../database/db-service';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList>;
};

export default function HomeScreen({ navigation }: Props) {
  const { current, highest } = useStreak();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { getTopFoods } = useAppStore();
  const [topFoods, setTopFoods] = React.useState<FoodItem[]>([]);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideUpAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Load top foods
    loadTopFoods();
  }, []);

  const loadTopFoods = async () => {
    try {
      const db = await getDb();
      const topFoodIds = getTopFoods(5);
      if (topFoodIds.length > 0) {
        const placeholders = topFoodIds.map(() => '?').join(',');
        const foods = await db.getAllAsync<FoodItem>(
          `SELECT * FROM foods WHERE id IN (${placeholders})`,
          topFoodIds
        );
        setTopFoods(foods);
      }
    } catch (error) {
      console.error('Error loading top foods:', error);
    }
  };

  const streakPercentage = Math.min((current / 7) * 100, 100);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      com: '#FF6B6B',
      'bun-pho': '#4ECDC4',
      banh: '#FFE66D',
      chay: '#95E1D3',
      nuoc: '#A8E6CF',
    };
    return colors[category] || theme.colors.primary;
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="search" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <MaterialIcons name="restaurant" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>LuckyFood</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Calendar')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="calendar-month" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="menu" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Chào mừng trở lại! 💕</Text>
            <Text style={styles.welcomeSubtext}>Hôm nay bạn muốn ăn gì?</Text>
          </View>

          {/* Daily Cooking Streak */}
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakIcon}>
                <MaterialIcons name="local-fire-department" size={24} color={theme.colors.surface} />
              </View>
              <View style={styles.streakInfo}>
                <Text style={styles.streakTitle}>Chuỗi Nấu Ăn</Text>
                <Text style={styles.streakSubtitle}>Cao nhất: {highest} ngày</Text>
              </View>
            </View>
            <View style={styles.streakProgress}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${streakPercentage}%` }]} />
              </View>
              <Text style={styles.streakText}>Ngày {current} / 7</Text>
            </View>
          </View>

          {/* What to eat today? (Random Wheel) */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RandomWheel')}
            style={styles.randomSection}
          >
            <View style={styles.randomInner}>
              <View style={styles.randomTextBlock}>
                <View style={styles.randomBadge}>
                  <MaterialIcons name="favorite" size={16} color={theme.colors.surface} />
                  <Text style={styles.randomBadgeText}>Nổi bật</Text>
                </View>
                <Text style={styles.randomEyebrow}>HÔM NAY ĂN GÌ?</Text>
                <Text style={styles.randomTitle}>Để số phận{`\n`}quyết định</Text>
                <View style={styles.randomCta}>
                  <MaterialIcons name="casino" size={18} color={theme.colors.surface} />
                  <Text style={styles.randomCtaText}>Đổ Xúc Xắc</Text>
                </View>
              </View>
              <Image
                source={require('../assets/images/xuc_xac-removebg-preview.png')}
                style={styles.randomDicePreview}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          {/* Top Picks - Most Popular */}
          {topFoods.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.displayTitle}>Top Đề Xuất</Text>
                <View style={styles.topBadge}>
                  <MaterialIcons name="trending-up" size={16} color={theme.colors.surface} />
                  <Text style={styles.topBadgeText}>Phổ biến</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topPicksScroll}
              >
                {topFoods.map((food) => (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.topPickCard}
                    onPress={() => {
                      (navigation.getParent() as NativeStackNavigationProp<RootStackParamList>).navigate('FoodDetail', { food });
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.topPickImagePlaceholder, { backgroundColor: getCategoryColor(food.category) }]}>
                      <MaterialIcons name="restaurant" size={32} color="rgba(255,255,255,0.8)" />
                    </View>
                    <View style={styles.topPickInfo}>
                      <Text style={styles.topPickName} numberOfLines={1}>{food.name}</Text>
                      <View style={styles.topPickMeta}>
                        <MaterialIcons name="schedule" size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.topPickMetaText}>{food.prepTime} phút</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Find recipes by ingredients (Filter) */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.displayTitle}>Theo nguyên liệu</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => navigation.navigate('Filter')}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
                <MaterialIcons name="arrow-forward" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.searchBarFake}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Filter')}
            >
              <MaterialIcons name="tune" size={22} color={theme.colors.textSecondary} />
              <Text style={styles.searchPlaceholder}>Tủ lạnh đang có gì?</Text>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Search')}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="search" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Tìm món</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Favourites')}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="favorite" size={24} color={theme.colors.heart} />
              </View>
              <Text style={styles.quickActionText}>Yêu thích</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Filter')}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <MaterialIcons name="category" size={24} color={theme.colors.secondary} />
              </View>
              <Text style={styles.quickActionText}>Nguyên liệu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

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
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    iconButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },

    // Welcome Section
    welcomeSection: {
      marginBottom: theme.spacing.xl,
    },
    welcomeText: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      letterSpacing: -0.5,
    },
    welcomeSubtext: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },

    // Streak Card
    streakCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      ...theme.shadows.medium,
    },
    streakHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    streakIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakInfo: {
      flex: 1,
    },
    streakTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      marginBottom: 2,
    },
    streakSubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    streakProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    progressBarBg: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    streakText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },

    // Random Section
    randomSection: {
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.primaryContainer,
      overflow: 'hidden',
      ...theme.shadows.large,
    },
    randomInner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    randomTextBlock: {
      flex: 1,
      gap: theme.spacing.sm,
    },
    randomBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
      alignSelf: 'flex-start',
    },
    randomBadgeText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    randomEyebrow: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      letterSpacing: 2,
      color: theme.colors.primary,
      textTransform: 'uppercase',
      fontWeight: theme.typography.weights.medium,
    },
    randomTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: 28,
      lineHeight: 32,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: -0.5,
    },
    randomCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.lg,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    randomCtaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
    randomDicePreview: {
      width: 120,
      height: 120,
      marginLeft: theme.spacing.md,
    },

    // Section
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    displayTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.bold,
      letterSpacing: -0.5,
    },
    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    viewAllText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.semiBold,
    },
    topBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    topBadgeText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    topPicksScroll: {
      gap: theme.spacing.md,
    },
    topPickCard: {
      width: 140,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      overflow: 'hidden',
    },
    topPickImagePlaceholder: {
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topPickInfo: {
      padding: theme.spacing.md,
    },
    topPickName: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    topPickMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    topPickMetaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
    searchBarFake: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    searchPlaceholder: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
    },

    // Quick Actions
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    quickActionItem: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    quickActionIcon: {
      width: 64,
      height: 64,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    quickActionText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
  });
