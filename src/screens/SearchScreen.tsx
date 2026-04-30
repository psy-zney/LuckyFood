import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
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
    } catch (err) {
      console.error('[Search] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tất Cả Món Ăn</Text>
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
          <TouchableOpacity onPress={() => setQuery('')}>
            <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={theme.colors.surfaceVariant} />
              <Text style={styles.emptyText}>Không tìm thấy món nào</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.metaRow}>
                  <MaterialIcons name="schedule" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{item.prepTime} phút</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavourite(item)}>
                <MaterialIcons
                  name={isFavourite(item.id) ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={isFavourite(item.id) ? theme.colors.tertiary : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  headerTitle: { fontFamily: theme.typography.families.display, fontSize: 20, fontWeight: theme.typography.weights.semiBold, color: theme.colors.text },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.lg,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text,
    paddingVertical: 4,
  },
  listContainer: { paddingHorizontal: theme.spacing.lg, paddingBottom: 100 },
  separator: { height: 1, backgroundColor: theme.colors.borderSubtle, marginVertical: 4 },
  foodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, gap: theme.spacing.md },
  foodInfo: { flex: 1 },
  foodName: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.lg, color: theme.colors.text, marginBottom: 4 },
  foodDesc: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  metaText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: theme.colors.secondaryContainer, borderRadius: 4 },
  categoryText: { fontFamily: theme.typography.families.body, fontSize: 10, color: theme.colors.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  favBtn: { padding: theme.spacing.sm },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: theme.spacing.md },
  emptyText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary },
});
