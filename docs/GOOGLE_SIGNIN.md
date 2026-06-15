# Hướng dẫn mở lại tính năng Google Sign-In

Hiện tại, tính năng đăng nhập bằng Google đang được tạm ẩn (mock) để bạn có thể test giao diện (UI) bằng ứng dụng **Expo Go** trên thiết bị thật (Expo Go không hỗ trợ các module mã gốc/native module như Google Sign-In).

Khi bạn muốn test thực tế tính năng đăng nhập Google hoặc khi chuẩn bị ra mắt ứng dụng (build app thật), hãy làm theo các bước sau để mở lại:

## 1. Mở lại code trong `src/utils/AuthProvider.tsx`
Vào file `src/utils/AuthProvider.tsx` và tìm đoạn đầu file:
```tsx
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
const GoogleSignin: any = {
  configure: () => {},
  hasPlayServices: async () => {},
  signIn: async () => ({ data: { user: null } }),
  signOut: async () => {},
};
```

Hãy **xoá bỏ** đoạn biến giả `const GoogleSignin: any = ...` ở trên, và **bỏ comment** (xoá dấu `//`) ở dòng import:
```tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';
```

## 2. Build bản Native App (Development Client)
Bạn KHÔNG THỂ dùng Expo Go nữa. Bạn phải build ra một ứng dụng riêng.

**Nếu test trên Android (Windows):**
Mở terminal và chạy lệnh:
```bash
npx expo run:android
```
*(Yêu cầu đã cài đặt Android Studio / Emulator)*

**Nếu test trên iOS (Bắt buộc dùng EAS Build nếu dùng Windows):**
```bash
npx eas build --profile development --platform ios
```
*(Yêu cầu có tài khoản Apple Developer 99$/năm để cấp phép cài đặt lên thiết bị)*

Sau khi chạy các lệnh trên thành công, tính năng Google Sign-In sẽ hoạt động bình thường!
