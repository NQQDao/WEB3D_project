# Design: Quy trình Đặt hàng & Thanh toán với PostgreSQL

## Context
Xem `proposal.md` để hiểu về động lực và phạm vi tổng quan. 
Dự án sử dụng kiến trúc Client-Server:
- **Frontend**: React / Vanilla JS + Zustand/State store + Three.js
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (kết nối qua thư viện `pg` Pool/Client)

## Goals / Non-Goals

**Goals:**
- Thiết kế chi tiết sơ đồ ERD/Schema cơ sở dữ liệu PostgreSQL cho giỏ hàng, mã giảm giá và đơn hàng.
- Định nghĩa luồng dữ liệu (Data Flow) từ Frontend tới Backend và DB cho 2 tình huống:
  1. Thêm sản phẩm vào giỏ (sync với DB).
  2. Áp dụng mã giảm giá và Tạo đơn hàng (Checkout).
- Minh họa rõ cách sử dụng PostgreSQL Transaction (`BEGIN`, `COMMIT`, `ROLLBACK`) để đảm bảo không rò rỉ hoặc sai lệch số lượng/tiền bạc khi tạo đơn.

**Non-Goals:**
- Tích hợp cổng thanh toán trực tuyến thực tế (VNPAY, Momo, Stripe) ở giai đoạn này (chỉ thiết kế luồng COD / Chuyển khoản giả lập thành công).

## Decisions

### 1. Sử dụng Explicit Database Transaction (`pool.connect()`) cho Đơn hàng
- **Quyết định**: Khi người dùng ấn Đặt hàng (`POST /api/orders`), backend sẽ mượn 1 client từ pool kết nối `const client = await pool.connect()` và gọi `BEGIN`. 
- **Lý do**: Đơn hàng gồm thông tin chung (`orders`) và nhiều chi tiết sản phẩm (`order_items`). Nếu insert vào `orders` thành công nhưng insert `order_items` thất bại, toàn bộ thao tác phải được `ROLLBACK` để tránh tạo đơn rác không có sản phẩm.
- **Thay thế đã cân nhắc**: Thực hiện nhiều câu lệnh `query()` độc lập mà không dùng transaction. (Bị loại bỏ vì nguy cơ mất an toàn dữ liệu).

### 2. Mô hình Giỏ hàng Linh hoạt (Guest vs Registered Users)
- **Quyết định**: Bảng `carts` cho phép `user_id` mang giá trị `NULL` để hỗ trợ khách vãng lai. Khi khách đăng nhập/đăng ký, giỏ hàng có thể được hợp nhất (sync).
- **Cấu trúc Bảng CSDL chính**:
  - `users` (id, email, full_name, avatar_url, role, tier, created_at)
  - `vouchers` (code, discount_percent, discount_amount, description, is_active, max_uses, used_count, expires_at)
  - `carts` (id, user_id, voucher_code, created_at)
  - `cart_items` (id, cart_id, product_id, name, category, finish_key, finish_name, swatch_color, quantity, unit_price)
  - `orders` (id, order_code, user_id, customer_name, customer_email, customer_phone, shipping_address, subtotal, discount_amount, total_amount, order_status, payment_method, created_at)
  - `order_items` (id, order_id, product_id, product_name, finish_name, finish_color_hex, quantity, unit_price, total_price)

## Risks / Trade-offs

- **[Risk]** Pool connection bị cạn kiệt nếu `client.release()` không được gọi khi có lỗi.
  - → **Mitigation**: Tất cả các thao tác DB Transaction phải đặt trong khối `try ... catch ... finally` và luôn luôn thực hiện `client.release()` trong khối `finally`.

