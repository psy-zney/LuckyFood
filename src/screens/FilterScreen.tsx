import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { getDb } from '../database/db-service';
import { FoodItem, MOCK_INGREDIENTS } from '../database/mockData';
import { useAppStore } from '../store';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Filter'>;
};

export default function FilterScreen({ navigation }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addFavourite, removeFavourite, favourites } = useAppStore();

  const toggleIngredient = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSearched(false); // Reset results when selection changes
  };

  const isFavourite = (id: string) => favourites.some(f => f.id === id);

  const toggleFavourite = (item: FoodItem) => {
    if (isFavourite(item.id)) removeFavourite(item.id);
    else addFavourite(item);
  };

  const handleSearch = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    try {
      const db = await getDb();
      const idList = Array.from(selectedIds);
      const placeholders = idList.map(() => '?').join(',');
      const totalSelected = idList.length;

      // Count how many selected ingredients each food has
      const sql = `
        SELECT f.*, COUNT(fi.ingredient_id) AS matched_count,
          (SELECT COUNT(*) FROM FoodIngredients WHERE food_id = f.id) AS total_ingredients
        FROM Foods f
        INNER JOIN FoodIngredients fi ON fi.food_id = f.id
        WHERE fi.ingredient_id IN (${placeholders})
        GROUP BY f.id
        HAVING (CAST(matched_count AS REAL) / CAST(total_ingredients AS REAL)) >= 0.7
        ORDER BY matched_count DESC
      `;

      const rows = await db.getAllAsync<FoodItem & { matched_count: number; total_ingredients: number }>(sql, idList);
      setResults(rows);
      setSearched(true);
    } catch (err) {
      console.error('[Filter] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedIds]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm Theo Nguyên Liệu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subTitle}>Đánh dấu những gì bạn đang có trong tủ lạnh:</Text>

        {/* Ingredient Grid */}
        <View style={styles.ingredientGrid}>
          {MOCK_INGREDIENTS.map(ing => {
            const selected = selectedIds.has(ing.id);
            return (
              <TouchableOpacity
                key={ing.id}
                style={[styles.ingredientChip, selected && styles.ingredientChipSelected]}
                onPress={() => toggleIngredient(ing.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.ingredientIcon}>{ing.icon}</Text>
                <Text style={[styles.ingredientName, selected && styles.ingredientNameSelected]}>
                  {ing.name}
                </Text>
                {selected && (
                  <MaterialIcons name="check" size={14} color={theme.colors.surface} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchBtn, selectedIds.size === 0 && styles.searchBtnDisabled]}
          onPress={handleSearch}
          disabled={selectedIds.size === 0 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <>
              <MaterialIcons name="search" size={22} color={theme.colors.surface} />
              <Text style={styles.searchBtnText}>Tìm Món Phù Hợp ({selectedIds.size} nguyên liệu)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Results */}
        {searched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {results.length > 0
                ? `Tìm thấy ${results.length} món (≥ 70% nguyên liệu)`
                : 'Không tìm thấy món phù hợp'}
            </Text>
            {results.map((item, idx) => (
              <View key={item.id}>
                <View style={styles.resultRow}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultDesc} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.metaRow}>
                      <MaterialIcons name="schedule" size={14} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>{item.prepTime} phút</Text>
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
                {idx < results.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
  },
  headerTitle: { fontFamily: theme.typography.families.display, fontSize: 20, fontWeight: theme.typography.weights.semiBold, color: theme.colors.text },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  subTitle: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, lineHeight: 22 },
  ingredientGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.xl },
  ingredientChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: theme.spacing.md, paddingVertical: 10,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  ingredientChipSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  ingredientIcon: { fontSize: 16 },
  ingredientName: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, fontWeight: theme.typography.weights.medium },
  ingredientNameSelected: { color: theme.colors.surface },
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm,
    backgroundColor: theme.colors.primaryContainer, paddingVertical: 18,
    borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primaryContainer, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  searchBtnDisabled: { opacity: 0.4 },
  searchBtnText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, fontWeight: theme.typography.weights.bold, color: theme.colors.surface, letterSpacing: 0.5 },
  resultsSection: { marginTop: theme.spacing.sm },
  resultsTitle: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xl, color: theme.colors.text, marginBottom: theme.spacing.lg },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, gap: theme.spacing.md },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.lg, color: theme.colors.text, marginBottom: 4 },
  resultDesc: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: 6, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary },
  favBtn: { padding: theme.spacing.sm },
  separator: { height: 1, backgroundColor: theme.colors.borderSubtle, marginVertical: 4 },
});
