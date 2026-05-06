/**
 * Root Zustand Store
 * Kết hợp tất cả các slices lại thành một store duy nhất.
 * 
 * Cách sử dụng:
 *   const user = useAppStore((s) => s.user);
 *   const { incrementStreak, setSettings } = useAppStore();
 */
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createUserSlice, UserSlice, UserSliceActions } from './userSlice';
import { createSettingsSlice, SettingsSlice, SettingsSliceActions } from './settingsSlice';
import { createFavouritesSlice, FavouritesSlice, FavouritesSliceActions } from './favouritesSlice';
import { createPopularitySlice, PopularitySlice, PopularitySliceActions } from './popularitySlice';
import { createMealHistorySlice, MealHistorySlice, MealHistorySliceActions } from './mealHistorySlice';

type StoreState = UserSlice & UserSliceActions & SettingsSlice & SettingsSliceActions & FavouritesSlice & FavouritesSliceActions & PopularitySlice & PopularitySliceActions & MealHistorySlice & MealHistorySliceActions;

export const useAppStore = create<StoreState>()((...args) => ({
  ...createUserSlice(...args),
  ...createSettingsSlice(...args),
  ...createFavouritesSlice(...args),
  ...createPopularitySlice(...args),
  ...createMealHistorySlice(...args),
}));

// ─── Typed Selectors (tiện dùng, tránh boilerplate) ───────────────────────────
export const useUser = () => useAppStore((s) => s.user);
export const useSettings = () => useAppStore((s) => s.settings);
export const useStreak = () =>
  useAppStore(
    useShallow((s) => ({
      current: s.user.currentStreak,
      highest: s.user.highestStreak,
      lastDate: s.user.lastCookedDate,
    }))
  );
