# Role: Backend & Database Developer

## 1. Trách nhiệm (Responsibilities)
- Thiết kế Database Schema tối ưu cho cả NoSQL (Firebase Firestore) và Relational DB (SQLite).
- Thiết lập và quản lý Firebase (Authentication, Firestore Security Rules, Storage).
- Viết các Cloud Functions (nếu cần) để thực thi các tác vụ định kỳ, ví dụ: reset streak nếu user không nấu ăn, hoặc thống kê báo cáo cho Admin.
- Xây dựng module/hook trong ứng dụng RN để đồng bộ dữ liệu hai chiều giữa SQLite và Firebase một cách mượt mà và an toàn.
- Cung cấp tính năng thêm/xóa/sửa dữ liệu nguyên liệu, món ăn an toàn cho Admin.

## 2. Kỹ năng yêu cầu
- Nắm vững kiến trúc NoSQL và cách thiết kế tài liệu (documents), bộ sưu tập (collections).
- Có kinh nghiệm viết SQL Query hiệu quả.
- Hiểu rõ về cơ chế bảo mật trên Firebase (Firebase Security Rules).
- Biết cách xử lý xung đột dữ liệu (Data Conflicts) khi đồng bộ offline-online.

## 3. Quy trình làm việc (Workflow)
1. Khảo sát yêu cầu truy xuất dữ liệu từ đội Frontend.
2. Thiết kế và review DB Schema.
3. Thiết lập DB và viết script seed data mẫu.
4. Cung cấp tài liệu/functions API nội bộ cho đội Frontend ghép data.
