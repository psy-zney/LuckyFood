import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList, RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../utils/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import { getFoodsByIngredients } from '../database/db-service';
import { FoodItem, MOCK_INGREDIENTS } from '../database/mockData';
import { useAppStore } from '../store';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Filter'>;
};

export default function FilterScreen({ navigation }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [readyToCook, setReadyToCook] = useState<any[]>([]);
  const [needToBuy, setNeedToBuy] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addFavourite, removeFavourite, favourites } = useAppStore();
  const theme = useTheme();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideUpAnim = React.useRef(new Animated.Value(20)).current;

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
      const idList = Array.from(selectedIds);
      // Call the optimized B-Tree indexing query from db-service
      const rows = await getFoodsByIngredients(idList);
      
      // Món nấu được ngay: KHÔNG THIẾU nguyên liệu quan trọng (main, rare)
      const ready = rows.filter(r => r.missing_critical_count === 0);
      
      // Món cần mua thêm: Có thiếu nguyên liệu quan trọng
      const partial = rows.filter(r => r.missing_critical_count > 0);

      setReadyToCook(ready);
      setNeedToBuy(partial);
      setSearched(true);

      // Animate results
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error('[Filter] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedIds, fadeAnim, slideUpAnim]);

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
        <Text style={styles.headerTitle}>Tìm Theo Nguyên Liệu</Text>
        <Text style={styles.headerSubtitle}>Chọn những gì bạn có trong tủ lạnh</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ingredient Grid */}
        <View style={styles.ingredientSection}>
          <Text style={styles.sectionTitle}>Chọn nguyên liệu</Text>
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
                    <View style={styles.checkIcon}>
                      <MaterialIcons name="check" size={14} color={theme.colors.surface} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
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
              <Text style={styles.searchBtnText}>
                Tìm Món Phù Hợp ({selectedIds.size} nguyên liệu)
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Results */}
        {searched && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
          >
            {readyToCook.length === 0 && needToBuy.length === 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Không tìm thấy món phù hợp</Text>
              </View>
            )}

            {/* Nấu Được Ngay */}
            {readyToCook.length > 0 && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.resultsTitle}>Nấu Được Ngay</Text>
                  <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
                    <Text style={styles.badgeText}>Khớp 100%</Text>
                  </View>
                </View>
                <Text style={styles.sectionSubtitle}>Bạn đã có đủ nguyên liệu để nấu các món này</Text>
                
                {readyToCook.map((item, idx) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={styles.resultRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        (navigation.getParent() as NativeStackNavigationProp<RootStackParamList>).navigate('FoodDetail', { food: item });
                      }}
                    >
                      <View style={styles.resultInfo}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                          <Text style={[styles.categoryText, { color: getCategoryTextColor(item.category) }]}>
                            {getCategoryLabel(item.category)}
                          </Text>
                        </View>
                        <Text style={styles.resultName}>{item.name}</Text>
                        <Text style={styles.resultDesc} numberOfLines={2}>{item.description}</Text>
                        <View style={styles.metaRow}>
                          <View style={styles.metaItem}>
                            <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.metaText}>{item.prepTime} phút</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavourite(item)} activeOpacity={0.7}>
                        <MaterialIcons name={isFavourite(item.id) ? 'favorite' : 'favorite-border'} size={28} color={isFavourite(item.id) ? theme.colors.heart : theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {idx < readyToCook.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            )}

            {/* Gợi Ý Thêm */}
            {needToBuy.length > 0 && (
              <View style={[styles.resultsSection, { marginTop: theme.spacing.lg }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.resultsTitle}>Gợi Ý Mua Thêm</Text>
                  <View style={[styles.badge, { backgroundColor: theme.colors.warning }]}>
                    <Text style={[styles.badgeText, { color: '#000' }]}>Thiếu nguyên liệu</Text>
                  </View>
                </View>
                <Text style={styles.sectionSubtitle}>Các món này có chứa nguyên liệu bạn chọn</Text>
                
                {needToBuy.map((item, idx) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      style={styles.resultRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        (navigation.getParent() as NativeStackNavigationProp<RootStackParamList>).navigate('FoodDetail', { food: item });
                      }}
                    >
                      <View style={styles.resultInfo}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                          <Text style={[styles.categoryText, { color: getCategoryTextColor(item.category) }]}>
                            {getCategoryLabel(item.category)}
                          </Text>
                        </View>
                        <Text style={styles.resultName}>{item.name}</Text>
                        <Text style={styles.resultDesc} numberOfLines={2}>
                          Thiếu: {item.missing_critical_count} nguyên liệu chính
                        </Text>
                        <View style={styles.metaRow}>
                          <View style={styles.metaItem}>
                            <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
                            <Text style={styles.metaText}>{item.prepTime} phút</Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavourite(item)} activeOpacity={0.7}>
                        <MaterialIcons name={isFavourite(item.id) ? 'favorite' : 'favorite-border'} size={28} color={isFavourite(item.id) ? theme.colors.heart : theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {idx < needToBuy.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            )}

          </Animated.View>
        )}

        <View style={{ height: 100 }} />


      </ScrollView>
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
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    ingredientSection: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    ingredientGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    ingredientChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 12,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    ingredientChipSelected: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    ingredientIcon: {
      fontSize: 18,
    },
    ingredientName: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
    },
    ingredientNameSelected: {
      color: theme.colors.surface,
    },
    checkIcon: {
      marginLeft: 4,
    },
    searchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.medium,
    },
    searchBtnDisabled: {
      opacity: 0.4,
    },
    searchBtnText: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      letterSpacing: 0.3,
    },
    resultsSection: {
      marginTop: theme.spacing.sm,
    },
    resultsTitle: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.weights.semiBold,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    resultInfo: {
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
    resultName: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.text,
      marginBottom: 4,
      fontWeight: theme.typography.weights.semiBold,
    },
    resultDesc: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: 8,
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
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    favBtn: {
      padding: theme.spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.borderSubtle,
      marginLeft: theme.spacing.xl,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: 4,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.round,
    },
    badgeText: {
      fontFamily: theme.typography.families.body,
      fontSize: 10,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.surface,
      textTransform: 'uppercase',
    },
    sectionSubtitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontStyle: 'italic',
    },
  });
