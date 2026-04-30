import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';
import { useStreak } from '../store';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList>;
};

export default function HomeScreen({ navigation }: Props) {
  const { current, highest } = useStreak();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* TopAppBar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')}>
          <MaterialIcons name="search" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LuckyFood</Text>
        <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Favourites')}>
          <MaterialIcons name="favorite-border" size={28} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Daily Cooking Streak */}
        <View style={styles.section}>
          <View style={styles.streakHeader}>
            <MaterialIcons name="local-fire-department" size={24} color={theme.colors.tertiary} />
            <Text style={styles.sectionTitle}>Chuỗi Nấu Ăn</Text>
          </View>
          <View style={styles.streakProgressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min((current / 7) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.streakText}>Ngày {current} / 7</Text>
          </View>
        </View>

        {/* What to eat today? (Random Wheel) – Ô màu nổi bật theo RULES.md */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('RandomWheel')}
          style={styles.randomSection}
        >
          <View style={styles.randomInner}>
            <View style={styles.randomTextBlock}>
              <Text style={styles.randomEyebrow}>HÔM NAY ĂN GÌ?</Text>
              <Text style={styles.randomTitle}>Để số phận{`\n`}quyết định</Text>
              <View style={styles.randomCta}>
                <MaterialIcons name="casino" size={18} color={theme.colors.surface} />
                <Text style={styles.randomCtaText}>Đổ Xúc Xắc</Text>
              </View>
            </View>
            <Image
              source={require('../assets/images/xuc_xac-removebg-preview.png')}
              style={styles.randomDicePreview}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Find recipes by ingredients (Filter) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.displayTitle}>Theo nguyên liệu</Text>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('Filter')}>
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
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background, zIndex: 10,
  },
  iconButton: { padding: 8, marginLeft: -8, borderRadius: theme.borderRadius.round },
  headerTitle: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xl, fontStyle: 'italic', fontWeight: theme.typography.weights.bold, color: theme.colors.text },
  avatarContainer: { width: 40, height: 40, borderRadius: theme.borderRadius.round, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%' },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
  section: { marginBottom: theme.spacing.xl },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  sectionTitle: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xl, color: theme.colors.text },
  streakProgressContainer: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, width: '60%' },
  progressBarBg: { flex: 1, height: 2, backgroundColor: theme.colors.surfaceVariant, position: 'relative' },
  progressBarFill: { position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: theme.colors.primaryContainer },
  streakText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.xs, color: '#817474', textTransform: 'uppercase', letterSpacing: 1 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: theme.spacing.lg },
  displayTitle: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xxl, color: theme.colors.text },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  viewAllText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.primary, fontWeight: theme.typography.weights.semiBold },
  // Random Section Highlight (RULES.md: Dùng màu nổi bật, tránh dùng primary cho nền lớn → dùng secondaryContainer)
  randomSection: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.secondaryContainer,
    overflow: 'hidden',
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  randomInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xl },
  randomTextBlock: { flex: 1, gap: theme.spacing.sm },
  randomEyebrow: { fontFamily: theme.typography.families.body, fontSize: 10, letterSpacing: 2, color: '#726156', textTransform: 'uppercase' },
  randomTitle: { fontFamily: theme.typography.families.display, fontSize: 28, lineHeight: 32, color: '#3D2C1C' },
  randomCta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#5A4033', paddingHorizontal: theme.spacing.md, paddingVertical: 10, borderRadius: theme.borderRadius.lg, alignSelf: 'flex-start', marginTop: theme.spacing.sm },
  randomCtaText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.bold, color: theme.colors.surface },
  randomDicePreview: { width: 120, height: 120, marginLeft: theme.spacing.md },
  searchBarFake: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: theme.spacing.md, backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.borderRadius.lg },
  searchPlaceholder: { flex: 1, fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary },
});
