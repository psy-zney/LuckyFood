# Hướng dẫn triển khai (Deployment)

Tài liệu này quy định cách thức build và đưa ứng dụng "Hôm nay ăn gì" lên các môi trường (Staging/Production).

## 1. Môi trường (Environments)
Ứng dụng sử dụng 2 môi trường chính:
- **Staging (Test):** Dùng để tester và nội bộ đội dev kiểm thử. Dữ liệu sử dụng từ Firebase Staging.
- **Production (Live):** Dành cho người dùng cuối. Dữ liệu thực từ Firebase Production.

*Lưu ý:* Môi trường được quản lý thông qua các file `.env` (ví dụ: `.env.development`, `.env.production`).

## 2. CI/CD (Continuous Integration / Continuous Deployment)
*Phần này sẽ được cấu hình sau bằng GitHub Actions hoặc Bitrise.*
- **Trigger:** Khi push code lên nhánh `main`, hệ thống tự động chạy lint, tests và build bản phân phối.
- **Fastlane:** Khuyến nghị dùng Fastlane để tự động hóa quá trình đẩy app lên TestFlight/Google Play Console.

## 3. Quy trình Build iOS (TestFlight / App Store)
1. Đảm bảo tài khoản Apple Developer đã được thêm vào Xcode.
2. Cập nhật version/build number trong Xcode hoặc qua script.
3. Chạy lệnh build (Nếu dùng Expo: `eas build -p ios`, nếu dùng bare RN: build qua Xcode Archive).
4. Upload build lên App Store Connect.
5. Tạo release trên TestFlight.

## 4. Quy trình Build Android (Google Play)
1. Có file `keystore` hợp lệ.
2. Cập nhật `versionCode` và `versionName` trong `android/app/build.gradle`.
3. Chạy lệnh build Release APK/AAB (Nếu dùng Expo: `eas build -p android`, nếu bare RN: `./gradlew bundleRelease`).
4. Upload file `.aab` lên Google Play Console.
5. Cấu hình track (Internal Testing, Alpha, hoặc Production).
