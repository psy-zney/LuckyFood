import React from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeProvider';
import { getDb } from '../database/db-service';
import { useAppStore } from '../store';

type FoodRow = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  prepTime: number | null;
};

const CATEGORIES = ['com', 'bun-pho', 'banh', 'chay', 'nuoc'];

export default function AdminFoodsScreen({ navigation }: any) {
  const theme = useTheme();
  const { user } = useAppStore();
  const styles = createStyles(theme);
  const isAdmin = user.uid !== null && user.role === 'admin';

  const [foods, setFoods] = React.useState<FoodRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('com');
  const [prepTime, setPrepTime] = React.useState('15');
  const [saving, setSaving] = React.useState(false);

  const loadFoods = React.useCallback(async () => {
    setLoading(true);
    try {
      const db = await getDb();
      const rows = await db.getAllAsync<FoodRow>('SELECT id, name, description, category, prepTime FROM Foods ORDER BY name ASC;');
      setFoods(rows);
    } catch (error) {
      console.error('[AdminFoods] Load failed:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách món ăn.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const clearForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCategory('com');
    setPrepTime('15');
  };

  const handleEdit = (item: FoodRow) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? '');
    setCategory(item.category ?? 'com');
    setPrepTime(String(item.prepTime ?? 15));
  };

  const handleSave = async () => {
    if (!editingId) return;
    const normalizedName = name.trim();
    const parsedPrep = Number(prepTime);
    if (!normalizedName) {
      Alert.alert('Lỗi', 'Tên món ăn không được để trống.');
      return;
    }
    if (!Number.isFinite(parsedPrep) || parsedPrep <= 0) {
      Alert.alert('Lỗi', 'Thời gian chuẩn bị phải là số dương.');
      return;
    }

    setSaving(true);
    try {
      const db = await getDb();
      await db.runAsync(
        'UPDATE Foods SET name = ?, description = ?, category = ?, prepTime = ? WHERE id = ?;',
        [normalizedName, description.trim(), category, parsedPrep, editingId]
      );
      await loadFoods();
      clearForm();
      Alert.alert('Thành công', 'Đã cập nhật món ăn.');
    } catch (error) {
      console.error('[AdminFoods] Update failed:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật món ăn.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: FoodRow) => {
    Alert.alert('Xác nhận xóa', `Xóa món "${item.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDb();
            await db.runAsync('DELETE FROM Foods WHERE id = ?;', [item.id]);
            if (editingId === item.id) clearForm();
            await loadFoods();
          } catch (error) {
            console.error('[AdminFoods] Delete failed:', error);
            Alert.alert('Lỗi', 'Không thể xóa món ăn.');
          }
        },
      },
    ]);
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
        <View style={styles.unauthorizedWrap}>
          <MaterialIcons name="lock" size={36} color={theme.colors.error} />
          <Text style={styles.unauthorizedText}>Chỉ admin mới truy cập được.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Quản lý món ăn</Text>
        <TouchableOpacity onPress={loadFoods} hitSlop={8}>
          <MaterialIcons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {editingId ? (
        <View style={styles.editor}>
          <Text style={styles.sectionTitle}>Sửa món: {editingId}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Tên món" placeholderTextColor={theme.colors.textSecondary} />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Mô tả"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={category}
              onChangeText={setCategory}
              placeholder={`Danh mục: ${CATEGORIES.join(', ')}`}
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              placeholder="Phút"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={clearForm} disabled={saving}>
              <Text style={styles.secondaryText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
              <Text style={styles.buttonText}>{saving ? 'Đang lưu...' : 'Lưu'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadFoods}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.category || 'không rõ'} | {item.prepTime ?? 0} phút
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)} hitSlop={8}>
                <MaterialIcons name="edit" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={8}>
                <MaterialIcons name="delete" size={22} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Không có dữ liệu món ăn.</Text>
          </View>
        }
      />
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
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: theme.typography.families.display,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    sectionTitle: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
    },
    editor: {
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 10,
      color: theme.colors.text,
      fontFamily: theme.typography.families.body,
      backgroundColor: theme.colors.surfaceVariant,
    },
    multiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    flex1: {
      flex: 1,
    },
    timeInput: {
      width: 90,
    },
    button: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    buttonText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.surface,
      fontWeight: theme.typography.weights.bold,
    },
    secondary: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
    },
    secondaryText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.medium,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    itemInfo: {
      flex: 1,
      paddingRight: theme.spacing.md,
    },
    itemName: {
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      fontWeight: theme.typography.weights.semiBold,
    },
    itemMeta: {
      marginTop: 4,
      fontFamily: theme.typography.families.body,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    emptyWrap: {
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
    },
    emptyText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.textSecondary,
    },
    unauthorizedWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    unauthorizedText: {
      fontFamily: theme.typography.families.body,
      color: theme.colors.textSecondary,
    },
  });
