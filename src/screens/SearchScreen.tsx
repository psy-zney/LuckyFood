import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { getDb } from '../database/db-service';
import { FoodItem } from '../database/mockData';
import { useAppStore } from '../store';
import { StaggerIn } from '../components/animations';
type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Search'>;
};

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { favourites, addFavourite, removeFavourite } = useAppStore();
  const theme = useTheme();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const searchWidth = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Empty state bounce animation
  useEffect(() => {
    if (foods.length === 0 && !loading) {
      const bounceLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ])
      );
      bounceLoop.start();
      return () => bounceLoop.stop();
    }
  }, [foods.length, loading]);

  const searchFoods = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const db = await getDb();
      const sql = q.trim()
        ? `SELECT * FROM Foods WHERE name LIKE ? OR description LIKE ? ORDER BY name LIMIT 50`
        : `SELECT * FROM Foods ORDER BY name`;
      const results = q.trim()
        ? await db.getAllAsync<FoodItem>(sql, [`%${q}%`, `%${q}%`])
        : await db.getAllAsync<FoodItem>(sql);
      setFoods(results);

      // Animate results
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('[Search] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [fadeAnim]);

  useEffect(() => {
    searchFoods('');
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => searchFoods(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.spring(searchWidth, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.spring(searchWidth, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const isFavourite = (id: string) => favourites.some(f => f.id === id);

  const toggleFavourite = (item: FoodItem) => {
    if (isFavourite(item.id)) removeFavourite(item.id);
    else addFavourite(item);
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <MaterialIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Tìm Món Ăn</Text>
          <Text style={styles.headerSubtitle}>Khám phá hàng trăm món ngon 💕</Text>
        </View>
      </View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scaleX: searchWidth.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }],
          },
        ]}
      >
        <MaterialIcons name="search" size={22} color={searchFocused ? theme.colors.primary : theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên món hoặc mô tả..."
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <Animated.View
              style={[
                styles.emptyState,
                {
                  transform: [{ translateY: bounceAnim }],
                },
              ]}
            >
              <MaterialIcons name="search-off" size={64} color={theme.colors.surfaceVariant} />
              <Text style={styles.emptyTitle}>Không tìm thấy món nào</Text>
              <Text style={styles.emptySubtitle}>
                {query.length > 0
                  ? 'Thử từ khóa khác nhé'
                  : 'Nhập từ khóa để bắt đầu tìm kiếm'}
              </Text>
            </Animated.View>
          }
          renderItem={({ item, index }) => (
            <StaggerIn delay={index * 50} duration={300}>
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
                    onPress={() => toggleFavourite(item)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={isFavourite(item.id) ? 'favorite' : 'favorite-border'}
                      size={28}
                      color={isFavourite(item.id) ? theme.colors.heart : theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </StaggerIn>
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    searchInput: {
      flex: 1,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      paddingVertical: 4,
    },
    listContainer: {
      paddingHorizontal: theme.spacing.lg,
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
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      paddingTop: 60,
    },
    loadingText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingTop: 80,
      gap: theme.spacing.md,
    },
    emptyTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
    },
    emptySubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
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
