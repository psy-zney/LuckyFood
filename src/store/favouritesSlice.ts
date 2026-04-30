/**
 * Favourites Slice – Lưu danh sách món yêu thích trong Zustand store
 */
import { StateCreator } from 'zustand';
import { FoodItem } from '../database/mockData';

export interface FavouritesSlice {
  favourites: FoodItem[];
}

export interface FavouritesSliceActions {
  addFavourite: (food: FoodItem) => void;
  removeFavourite: (id: string) => void;
}

export const createFavouritesSlice: StateCreator<FavouritesSlice & FavouritesSliceActions> = (set) => ({
  favourites: [],
  addFavourite: (food) =>
    set((state) => {
      if (state.favourites.some(f => f.id === food.id)) return state;
      return { favourites: [...state.favourites, food] };
    }),
  removeFavourite: (id) =>
    set((state) => ({ favourites: state.favourites.filter(f => f.id !== id) })),
});
