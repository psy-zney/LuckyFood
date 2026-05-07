import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Animated, Modal, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { useStreak, useAppStore } from '../store';
import { useAuth } from '../utils/AuthProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodItem } from '../database/mockData';
import { getDb } from '../database/db-service';
import { Pulse } from '../components/animations';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export default function HomeScreen({ navigation }: Props) {
  const { current, highest } = useStreak();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { getTopFoods } = useAppStore();
  const [topFoods, setTopFoods] = React.useState<FoodItem[]>([]);
  const [dailyFoods, setDailyFoods] = React.useState<FoodItem[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  // Animation values - Staggered entry
  const headerAnim = React.useRef(new Animated.Value(0)).current;
  const welcomeAnim = React.useRef(new Animated.Value(0)).current;
  const streakAnim = React.useRef(new Animated.Value(0)).current;
  const sectionsAnim = React.useRef(new Animated.Value(0)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Staggered entry animation
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(streakAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(sectionsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: streakPercentage,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Load top foods
    loadTopFoods();
  }, []);

  const loadTopFoods = async () => {
    try {
      const db = await getDb();
      const topFoodIds = getTopFoods(5);
      
      // Load top foods based on popularity
      if (topFoodIds.length > 0) {
        const placeholders = topFoodIds.map(() => '?').join(',');
        const foods = await db.getAllAsync<FoodItem>(
          `SELECT * FROM foods WHERE id IN (${placeholders})`,
          topFoodIds
        );
        setTopFoods(foods);
      } else {
        // Fallback: Just get first 5 items if no popularity data exists yet
        const foods = await db.getAllAsync<FoodItem>('SELECT * FROM foods LIMIT 5');
        setTopFoods(foods);
      }

      // Load daily recommendations (5 random items)
      const daily = await db.getAllAsync<FoodItem>('SELECT * FROM foods ORDER BY RANDOM() LIMIT 5');
      setDailyFoods(daily);
      
    } catch (error) {
      console.error('Error loading top foods:', error);
    }
  };

  const streakPercentage = Math.min((current / 7) * 100, 100);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

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
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="menu" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={20} color={theme.colors.primary} />
            <Text style={styles.streakBadgeText}>{current}</Text>
          </View>
        </View>

        <View style={styles.logoContainer}>
          <MaterialIcons name="restaurant" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>LuckyFood</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="search" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { marginLeft: 4 }]}
            onPress={() => navigation.navigate('Calendar')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="calendar-month" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <Animated.View
          style={{
            opacity: welcomeAnim,
            transform: [{ translateY: welcomeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Chào mừng trở lại! 💕</Text>
            <Text style={styles.welcomeSubtext}>Hôm nay bạn muốn ăn gì?</Text>
          </View>
        </Animated.View>

        {/* Daily Cooking Streak */}
        <Animated.View
          style={{
            opacity: streakAnim,
            transform: [{ scale: streakAnim }],
          }}
        >
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
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
              <Text style={styles.streakText}>Ngày {current} / 7</Text>
            </View>
          </View>
        </Animated.View>

        {/* Top Picks - Most Popular */}
        {topFoods.length > 0 && (
          <Animated.View
            style={{
              opacity: sectionsAnim,
              transform: [{ translateY: sectionsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            }}
          >
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.displayTitle}>Top Phổ Biến</Text>
                <View style={styles.topBadge}>
                  <MaterialIcons name="trending-up" size={16} color={theme.colors.surface} />
                  <Text style={styles.topBadgeText}>Nổi bật</Text>
                </View>
              </View>

              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topPicksScroll}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
              >
                {topFoods.map((food, index) => {
                  const inputRange = [
                    (index - 1) * 150,
                    index * 150,
                    (index + 1) * 150,
                  ];
                  const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.9, 1, 0.9],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View key={`top-${food.id}`} style={{ transform: [{ scale }] }}>
                      <TouchableOpacity
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
                    </Animated.View>
                  );
                })}
              </Animated.ScrollView>
            </View>
          </Animated.View>
        )}

        {/* Daily Recommendations */}
        {dailyFoods.length > 0 && (
          <Animated.View
            style={{
              opacity: sectionsAnim,
              transform: [{ translateY: sectionsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            }}
          >
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.displayTitle}>Gợi Ý Hôm Nay</Text>
                <View style={[styles.topBadge, { backgroundColor: theme.colors.secondary }]}>
                  <MaterialIcons name="star" size={16} color={theme.colors.surface} />
                  <Text style={styles.topBadgeText}>Hôm nay</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topPicksScroll}
              >
                {dailyFoods.map((food) => (
                  <TouchableOpacity
                    key={`daily-${food.id}`}
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
          </Animated.View>
        )}

        {/* What to eat today? (Random Wheel) */}
        <Animated.View
          style={{
            opacity: sectionsAnim,
          }}
        >
          <Pulse duration={1500}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RandomWheel')}
            style={styles.randomSection}
          >
            <View style={styles.randomInner}>
              <View style={styles.randomTextBlock}>
                <View style={[styles.randomBadge, { backgroundColor: theme.colors.tertiary }]}>
                  <MaterialIcons name="casino" size={16} color={theme.colors.surface} />
                  <Text style={styles.randomBadgeText}>Xúc xắc</Text>
                </View>
                <Text style={styles.randomEyebrow}>HÔM NAY ĂN GÌ?</Text>
                <Text style={styles.randomTitle}>Để số phận{`\n`}quyết định</Text>
                <View style={styles.randomCta}>
                  <MaterialIcons name="play-arrow" size={18} color={theme.colors.surface} />
                  <Text style={styles.randomCtaText}>Quay ngay</Text>
                </View>
              </View>
              <Image
                source={require('../assets/images/xuc_xac-removebg-preview.png')}
                style={styles.randomDicePreview}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          </Pulse>
        </Animated.View>

        {/* Find recipes by ingredients (Filter) */}
        <Animated.View
          style={{
            opacity: sectionsAnim,
            transform: [{ translateY: sectionsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }}
        >
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
      alignItems: 'center',
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.sm, // Dịch qua phải 1 chút (thay vì lg)
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      marginLeft: 4,
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    streakBadgeText: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
    },
    headerRight: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    iconButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.round,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
