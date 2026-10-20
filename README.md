# Landing page 20/10 — Gửi yêu thương

Landing page React + Vite với hiệu ứng scroll storytelling, hoa/trái tim bay, animation xuất hiện khi cuộn, thiệp chúc mừng có thể chỉnh sửa và chia sẻ.

## Yêu cầu
- Node.js 18+ (khuyến nghị Node.js 20 hoặc 22)
- npm

## Chạy dự án
```bash
npm install
npm run dev
```
Mở URL Vite hiển thị trong terminal (thường là http://localhost:5173).

## Build production
```bash
npm run build
npm run preview
```

## Tuỳ chỉnh
- Nội dung các lời chúc: `src/main.jsx`, mảng `wishes`.
- Nội dung thiệp mặc định: state `recipient` và `customWish` trong `src/main.jsx`.
- Màu sắc, responsive và hiệu ứng: `src/styles.css`.
- Ảnh concept tham khảo: `public/images/design-concept-20-10.png`.

## Công nghệ
React, Vite, Framer Motion, Lucide React, CSS responsive.
