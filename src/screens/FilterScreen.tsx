import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getDb } from '../database/db-service';
import { theme } from '../utils/theme';
import { IngredientItem, FoodItem } from '../database/mockData';

export default function FilterScreen() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Tải danh sách nguyên liệu từ SQLite
  useEffect(() => {
    const load = async () => {
      const db = await getDb();
      const rows = await db.getAllAsync<IngredientItem>('SELECT * FROM Ingredients ORDER BY name;');
      setIngredients(rows);
    };
    load();
  }, []);

  const toggleIngredient = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = useCallback(async () => {
    if (selected.size === 0) return;
    try {
      setLoading(true);
      const db = await getDb();
      const ids = Array.from(selected);
      // Tìm các món có ÍT NHẤT 1 nguyên liệu đã chọn
      const placeholders = ids.map(() => '?').join(', ');
      const rows = await db.getAllAsync<FoodItem>(
        `SELECT DISTINCT f.*
         FROM Foods f
         JOIN Food_Ingredients fi ON f.id = fi.food_id
         WHERE fi.ingredient_id IN (${placeholders})
         ORDER BY f.name;`,
        ids
      );
      setResults(rows);
      setSearched(true);
    } catch (err) {
      console.error('[FilterScreen] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥕 Lọc theo nguyên liệu</Text>
      <Text style={styles.subtitle}>Chọn những gì bạn đang có:</Text>

      {/* Grid chọn nguyên liệu */}
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        numColumns={3}
        style={styles.grid}
        renderItem={({ item }) => {
          const active = selected.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => toggleIngredient(item.id)}
            >
              <Text style={styles.chipIcon}>{item.icon}</Text>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Nút tìm */}
      <TouchableOpacity
        style={[styles.searchButton, selected.size === 0 && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={selected.size === 0 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>
            🔍 Tìm món ({selected.size} nguyên liệu)
          </Text>
        )}
      </TouchableOpacity>

      {/* Kết quả */}
      {searched && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            {results.length > 0
              ? `Tìm thấy ${results.length} món 🎉`
              : 'Không tìm thấy món phù hợp 😢'}
          </Text>
          {results.map((food) => (
            <View key={food.id} style={styles.foodCard}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodDesc} numberOfLines={2}>{food.description}</Text>
              <Text style={styles.foodMeta}>⏱ {food.prepTime} phút</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  grid: { flexGrow: 0 },
  chip: {
    flex: 1,
    margin: 4,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipIcon: { fontSize: 22 },
  chipText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 2,
  },
  chipTextActive: { color: '#fff' },
  searchButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  searchButtonDisabled: { opacity: 0.45 },
  searchButtonText: {
    color: '#fff',
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
  results: { flex: 1 },
  resultsTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  foodCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  foodName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  foodDesc: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  foodMeta: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    marginTop: 6,
  },
});
