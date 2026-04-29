import { StateCreator } from 'zustand';
import { UserProfile } from './types';

// ─── Actions ───────────────────────────────────────────────────────────────────
export interface UserSliceActions {
  setUser: (profile: Partial<UserProfile>) => void;
  clearUser: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  toggleFavorite: (foodId: string) => void;
}

export type UserSlice = { user: UserProfile } & UserSliceActions;

// ─── Default State ─────────────────────────────────────────────────────────────
const defaultUser: UserProfile = {
  uid: null,
  displayName: 'Khách',
  email: null,
  avatarUrl: null,
  role: 'user',
  currentStreak: 0,
  highestStreak: 0,
  lastCookedDate: null,
  favoriteFoodIds: [],
};

// ─── Slice ─────────────────────────────────────────────────────────────────────
export const createUserSlice: StateCreator<UserSlice & any, [], [], UserSlice> =
  (set) => ({
    user: defaultUser,

    // Cập nhật một phần user profile (partial update)
    setUser: (profile) =>
      set((state: UserSlice) => ({
        user: { ...state.user, ...profile },
      })),

    // Xóa session user (đăng xuất)
    clearUser: () => set({ user: defaultUser }),

    // Tăng streak và cập nhật ngày nấu ăn gần nhất
    incrementStreak: () =>
      set((state: UserSlice) => {
        const today = new Date().toISOString().split('T')[0];
        const newStreak = state.user.currentStreak + 1;
        return {
          user: {
            ...state.user,
            currentStreak: newStreak,
            highestStreak: Math.max(newStreak, state.user.highestStreak),
            lastCookedDate: today,
          },
        };
      }),

    // Reset streak về 0 (nếu break chuỗi)
    resetStreak: () =>
      set((state: UserSlice) => ({
        user: { ...state.user, currentStreak: 0 },
      })),

    // Thêm hoặc xóa món ăn khỏi danh sách yêu thích
    toggleFavorite: (foodId) =>
      set((state: UserSlice) => {
        const favs = state.user.favoriteFoodIds;
        const next = favs.includes(foodId)
          ? favs.filter((id: string) => id !== foodId)
          : [...favs, foodId];
        return { user: { ...state.user, favoriteFoodIds: next } };
      }),
  });
