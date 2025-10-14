<div align="center">
	<h2 align="center">Explore Gallery</h2>
	<p>Ứng dụng cho phép người dùng khám phá, tìm kiếm, lọc, tải thêm ảnh vô hạn, và thêm mới ảnh.</p>
	<div>
		<img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
		<img src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
		<img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
	</div>
</div>

---

## Demo

[https://next-explore-gallery.vercel.app](https://next-explore-gallery.vercel.app)

---

## Công nghệ sử dụng

| Công nghệ                                   | Mục đích                                                    |
| ------------------------------------------- | ----------------------------------------------------------- |
| **Next.js 15 (App Router)**                 | Framework chính, SSR/ISR và route handlers mock API         |
| **TypeScript**                              | Tăng độ an toàn kiểu dữ liệu                                |
| **Tailwind CSS + shadcn/ui**                | UI framework, tạo giao diện nhanh và thống nhất             |
| **@tanstack/react-query**                   | Data fetching, caching, infinite scroll                     |
| **react-intersection-observer**             | Theo dõi vị trí viewport để load thêm ảnh (infinite scroll) |
| **better-fetch**                            | Wrapper fetch API gọn gàng                                  |

---

## Tính năng chính

* **Tìm kiếm ảnh theo từ khóa**
  * Có **debounce (500ms)** để tránh spam request

* **Lọc ảnh theo tag**
* **Infinite Scroll**
  * Tự động tải thêm khi người dùng cuộn đến cuối

* **Tạo mới ảnh**
  * Form nhập thông tin, gửi POST request đến API giả lập

---

## Cách chạy dự án

### 1. Clone repo

```bash
git clone https://github.com/hdkhanh462/next-explore-gallery.git
cd explore-gallery
```

### 2. Cài dependencies

```bash
npm install
# hoặc
bun install
```

### 3. Chạy project

```bash
npm run dev
# hoặc
bun run dev
```

Truy cập tại:
 [http://localhost:3000](http://localhost:3000)

---
