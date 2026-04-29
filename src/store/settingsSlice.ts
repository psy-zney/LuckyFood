import { StateCreator } from 'zustand';
import { AppSettings } from './types';

// ─── Actions ───────────────────────────────────────────────────────────────────
export interface SettingsSliceActions {
  setSettings: (settings: Partial<AppSettings>) => void;
  setFirstLaunch: (value: boolean) => void;
}

export type SettingsSlice = { settings: AppSettings } & SettingsSliceActions;

// ─── Default State ─────────────────────────────────────────────────────────────
const defaultSettings: AppSettings = {
  isFirstLaunch: true,
  language: 'vi',
  theme: 'system',
  notificationsEnabled: false,
  dailyReminderTime: null,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────
export const createSettingsSlice: StateCreator<SettingsSlice & any, [], [], SettingsSlice> =
  (set) => ({
    settings: defaultSettings,

    // Cập nhật một phần cài đặt
    setSettings: (newSettings) =>
      set((state: SettingsSlice) => ({
        settings: { ...state.settings, ...newSettings },
      })),

    // Đánh dấu ứng dụng đã được khởi chạy lần đầu
    setFirstLaunch: (value) =>
      set((state: SettingsSlice) => ({
        settings: { ...state.settings, isFirstLaunch: value },
      })),
  });
