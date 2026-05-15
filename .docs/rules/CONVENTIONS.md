# Quy định chung (Conventions)

Tài liệu này định nghĩa các quy định chung mà tất cả các thành viên tham gia dự án "Hôm nay ăn gì" phải tuân theo.

## 1. Naming Convention (Quy tắc đặt tên)
- **Thư mục (Folders):** Sử dụng `kebab-case` hoặc `camelCase` (Khuyến nghị: `kebab-case` cho thư mục chung, `camelCase` hoặc `PascalCase` cho thư mục components).
- **Files Code (.ts, .tsx):** 
  - React Components: Sử dụng `PascalCase` (VD: `RecipeCard.tsx`, `HomeScreen.tsx`).
  - Helper/Utils/Hooks: Sử dụng `camelCase` (VD: `useRandomFood.ts`, `formatDate.ts`).
- **Biến và Hàm (Variables/Functions):** Sử dụng `camelCase` (VD: `isLoggedIn`, `fetchRecipes()`).
- **Hằng số (Constants):** Sử dụng `UPPER_SNAKE_CASE` (VD: `MAX_STREAK_DAYS`, `API_KEY`).

## 2. Tiêu chuẩn Mã nguồn (Skill Impeccable)
- **Skill Impeccable**: Đây là nguyên tắc cốt lõi của dự án. Mọi dòng code được viết ra phải đảm bảo chất lượng hoàn hảo nhất:
  - KHÔNG có lỗi chính tả trong UI, thông báo hay comments.
  - Xử lý logic chặt chẽ, tối ưu và hạn chế tối đa các bug tiềm ẩn.
  - Tuân thủ nghiêm ngặt các quy ước đặt tên và cấu trúc file.
  - Code gọn gàng, sạch sẽ, luôn kiểm tra lại nhiều lần trước khi hoàn tất.

## 3. Git & Versioning
- **Mô hình Git:** Sử dụng Git Flow cơ bản (`main`, `develop`, và các nhánh `feature/`, `bugfix/`).
- **Conventional Commits:** Tất cả commit message phải theo chuẩn Conventional Commits:
  - `feat: [mô tả]` (Thêm tính năng mới)
  - `fix: [mô tả]` (Sửa lỗi)
  - `docs: [mô tả]` (Cập nhật tài liệu)
  - `refactor: [mô tả]` (Cải thiện code)
  - `chore: [mô tả]` (Cập nhật dependencies, tasks không liên quan đến source code)
- **Versioning:** Tuân thủ Semantic Versioning (SemVer) định dạng `MAJOR.MINOR.PATCH` (VD: `1.0.0`).

## 3. Formatting & Linting
- Bắt buộc cài đặt và sử dụng **ESLint** và **Prettier** trong project.
- Không push code có cảnh báo lỗi linter lên repository.

## 4. Quản lý Task
- Tuân thủ checklist trong `task.md`.
- Đảm bảo branch được test kỹ trên máy local trước khi tạo Pull Request (PR).
