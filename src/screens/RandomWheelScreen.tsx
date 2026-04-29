import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getDb } from '../database/db-service';
import { theme } from '../utils/theme';
import { useAppStore } from '../store';
import { FoodItem } from '../database/mockData';

export default function RandomWheelScreen() {
  const [result, setResult] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const incrementStreak = useAppStore((s) => s.incrementStreak);

  const spin = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDb();
      // Lấy ngẫu nhiên 1 món từ SQLite
      const food = await db.getFirstAsync<FoodItem>(
        'SELECT * FROM Foods ORDER BY RANDOM() LIMIT 1;'
      );
      setResult(food ?? null);
    } catch (err) {
      console.error('[RandomWheel] Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCooked = () => {
    // Người dùng đã nấu món này → tăng Streak
    incrementStreak();
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎡 Quay Random</Text>
      <Text style={styles.subtitle}>
        Không biết ăn gì? Để LuckyFood quyết định!
      </Text>

      {/* Vùng hiển thị kết quả */}
      <View style={styles.resultCard}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : result ? (
          <>
            <Text style={styles.resultEmoji}>🍽️</Text>
            <Text style={styles.resultName}>{result.name}</Text>
            <Text style={styles.resultDesc}>{result.description}</Text>
            <Text style={styles.resultMeta}>⏱ {result.prepTime} phút</Text>
          </>
        ) : (
          <Text style={styles.placeholder}>Nhấn nút bên dưới để quay!</Text>
        )}
      </View>

      {/* Nút quay */}
      <TouchableOpacity style={styles.spinButton} onPress={spin} disabled={loading}>
        <Text style={styles.spinButtonText}>🎲 Quay ngay!</Text>
      </TouchableOpacity>

      {/* Nút xác nhận đã nấu */}
      {result && (
        <TouchableOpacity style={styles.cookedButton} onPress={handleCooked}>
          <Text style={styles.cookedButtonText}>✅ Tôi đã nấu món này!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  resultCard: {
    width: '100%',
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.md,
  },
  resultEmoji: { fontSize: 56, marginBottom: theme.spacing.md },
  resultName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  resultDesc: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  resultMeta: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  spinButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  spinButtonText: {
    color: '#fff',
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
  },
  cookedButton: {
    width: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.round,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  cookedButtonText: {
    color: '#fff',
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
});
