# Dự án "Hôm nay ăn gì?"

## Giới thiệu
"Hôm nay ăn gì?" là một ứng dụng di động được xây dựng trên nền tảng **React Native**, hướng tới việc giải quyết câu hỏi "đau đầu" nhất mỗi ngày của nhiều người. Ứng dụng cung cấp các tính năng từ việc ngẫu nhiên chọn món ăn, tìm kiếm món ăn theo nguyên liệu có sẵn, đến việc theo dõi "streak" nấu ăn mỗi ngày.

## Mục tiêu (Dựa trên Use Case)
### Phía Khách hàng (User)
- **Quay random "hôm nay ăn gì":** Tính năng cốt lõi giúp đưa ra quyết định nhanh chóng.
- **Nhập nguyên liệu để gợi ý món ăn:** Tận dụng nguyên liệu thừa trong tủ lạnh để tìm ra công thức phù hợp.
- **Lựa công thức nấu ăn:** Tìm và xem chi tiết công thức (bao gồm nguyên liệu, cách làm).
- **Streak nấu ăn:** Tính năng gamification giúp người dùng có động lực nấu ăn mỗi ngày.
- **Đăng nhập/Đăng ký:** Cho phép (không bắt buộc) để đồng bộ hóa dữ liệu (streak, món ăn yêu thích) lên cloud.

### Phía Quản trị viên (Admin)
- **Quản lý thực đơn (Thêm/Xóa/Sửa đồ ăn):** Đảm bảo cơ sở dữ liệu món ăn luôn phong phú và chính xác.
- **Thống kê (Xem số lượng thành viên):** Theo dõi sự phát triển của nền tảng.

## Hướng dẫn đọc tài liệu (Documentation)
Để hiểu rõ hơn về cách thức hoạt động và tham gia vào dự án, vui lòng đọc các tài liệu `.md` trong thư mục `.docs`:

### 1. Kiến trúc hệ thống
- Tham khảo `ARCHITECTURE.md` trong thư mục `.docs/architecture/` để nắm rõ luồng dữ liệu giữa React Native, Firebase và SQLite.

### 2. Quy định và Triển khai
- **Quy tắc chung:** Đọc `CONVENTIONS.md` trong thư mục `.docs/rules/` để hiểu về coding convention, cách quản lý branch và versioning.
- **Triển khai (Deployment):** Đọc `DEPLOYMENT.md` trong thư mục `.docs/rules/` để nắm quy trình đưa app lên store (App Store/Google Play).

### 3. Nhiệm vụ từng Role (Vai trò)
Mỗi thành viên trong dự án sẽ có các mô tả công việc cụ thể. Vui lòng vào thư mục `.docs/roles/` để đọc file mô tả tương ứng với vị trí của bạn:
- `UI_DESIGNER.md`: Dành cho bộ phận thiết kế giao diện (UI/UX).
- `FRONTEND_DEV.md`: Dành cho lập trình viên React Native.
- `BACKEND_DEV.md`: Dành cho người phụ trách cấu hình Firebase và Database.

---
*Dự án đang trong giai đoạn khởi tạo cấu trúc ban đầu.*
