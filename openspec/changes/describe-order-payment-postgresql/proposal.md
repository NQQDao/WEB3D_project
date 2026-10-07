# Proposal

## Why

Người dùng muốn hiểu rõ và nắm bắt quy trình đặt hàng và thanh toán (Order & Payment Flow) của dự án Haven & Home Web3D, đặc biệt là cách thức các API kết nối, thao tác dữ liệu và quản lý giao dịch (Transactions) trực tiếp với cơ sở dữ liệu PostgreSQL. Cung cấp tài liệu quy trình đầy đủ giúp định hướng phát triển backend và tích hợp frontend mượt mà.

## What Changes

- Mô tả chi tiết luồng xử lý Đặt hàng (Checkout) & Thanh toán (COD / Chuyển khoản) từ phía Frontend tới Backend Node.js/Express.
- Cấu trúc sơ đồ cơ sở dữ liệu PostgreSQL liên quan đến Đặt hàng và Thanh toán (`users`, `carts`, `cart_items`, `orders`, `order_items`, `vouchers`).
- Thiết lập quy trình DB Transaction (`BEGIN`, `COMMIT`, `ROLLBACK`) để đảm bảo tính toàn vẹn dữ liệu khi tạo đơn hàng.
- Chi tiết cơ chế xử lý tính toán tổng tiền, áp dụng voucher giảm giá và đồng bộ sản phẩm/tùy chỉnh 3D.

## Capabilities

### New Capabilities
- `order-payment-postgresql`: Mô tả chi tiết quy trình đặt hàng, thanh toán và kiến trúc kết nối CSDL PostgreSQL trong hệ thống.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- **Backend APIs**: Các file router `server/routes/orders.js`, `server/routes/cart.js`, `server/routes/admin.js`, và module DB `server/db.js`.
- **Database Schema**: Các bảng `orders`, `order_items`, `carts`, `cart_items`, `vouchers`.
- **Frontend Integration**: Quản lý state giỏ hàng (`src/cartStore.js`), gọi API tạo đơn (`src/api.js`), giao diện Checkout.

