import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDb } from '../database/db-service';
import { useTheme } from '../utils/ThemeProvider';
import { FoodItem } from '../database/mockData';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'RandomWheel'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Placeholder names shown during the slot-machine spin
const PLACEHOLDER_NAMES = [
  'Phở bò', 'Cơm tấm', 'Bún bò Huế', 'Bánh mì',
  'Mì xào', 'Gà kho gừng', 'Canh chua', 'Bún đậu',
  'Cơm sườn', 'Đậu hũ sốt cà',
];

export default function RandomWheelScreen({ navigation }: Props) {
  const [result, setResult] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotText, setSlotText] = useState('?');
  const theme = useTheme();
  const { incrementPopularity, addMeal } = useAppStore();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slotOpacity = useRef(new Animated.Value(0)).current;
  const slotScale = useRef(new Animated.Value(0.6)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const spinRotation = useRef(new Animated.Value(0)).current;

  // Idle pulse on the button
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Idle glow
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  const spin = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);

    // Reset
    resultAnim.setValue(0);
    slotOpacity.setValue(1);
    slotScale.setValue(0.6);
    spinRotation.setValue(0);

    // Button press effect
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Slot card entrance
    Animated.spring(slotScale, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Spin icon rotation
    Animated.loop(
      Animated.timing(spinRotation, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Slot machine text cycling
    const totalDuration = 2500; // ms
    const startTime = Date.now();
    let intervalId: ReturnType<typeof setTimeout>;

    const cycle = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= totalDuration) {
        clearTimeout(intervalId);
        finishRoll();
        return;
      }
      // Speed: fast at start → slow near end
      const progress = elapsed / totalDuration;
      const delay = 60 + Math.pow(progress, 3) * 400; // 60ms → 460ms
      const idx = Math.floor(Math.random() * PLACEHOLDER_NAMES.length);
      setSlotText(PLACEHOLDER_NAMES[idx]);
      intervalId = setTimeout(cycle, delay);
    };
    cycle();
  }, [loading, buttonScale, slotScale, slotOpacity, resultAnim, spinRotation]);

  const finishRoll = useCallback(async () => {
    // Stop spin
    spinRotation.stopAnimation();
    spinRotation.setValue(0);

    try {
      const db = await getDb();
      const food = await db.getFirstAsync<FoodItem>(
        'SELECT * FROM Foods ORDER BY RANDOM() LIMIT 1;',
      );

      if (food) {
        setSlotText(food.name);
        // Increment popularity for this food
        incrementPopularity(food.id);

        // Brief pause so user sees the final name in the slot
        setTimeout(() => {
          setResult(food);
          setLoading(false);

          // Animate result card
          Animated.parallel([
            Animated.timing(resultAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
            Animated.timing(slotOpacity, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, 400);
      } else {
        setSlotText('Không tìm thấy');
        setLoading(false);
      }
    } catch (err) {
      console.error('[RandomWheel] Error:', err);
      setSlotText('Lỗi!');
      setLoading(false);
    }
  }, [resultAnim, slotOpacity, spinRotation]);

  const reset = useCallback(() => {
    setResult(null);
    setSlotText('?');
    Animated.parallel([
      Animated.timing(resultAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slotOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slotScale, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [resultAnim, slotOpacity, slotScale]);

  const spinInterpolate = spinRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 24],
  });

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="casino" size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Xúc Xắc May Mắn</Text>
        </View>
        <Text style={styles.headerSubtitle}>Chạm để khám phá món ăn hôm nay 💕</Text>
      </View>

      <View style={styles.mainCanvas}>
        {/* Slot Display */}
        <Animated.View
          style={[
            styles.slotCard,
            {
              opacity: slotOpacity,
              transform: [{ scale: slotScale }],
            },
          ]}
        >
          <View style={styles.slotInner}>
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                <MaterialIcons name="autorenew" size={28} color={theme.colors.primary} />
              </Animated.View>
            ) : (
              <MaterialIcons name="restaurant-menu" size={28} color={theme.colors.primary} />
            )}
            <Text
              style={[
                styles.slotText,
                loading && styles.slotTextAnimating,
              ]}
              numberOfLines={1}
            >
              {slotText}
            </Text>
          </View>
        </Animated.View>

        {/* Roll Button */}
        {!result && (
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                transform: [
                  { scale: Animated.multiply(pulseAnim, buttonScale) },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={spin}
              disabled={loading}
              style={styles.rollButton}
            >
              <Animated.View
                style={[
                  styles.rollButtonGlow,
                  {
                    shadowRadius: glowShadowRadius,
                    shadowOpacity: glowShadowOpacity,
                  },
                ]}
              />
              <View style={styles.rollButtonContent}>
                <MaterialIcons
                  name={loading ? 'autorenew' : 'casino'}
                  size={40}
                  color={theme.colors.surface}
                />
                <Text style={styles.rollButtonText}>
                  {loading ? 'Đang tung...' : 'TUNG'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Result Card */}
        {result && (
          <Animated.View
            style={[
              styles.resultContainer,
              {
                opacity: resultAnim,
                transform: [
                  {
                    translateY: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 0],
                    }),
                  },
                  {
                    scale: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.resultCard}>
              {/* Result Header */}
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <MaterialIcons name="restaurant" size={32} color={theme.colors.surface} />
                </View>
                <Text style={styles.resultLabel}>Món ăn hôm nay</Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Food Name */}
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultDesc} numberOfLines={3}>
                {result.description}
              </Text>

              {/* Meta Info */}
              <View style={styles.resultMeta}>
                <View style={styles.metaChip}>
                  <MaterialIcons name="schedule" size={16} color={theme.colors.primary} />
                  <Text style={styles.metaText}>{result.prepTime} phút</Text>
                </View>
                <View style={styles.metaChip}>
                  <MaterialIcons name="category" size={16} color={theme.colors.primary} />
                  <Text style={styles.metaText}>{result.category}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.calendarBtn}
                  onPress={() => {
                    addMeal(result.id, 'lunch');
                    navigation.navigate('Calendar');
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="calendar-month" size={20} color={theme.colors.surface} />
                  <Text style={styles.calendarBtnText}>Chốt Món</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetBtn} onPress={reset}>
                  <MaterialIcons name="refresh" size={20} color={theme.colors.surface} />
                  <Text style={styles.resetBtnText}>Thử Lại</Text>
                </TouchableOpacity>
              </View>

              {/* Favourite Button */}
              <TouchableOpacity
                style={styles.favButton}
                onPress={() => {
                  // Add to favourites logic here
                  console.log('Add to favourites:', result.id);
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name="favorite" size={24} color={theme.colors.heart} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>


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
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
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

    mainCanvas: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.xl,
    },

    // Slot card
    slotCard: {
      width: SCREEN_WIDTH * 0.75,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      ...theme.shadows.large,
    },
    slotInner: {
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    slotText: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    slotTextAnimating: {
      color: theme.colors.primary,
    },

    // Roll button
    buttonWrapper: {
      alignItems: 'center',
    },
    rollButton: {
      width: 130,
      height: 130,
      borderRadius: 65,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    rollButtonGlow: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      elevation: 16,
    },
    rollButtonContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    rollButtonText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },

    // Result
    resultContainer: {
      width: '100%',
      alignItems: 'center',
    },
    resultCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      width: '100%',
      ...theme.shadows.large,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    resultIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultLabel: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    divider: {
      width: '60%',
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
      marginVertical: theme.spacing.sm,
    },
    resultName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
      fontWeight: theme.typography.weights.bold,
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    resultDesc: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      lineHeight: 24,
    },
    resultMeta: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.round,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    metaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    actionRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    calendarBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    calendarBtnText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
      fontSize: theme.typography.sizes.md,
      letterSpacing: 0.3,
    },
    resetBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    resetBtnText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
      fontSize: theme.typography.sizes.md,
      letterSpacing: 0.3,
    },
    favButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      ...theme.shadows.medium,
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
