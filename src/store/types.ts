// ─── User Profile ─────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string | null;          // Firebase UID (null nếu chưa đăng nhập / offline)
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  currentStreak: number;
  highestStreak: number;
  lastCookedDate: string | null; // ISO date "YYYY-MM-DD"
  favoriteFoodIds: string[];
}

// ─── App Settings ──────────────────────────────────────────────────────────────
export interface AppSettings {
  isFirstLaunch: boolean;
  language: 'vi' | 'en';
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  dailyReminderTime: string | null; // "HH:mm" format, e.g. "12:00"
}

// ─── Combined Store ─────────────────────────────────────────────────────────────
export interface RootState {
  user: UserProfile;
  settings: AppSettings;
}
