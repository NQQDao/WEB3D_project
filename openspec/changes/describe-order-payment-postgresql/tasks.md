# Tasks

## 1. Thiết lập CSDL PostgreSQL & API đồng bộ Giỏ hàng

- [ ] 1.1 Xác minh sơ đồ các bảng `carts` và `cart_items` trong CSDL PostgreSQL đã tồn tại và hỗ trợ tính năng tùy chỉnh sản phẩm 3D.
- [ ] 1.2 Kiểm tra logic API `POST /api/cart/items` xử lý việc lưu sản phẩm (dành cho người dùng đã đăng nhập hoặc khách vãng lai) và kiểm tra dữ liệu giỏ hàng bằng `GET /api/cart`.

## 2. Xử lý Mã giảm giá (Vouchers) & Kiểm tra Điều kiện

- [ ] 2.1 Kiểm tra bảng `vouchers` trong PostgreSQL và kiểm tra tính hợp lệ qua API `POST /api/cart/voucher`.
- [ ] 2.2 Đảm bảo mã giảm giá hợp lệ được áp dụng và cập nhật đúng số tiền được giảm (`discount_amount`) vào thông tin giỏ hàng/đơn hàng.

## 3. Tạo Đơn hàng & Xử lý Transaction trong PostgreSQL

- [ ] 3.1 Kiểm tra API `POST /api/orders` trong `server/routes/orders.js` có triển khai đúng `BEGIN`, `INSERT INTO orders`, `INSERT INTO order_items` và `COMMIT`.
- [ ] 3.2 Kiểm tra cơ chế `ROLLBACK` khi xảy ra sự cố trong quá trình thêm danh sách món hàng (`order_items`).
- [ ] 3.3 Đảm bảo lịch sử đơn hàng `GET /api/orders` trả về đúng danh sách các đơn hàng đã tạo kèm số lượng món và tổng tiền từ PostgreSQL.

## Workflow follow-up

- Lưu trữ (Archive) tài liệu thay đổi này sau khi người dùng xác nhận lại toàn bộ kế hoạch.

