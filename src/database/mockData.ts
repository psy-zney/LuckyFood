/**
 * Shared database types and static ingredient list for filter UI.
 * Seed data is now sourced from `initial_seed_ctna.json`.
 */

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'com' | 'bun-pho' | 'banh' | 'chay' | 'nuoc';
  prepTime: number;
}

export interface IngredientItem {
  id: string;
  name: string;
  icon: string;
  type: 'main' | 'common' | 'rare';
}

export interface FoodIngredientLink {
  food_id: string;
  ingredient_id: string;
}

export const MOCK_INGREDIENTS: IngredientItem[] = [
  { id: 'ing-1', name: 'Thit heo', icon: '🥩', type: 'main' },
  { id: 'ing-2', name: 'Thit bo', icon: '🥩', type: 'main' },
  { id: 'ing-3', name: 'Thit ga', icon: '🍗', type: 'main' },
  { id: 'ing-4', name: 'Trung', icon: '🥚', type: 'main' },
  { id: 'ing-5', name: 'Tom', icon: '🍤', type: 'main' },
  { id: 'ing-6', name: 'Ca', icon: '🐟', type: 'main' },
  { id: 'ing-11', name: 'Dau hu', icon: '🫘', type: 'main' },
  { id: 'ing-12', name: 'Bun/Pho', icon: '🍜', type: 'main' },
  { id: 'ing-13', name: 'Com', icon: '🍚', type: 'main' },
  { id: 'ing-14', name: 'Mi', icon: '🍝', type: 'main' },
  { id: 'ing-7', name: 'Rau xanh', icon: '🥬', type: 'rare' },
  { id: 'ing-8', name: 'Ca rot', icon: '🥕', type: 'rare' },
  { id: 'ing-9', name: 'Khoai tay', icon: '🥔', type: 'rare' },
  { id: 'ing-10', name: 'Nam', icon: '🍄', type: 'rare' },
  { id: 'ing-15', name: 'Toi', icon: '🧄', type: 'common' },
  { id: 'ing-16', name: 'Hanh', icon: '🧅', type: 'common' },
  { id: 'ing-17', name: 'Gung', icon: '🫚', type: 'common' },
  { id: 'ing-18', name: 'Ot', icon: '🌶️', type: 'common' },
];
