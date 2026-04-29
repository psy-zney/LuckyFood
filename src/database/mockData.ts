/**
 * Mock Data – Dữ liệu mẫu cho lần chạy đầu tiên (Offline Seed)
 * Dùng để nạp vào SQLite khi isFirstLaunch === true
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'com' | 'bun-pho' | 'banh' | 'chay' | 'nuoc';
  prepTime: number; // phút
}

export interface IngredientItem {
  id: string;
  name: string;
  icon: string; // emoji
}

export interface FoodIngredientLink {
  food_id: string;
  ingredient_id: string;
}

// ─── Nguyên liệu phổ biến ────────────────────────────────────────────────────
export const MOCK_INGREDIENTS: IngredientItem[] = [
  { id: 'ing-1', name: 'Thịt heo', icon: '🥩' },
  { id: 'ing-2', name: 'Thịt bò', icon: '🥩' },
  { id: 'ing-3', name: 'Thịt gà', icon: '🍗' },
  { id: 'ing-4', name: 'Trứng', icon: '🥚' },
  { id: 'ing-5', name: 'Tôm', icon: '🍤' },
  { id: 'ing-6', name: 'Cá', icon: '🐟' },
  { id: 'ing-7', name: 'Rau xanh', icon: '🥬' },
  { id: 'ing-8', name: 'Cà rốt', icon: '🥕' },
  { id: 'ing-9', name: 'Khoai tây', icon: '🥔' },
  { id: 'ing-10', name: 'Nấm', icon: '🍄' },
  { id: 'ing-11', name: 'Đậu hũ', icon: '🫘' },
  { id: 'ing-12', name: 'Bún / Phở', icon: '🍜' },
  { id: 'ing-13', name: 'Cơm', icon: '🍚' },
  { id: 'ing-14', name: 'Mì', icon: '🍝' },
];

// ─── Danh sách Món Ăn ────────────────────────────────────────────────────────
export const MOCK_FOODS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Cơm sườn bì chả',
    description: 'Cơm trắng ăn kèm sườn nướng, bì heo và chả giò thơm ngon.',
    imageUrl: '',
    category: 'com',
    prepTime: 20,
  },
  {
    id: 'food-2',
    name: 'Phở bò',
    description: 'Phở bò truyền thống với nước dùng hầm xương, thịt bò tái và hành ngò.',
    imageUrl: '',
    category: 'bun-pho',
    prepTime: 10,
  },
  {
    id: 'food-3',
    name: 'Bún bò Huế',
    description: 'Bún bò cay nồng, đặc trưng miền Trung với giò heo và mắm ruốc.',
    imageUrl: '',
    category: 'bun-pho',
    prepTime: 15,
  },
  {
    id: 'food-4',
    name: 'Cơm tấm sườn',
    description: 'Cơm tấm Nam Bộ với sườn nướng mật ong, trứng ốp và đồ chua.',
    imageUrl: '',
    category: 'com',
    prepTime: 20,
  },
  {
    id: 'food-5',
    name: 'Mì xào hải sản',
    description: 'Mì xào giòn với tôm, mực và rau củ sốt hoisin thơm lừng.',
    imageUrl: '',
    category: 'com',
    prepTime: 15,
  },
  {
    id: 'food-6',
    name: 'Gà kho gừng',
    description: 'Thịt gà kho đậm vị với gừng tươi và sả, ăn kèm cơm trắng.',
    imageUrl: '',
    category: 'com',
    prepTime: 25,
  },
  {
    id: 'food-7',
    name: 'Canh chua cá',
    description: 'Canh chua me cá lóc, cà chua và giá đỗ chua ngọt thanh mát.',
    imageUrl: '',
    category: 'com',
    prepTime: 20,
  },
  {
    id: 'food-8',
    name: 'Bánh mì thịt',
    description: 'Bánh mì giòn rụm nhân thịt, pate, dưa leo và tương ớt.',
    imageUrl: '',
    category: 'banh',
    prepTime: 5,
  },
  {
    id: 'food-9',
    name: 'Đậu hũ sốt cà chua',
    description: 'Đậu hũ non chiên vàng sốt cà chua ngọt, phù hợp ăn chay.',
    imageUrl: '',
    category: 'chay',
    prepTime: 15,
  },
  {
    id: 'food-10',
    name: 'Bún đậu mắm tôm',
    description: 'Bún tươi ăn kèm đậu hũ chiên, chả cốm và mắm tôm đặc trưng.',
    imageUrl: '',
    category: 'bun-pho',
    prepTime: 10,
  },
];

// ─── Liên kết Món Ăn – Nguyên Liệu ──────────────────────────────────────────
export const MOCK_FOOD_INGREDIENTS: FoodIngredientLink[] = [
  // Cơm sườn bì chả
  { food_id: 'food-1', ingredient_id: 'ing-1' },
  { food_id: 'food-1', ingredient_id: 'ing-13' },
  { food_id: 'food-1', ingredient_id: 'ing-4' },
  // Phở bò
  { food_id: 'food-2', ingredient_id: 'ing-2' },
  { food_id: 'food-2', ingredient_id: 'ing-12' },
  // Bún bò Huế
  { food_id: 'food-3', ingredient_id: 'ing-2' },
  { food_id: 'food-3', ingredient_id: 'ing-1' },
  { food_id: 'food-3', ingredient_id: 'ing-12' },
  // Cơm tấm sườn
  { food_id: 'food-4', ingredient_id: 'ing-1' },
  { food_id: 'food-4', ingredient_id: 'ing-13' },
  { food_id: 'food-4', ingredient_id: 'ing-4' },
  // Mì xào hải sản
  { food_id: 'food-5', ingredient_id: 'ing-5' },
  { food_id: 'food-5', ingredient_id: 'ing-14' },
  { food_id: 'food-5', ingredient_id: 'ing-7' },
  // Gà kho gừng
  { food_id: 'food-6', ingredient_id: 'ing-3' },
  { food_id: 'food-6', ingredient_id: 'ing-13' },
  // Canh chua cá
  { food_id: 'food-7', ingredient_id: 'ing-6' },
  { food_id: 'food-7', ingredient_id: 'ing-7' },
  // Bánh mì thịt
  { food_id: 'food-8', ingredient_id: 'ing-1' },
  // Đậu hũ sốt cà chua
  { food_id: 'food-9', ingredient_id: 'ing-11' },
  { food_id: 'food-9', ingredient_id: 'ing-7' },
  // Bún đậu mắm tôm
  { food_id: 'food-10', ingredient_id: 'ing-11' },
  { food_id: 'food-10', ingredient_id: 'ing-12' },
];
