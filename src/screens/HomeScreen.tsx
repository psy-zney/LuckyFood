import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';
import { useStreak } from '../store';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { current, highest } = useStreak();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Streak */}
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={styles.streakCount}>{current}</Text>
        <Text style={styles.streakLabel}>Chuỗi nấu ăn liên tiếp</Text>
        <Text style={styles.streakBest}>Kỷ lục: {highest} ngày</Text>
      </View>

      {/* Câu hỏi */}
      <Text style={styles.question}>Hôm nay bạn ăn gì? 🤔</Text>

      {/* Nút chọn luồng */}
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => navigation.navigate('RandomWheel')}
      >
        <Text style={styles.actionButtonIcon}>🎡</Text>
        <View>
          <Text style={styles.actionButtonTitle}>Quay Random</Text>
          <Text style={styles.actionButtonSub}>Để số phận quyết định!</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => navigation.navigate('Filter')}
      >
        <Text style={styles.actionButtonIcon}>🥕</Text>
        <View>
          <Text style={[styles.actionButtonTitle, { color: theme.colors.text }]}>
            Lọc theo nguyên liệu
          </Text>
          <Text style={styles.actionButtonSub}>Bạn đang có gì trong tủ lạnh?</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  streakCard: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  streakEmoji: { fontSize: 40, marginBottom: theme.spacing.sm },
  streakCount: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: '#fff',
  },
  streakLabel: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: theme.spacing.xs,
  },
  streakBest: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: theme.spacing.xs,
  },
  question: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  primaryButton: { backgroundColor: theme.colors.primary },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  actionButtonIcon: { fontSize: 36 },
  actionButtonTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: '#fff',
  },
  actionButtonSub: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
