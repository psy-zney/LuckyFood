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

type StoreState = UserSlice & UserSliceActions & SettingsSlice & SettingsSliceActions;

export const useAppStore = create<StoreState>()((...args) => ({
  ...createUserSlice(...args),
  ...createSettingsSlice(...args),
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
