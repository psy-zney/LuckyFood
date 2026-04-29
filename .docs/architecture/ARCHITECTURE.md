# Kiến trúc Hệ thống (System Architecture)

Ứng dụng "Hôm nay ăn gì" được thiết kế dựa trên mô hình **Client-Server** với việc tận dụng các dịch vụ Backend-as-a-Service (BaaS) và Local Database để tối ưu trải nghiệm offline.

## 1. Công nghệ chính
- **Frontend (Mobile App):** React Native (hỗ trợ iOS & Android từ một source code).
- **Backend/Cloud Database:** Firebase (Authentication, Firestore, Storage).
- **Local Database:** SQLite (Sử dụng thư viện `react-native-sqlite-storage` hoặc `expo-sqlite`).

## 2. Luồng dữ liệu (Data Flow)

### Chế độ Offline-First (Ưu tiên SQLite)
- Khi app khởi chạy, dữ liệu món ăn, nguyên liệu, và chuỗi streak sẽ được query từ **SQLite** lên bộ nhớ (Redux/Zustand state).
- Mọi thao tác như "Quay random" hay "Nhập nguyên liệu lọc món ăn" đều thực thi trên SQLite để đảm bảo tốc độ phản hồi nhanh (zero-latency) và không phụ thuộc internet.

### Cơ chế Đồng bộ (Sync với Firebase)
- Khi người dùng đăng nhập hoặc có mạng:
  - App tải các món ăn mới/cập nhật từ **Firebase Firestore** và lưu đè/insert vào bảng trong **SQLite**.
  - Dữ liệu cá nhân (Streak nấu ăn, món ăn yêu thích) được backup từ SQLite lên Firestore.
- Admin khi thêm/xóa/sửa đồ ăn sẽ thao tác thẳng vào Firestore. Các user clients sẽ nhận được bản cập nhật khi app kết nối mạng.

## 3. Lược đồ Cơ sở dữ liệu (Database Schema)

### Collection (Firestore) / Table (SQLite)
- `Users`: Chứa thông tin user, role (admin/user), `currentStreak`, `highestStreak`.
- `Foods` (Món ăn): `id`, `name`, `description`, `imageUrl`, `category`, `prepTime`.
- `Ingredients` (Nguyên liệu): `id`, `name`, `icon`.
- `Food_Ingredients`: Bảng trung gian nối Món ăn và Nguyên liệu (Phục vụ tính năng tìm món theo nguyên liệu).

## 4. Quản lý State (State Management)
- **Local Component State:** Dùng `useState`, `useReducer` cho các logic nhỏ gọn trong một màn hình.
- **Global State:** Sử dụng **Redux Toolkit** hoặc **Zustand** để giữ trạng thái User Profile, Auth Status, và Cấu hình App.
- **Async Data Fetching:** Sử dụng `React Query` (TanStack Query) để quản lý bộ nhớ đệm (cache) khi gọi API Firebase.
