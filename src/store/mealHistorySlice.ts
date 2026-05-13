/**
 * Meal History Slice – Track daily meal history with calendar support
 */
import { StateCreator } from 'zustand';

export interface MealEntry {
  date: string; // Format: YYYY-MM-DD
  foodId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
  caption?: string;
  imageUrl?: string;
}

export interface MealHistorySlice {
  mealHistory: MealEntry[];
}

export interface MealHistorySliceActions {
  addMeal: (foodId: string, mealType?: MealEntry['mealType']) => void;
  removeMeal: (date: string, foodId: string) => void;
  getMealsByDate: (date: string) => MealEntry[];
  getMealsByDateRange: (startDate: string, endDate: string) => MealEntry[];
  getMealDates: () => string[];
  hasMealOnDate: (date: string) => boolean;
  updateMealCaption: (date: string, foodId: string, caption: string) => void;
  updateMealImage: (date: string, foodId: string, imageUrl: string) => void;
}

export const createMealHistorySlice: StateCreator<MealHistorySlice & MealHistorySliceActions> = (set, get) => ({
  mealHistory: [],
  addMeal: (foodId, mealType = 'lunch') =>
    set((state) => {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = state.mealHistory.findIndex(
        m => m.date === today && m.foodId === foodId && m.mealType === mealType
      );

      if (existingIndex >= 0) {
        return state; // Already exists
      }

      return {
        mealHistory: [
          ...state.mealHistory,
          {
            date: today,
            foodId,
            mealType,
            timestamp: Date.now(),
          },
        ],
      };
    }),
  removeMeal: (date, foodId) =>
    set((state) => ({
      mealHistory: state.mealHistory.filter(m => !(m.date === date && m.foodId === foodId)),
    })),
  getMealsByDate: (date) => {
    return get().mealHistory.filter(m => m.date === date);
  },
  getMealsByDateRange: (startDate, endDate) => {
    return get().mealHistory.filter(m => m.date >= startDate && m.date <= endDate);
  },
  getMealDates: () => {
    const dates = new Set(get().mealHistory.map(m => m.date));
    return Array.from(dates).sort();
  },
  hasMealOnDate: (date) => {
    return get().mealHistory.some(m => m.date === date);
  },
  updateMealCaption: (date, foodId, caption) =>
    set((state) => ({
      mealHistory: state.mealHistory.map((m) =>
        m.date === date && m.foodId === foodId
          ? { ...m, caption }
          : m
      ),
    })),
  updateMealImage: (date, foodId, imageUrl) =>
    set((state) => ({
      mealHistory: state.mealHistory.map((m) =>
        m.date === date && m.foodId === foodId
          ? { ...m, imageUrl }
          : m
      ),
    })),
});
