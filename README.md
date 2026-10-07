# Haven & Home — Showroom Nội Thất 3D (Web3D)

Website showroom nội thất phòng khách 3D thời gian thực, có giỏ hàng, đặt hàng và trang quản trị. Frontend dùng **React + Three.js + Vite**, backend dùng **Node.js (Express) + PostgreSQL**.

## ✨ Tính năng

**Showroom 3D**
- Phòng khách 3D: sofa *Luna Curve Lounge*, bàn trà *Arlo Fluted Table*, ghế *Terra Nordic Armchair*, đèn cây *Halo Brass Arc Lamp*, cây xanh, thảm và sàn gỗ PBR.
- 3 kịch bản ánh sáng: ban ngày, hoàng hôn, ban đêm.
- Đổi chất liệu sofa: Bouclé kem, da Cognac, nhung xanh rêu, xám Slate.
- 4 góc camera có sẵn, xoay 360°, zoom, tự xoay, toàn màn hình, thước đo kích thước 3D.
- Điểm ghim (hotspot) để xem thông tin sản phẩm. Vân gỗ, vân đá và thảm được vẽ bằng canvas nên không cần tải ảnh.

**Mua sắm và tài khoản**
- Đăng ký / đăng nhập, lưu cấu hình phòng 3D.
- Giỏ hàng, mã giảm giá (voucher), đặt hàng.

**Trang quản trị**
- Tổng quan thống kê, quản lý đơn hàng, sản phẩm, voucher và khách hàng.

**Chế độ offline:** khi backend hoặc PostgreSQL không chạy, website tự lưu dữ liệu vào trình duyệt (localStorage) và vẫn dùng được.

## 🚀 Cài đặt và chạy

Yêu cầu: Node.js 20 trở lên. PostgreSQL là tuỳ chọn (không có thì chạy ở chế độ offline).

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file cấu hình rồi sửa DATABASE_URL cho đúng máy của bạn
cp .env.example .env

# 3. (Tuỳ chọn) Tạo bảng và dữ liệu mẫu trong PostgreSQL
npm run db:migrate

# 4. Chạy backend (cổng 5000) và frontend (cổng 5173) ở hai terminal riêng
npm run server
npm run dev
```

Mở `http://localhost:5173`. Frontend tự chuyển các request `/api` sang backend ở cổng 5000.

Lưu ý: `npm run db:migrate` vẫn báo thoát thành công kể cả khi SQL lỗi, hãy đọc kỹ thông báo in ra.

### Đóng gói production

```bash
npm run build     # xuất ra thư mục dist/
npm run preview   # xem thử bản build
```

## 📁 Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `src/engine/threeEngine.js` | Cảnh 3D (Three.js) |
| `src/components/` | Giao diện React: `showroom`, `cart`, `auth`, `admin`, `layout`, `common` |
| `src/stores/` | State (Zustand) và dữ liệu sản phẩm |
| `src/api.js` | Gọi API, tự chuyển sang offline khi mất kết nối |
| `server/` | API Express, kết nối PostgreSQL, `schema.sql` và script migrate |
| `openspec/` | Kế hoạch thay đổi theo quy trình OpenSpec |

## ⚠️ Chưa sẵn sàng cho production

- Đăng nhập chưa kiểm tra mật khẩu và chưa dùng token; API `/api/admin` chưa được bảo vệ.
- Chưa có test và linter.

## 🛠️ Công nghệ

React 19, Three.js, Zustand, Vite, Express 5, PostgreSQL (`pg`).
