/**
 * Popularity Slice – Track food popularity based on user selections
 */
import { StateCreator } from 'zustand';

export interface PopularityEntry {
  foodId: string;
  count: number;
}

export interface PopularitySlice {
  popularity: PopularityEntry[];
}

export interface PopularitySliceActions {
  incrementPopularity: (foodId: string) => void;
  getTopFoods: (limit?: number) => string[];
}

export const createPopularitySlice: StateCreator<PopularitySlice & PopularitySliceActions> = (set, get) => ({
  popularity: [],
  incrementPopularity: (foodId) =>
    set((state) => {
      const existing = state.popularity.find(p => p.foodId === foodId);
      if (existing) {
        return {
          popularity: state.popularity.map(p =>
            p.foodId === foodId ? { ...p, count: p.count + 1 } : p
          ),
        };
      }
      return { popularity: [...state.popularity, { foodId, count: 1 }] };
    }),
  getTopFoods: (limit = 5) => {
    const sorted = [...get().popularity].sort((a, b) => b.count - a.count);
    return sorted.slice(0, limit).map(p => p.foodId);
  },
});
