# LuckyFood

Mobile app built with Expo + React Native to help users decide what to cook, explore dishes, and track cooking habits.

Ứng dụng di động xây dựng bằng Expo + React Native giúp người dùng chọn món ăn mỗi ngày, khám phá món mới và theo dõi thói quen nấu ăn.

---

## 1) Key Features / Tính năng chính

### User
- Browse and search dishes
- Ingredient-based filtering
- Random dish picker (dice/wheel flow)
- Favorites and meal history
- Daily streak tracking
- Email/password login and Google login

### Admin
- Role-based access to Admin Dashboard
- Basic dataset overview (foods, ingredients, links)
- Isolated admin route from user navigation flow

---

## 2) Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Language:** TypeScript
- **Navigation:** React Navigation (Native Stack + Bottom Tabs)
- **State:** Zustand
- **Database:** SQLite (expo-sqlite)
- **Auth:** Local account flow + Google Sign-In

---

## 3) Project Structure

```text
src/
  navigation/            # App routing and role-based stacks
  screens/               # User/Admin screens
  database/              # SQLite service + seed JSON
  store/                 # Zustand slices
  utils/                 # Theme/Auth/providers/helpers
  components/            # Shared UI and animations
```

Important files:
- `src/database/db-service.ts` — schema + seed loader
- `src/database/initial_seed_ctna.json` — initial dataset
- `src/navigation/AppNavigator.tsx` — role-based navigation

---

## 4) Prerequisites / Yêu cầu môi trường

- Node.js 18+ (recommended)
- npm 9+
- Android Studio (for Android build) and/or Xcode (for iOS build)
- Expo CLI via `npx expo`

---

## 5) Install & Run / Cài đặt và chạy

```bash
npm install
npm run start
```

### Native run

```bash
# Android
npx expo run:android

# iOS (macOS only)
npx expo run:ios
```

---

## 6) Seed Data / Dữ liệu ban đầu

- Initial database data is loaded from:
  - `src/database/initial_seed_ctna.json`
- Seeding runs when app is first launched (`isFirstLaunch = true` in store settings).

If you need to reseed:
1. Clear app data / reinstall app, or
2. Reset first-launch state in local storage/store.

Nếu cần nạp lại dữ liệu:
1. Xóa dữ liệu app / cài lại app, hoặc
2. Reset cờ first-launch trong store.

---

## 7) Authentication & Roles / Xác thực và phân quyền

- Local demo accounts:
  - `admin` role routes to **Admin Dashboard**
  - `user` role routes to **User Tabs**
- Google login is mapped to `user` role by default.

---

## 8) Google Sign-In Notes

Ensure these are configured correctly:
- iOS bundle id and OAuth iOS client
- Android package name + SHA-1/SHA-256 + OAuth Android/Web client
- Rebuild native app after any auth config update

---

## 9) Scripts

```bash
npm run start     # Start Expo dev server
npm run android   # Build/run Android
npm run ios       # Build/run iOS
npm run web       # Run web target
```

---

## 10) License

Private project for internal development.

