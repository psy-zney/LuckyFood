import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/AppNavigator';
import { theme } from '../utils/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store';

type Props = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Favourites'>;
};

export default function FavouritesScreen({ navigation }: Props) {
  const { favourites, removeFavourite } = useAppStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yêu Thích</Text>
      </View>

      {favourites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="favorite-border" size={64} color={theme.colors.surfaceVariant} />
          <Text style={styles.emptyTitle}>Chưa có món yêu thích</Text>
          <Text style={styles.emptySubtitle}>Đánh dấu các món ăn bạn thích để xem lại nhanh hơn.</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.metaRow}>
                  <MaterialIcons name="schedule" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{item.prepTime} phút</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.favBtn}
                onPress={() => removeFavourite(item.id)}
              >
                <MaterialIcons name="favorite" size={24} color={theme.colors.tertiary} />
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xxl, gap: theme.spacing.md },
  emptyTitle: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.xl, color: theme.colors.text, textAlign: 'center' },
  emptySubtitle: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  listContainer: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
  separator: { height: 1, backgroundColor: theme.colors.borderSubtle, marginVertical: theme.spacing.sm },
  foodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm, gap: theme.spacing.md },
  foodInfo: { flex: 1 },
  foodName: { fontFamily: theme.typography.families.display, fontSize: theme.typography.sizes.lg, color: theme.colors.text, marginBottom: 4 },
  foodDesc: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: theme.typography.families.body, fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary },
  favBtn: { padding: theme.spacing.sm },
});
