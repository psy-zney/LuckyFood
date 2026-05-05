import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { getDb } from '../database/db-service';
import { FoodItem } from '../database/mockData';
import { useAppStore } from '../store';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Search'>;
};

export default function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { favourites, addFavourite, removeFavourite } = useAppStore();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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
      case 'chay': return '#E8F5E9';
      case 'nuoc': return '#E3F2FD';
      default: return theme.colors.surfaceVariant;
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category) {
      case 'com': return theme.colors.primary;
      case 'bun-pho': return theme.colors.secondary;
      case 'banh': return theme.colors.tertiary;
      case 'chay': return '#2E7D32';
      case 'nuoc': return '#1565C0';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm Món Ăn</Text>
        <Text style={styles.headerSubtitle}>Khám phá hàng trăm món ngon</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm tên món hoặc mô tả..."
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

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
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={64} color={theme.colors.surfaceVariant} />
              <Text style={styles.emptyTitle}>Không tìm thấy món nào</Text>
              <Text style={styles.emptySubtitle}>
                {query.length > 0
                  ? 'Thử từ khóa khác nhé'
                  : 'Nhập từ khóa để bắt đầu tìm kiếm'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.foodRow}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to detail screen (implement later)
                console.log('Navigate to:', item.id);
              }}
            >
              <View style={styles.foodInfo}>
                <View style={styles.categoryBadge}>
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
                  color={isFavourite(item.id) ? theme.colors.tertiary : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
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
});