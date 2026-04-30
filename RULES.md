# RULES.md - Project Directives

Khi AI chạy, luôn đọc file này để nắm được quy tắc thiết kế (Impeccable Style) và các rules chung của project trước khi bắt đầu code.

## 1. THE CORE ANTI-PATTERNS (KHÔNG BAO GIỜ LÀM)
- **Không dùng System Fonts mặc định:** KHÔNG dùng Inter, Roboto, Arial. LUÔN sử dụng Google Fonts chất lượng cao (ví dụ: Playfair Display / Newsreader cho headings, Plus Jakarta Sans cho body).
- **Không dùng màu Đen/Trắng nguyên bản:** KHÔNG dùng `#000000` hoặc `#FFFFFF` cho những mảng lớn. Dùng màu neutral có pha chút màu chủ đạo (ví dụ `#1A1523`, `#FCFCFA`).
- **Không lồng ghép Card quá nhiều (Cardocalypse):** Tránh việc lồng card vào trong card, bọc viền và đổ bóng mọi thứ. Dùng khoảng trắng (whitespace) và typography để phân tách nội dung.
- **Không dùng chữ Xám trên nền Màu:** Nếu nền có màu, chữ phải là màu đậm hơn rất nhiều của màu nền đó, hoặc trắng tinh/đen nhạt (tinted neutral).
- **Không dùng Animation lò xo (Spring/Bounce):** Dùng Easing mượt mà (nhanh lúc đầu, chậm lúc sau), không dùng hiệu ứng nảy rẻ tiền.

## 2. TYPOGRAPHY
- Tạo độ tương phản mạnh giữa Heading và Body. Heading lớn và đậm (hoặc Serif), Body nhỏ và dễ đọc.
- **Letter Spacing:** Thu hẹp khoảng cách chữ (tracking) cho Heading lớn (-1px hoặc -0.05em).
- **Line Height:** Thu hẹp dòng cho Heading (1.1). Nới lỏng dòng cho Body (1.5 hoặc 1.6).

## 3. COLOR & CONTRAST
- **Quy tắc pha màu (Tinted Rule):** Mọi màu xám/đen/trắng đều phải được pha một chút màu chủ đạo của brand (ví dụ đen pha ánh tím/hồng).
- **Tránh dùng màu Primary làm màu nền (Background):** Chỉ dùng màu Primary cho các thành phần cần tương tác (buttons, active states). Nền luôn phải nhẹ nhàng, dịu mắt.

## 4. LAYOUT & SPACING
- **Sử dụng khoảng trắng (Whitespace):** Dùng padding và margin rộng rãi (bội số của 8: 16, 24, 32, 48, 64). Không nhồi nhét.
- **Tính bất đối xứng (Asymmetry):** Căn trái (Left-aligned) thường mang lại cảm giác chuyên nghiệp hơn là luôn luôn căn giữa mọi thứ.
- **Tràn viền (Bleed):** Cho phép hình ảnh hoặc mảng nền tràn ra mép màn hình để tạo cảm giác chìm đắm (immersive).

## 5. UI COMPONENTS
- **Buttons:** Nút bấm phải to bản, padding ngang rộng rãi. Hạn chế dùng pill-shape (nút bo tròn hai đầu hoàn toàn) trừ khi brand yêu cầu.
- **Borders:** Viền phải thật mỏng và tinh tế (ví dụ: dùng màu chữ nhưng giảm opacity xuống 10%), không dùng viền xám cứng nhắc.
- **Icons:** Giữ kích thước icon ổn định (20x20 hoặc 24x24). Không phóng to icon một cách lố bịch để lấp chỗ trống.

## 6. REACT NATIVE SPECIFICS
- Sử dụng `Animated.timing` với `Easing.out` hoặc `Easing.bezier`. KHÔNG dùng `spring`.
- Xử lý SafeArea cẩn thận.
- Quản lý giao diện chặt chẽ bằng `StyleSheet` và các file `theme.ts`.
