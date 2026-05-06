import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { useAppStore } from '../store';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Favourites'>;
};

export default function FavouritesScreen({ navigation }: Props) {
  const { favourites, removeFavourite } = useAppStore();
  const theme = useTheme();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideUpAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [favourites.length]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'com': return theme.colors.primaryContainer;
      case 'bun-pho': return theme.colors.secondaryContainer;
      case 'banh': return theme.colors.tertiaryContainer;
      case 'chay': return theme.colors.secondaryContainer;
      case 'nuoc': return theme.colors.tertiaryContainer;
      default: return theme.colors.surfaceVariant;
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'com': return theme.colors.primary;
      case 'bun-pho': return theme.colors.secondary;
      case 'banh': return theme.colors.tertiary;
      case 'chay': return theme.colors.secondary;
      case 'nuoc': return theme.colors.tertiary;
      default: return theme.colors.text;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'com': return 'Cơm';
      case 'bun-pho': return 'Bún/Phở';
      case 'banh': return 'Bánh';
      case 'chay': return 'Chay';
      case 'nuoc': return 'Nước';
      default: return category;
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="favorite" size={28} color={theme.colors.heart} />
          <View>
            <Text style={styles.headerTitle}>Yêu Thích</Text>
            <Text style={styles.headerSubtitle}>
              {favourites.length} món ăn được lưu
            </Text>
          </View>
        </View>
      </View>

      {favourites.length === 0 ? (
        <Animated.View
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.emptyIcon}>
            <MaterialIcons name="favorite-border" size={64} color={theme.colors.surfaceVariant} />
          </View>
          <Text style={styles.emptyTitle}>Chưa có món yêu thích</Text>
          <Text style={styles.emptySubtitle}>
            Đánh dấu các món ăn bạn thích để xem lại nhanh hơn.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="explore" size={20} color={theme.colors.surface} />
            <Text style={styles.exploreBtnText}>Khám phá món ăn</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideUpAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={styles.foodRow}
                activeOpacity={0.7}
                onPress={() => {
                  (navigation.getParent() as NativeStackNavigationProp<RootStackParamList>).navigate('FoodDetail', { food: item });
                }}
              >
                <View style={styles.foodInfo}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                    <Text style={[styles.categoryText, { color: getCategoryTextColor(item.category) }]}>
                      {getCategoryLabel(item.category)}
                    </Text>
                  </View>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>{item.prepTime} phút</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.favBtn}
                  onPress={() => removeFavourite(item.id)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="favorite" size={28} color={theme.colors.heart} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}


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
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: 2,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      gap: theme.spacing.lg,
    },
    emptyIcon: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 280,
    },
    exploreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.medium,
    },
    exploreBtnText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
      fontSize: theme.typography.sizes.md,
      letterSpacing: 0.3,
    },
    listContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: 100,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
      marginVertical: theme.spacing.sm,
    },
    foodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    foodInfo: {
      flex: 1,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
      marginBottom: theme.spacing.xs,
    },
    categoryText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    foodName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.weights.semiBold,
    },
    foodDesc: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
    favBtn: {
      padding: theme.spacing.sm,
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
