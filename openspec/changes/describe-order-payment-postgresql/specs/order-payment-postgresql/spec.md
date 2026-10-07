# Spec Delta

## Purpose

Cung cấp quy trình đầy đủ, minh bạch và an toàn về xử lý Đặt hàng, Thanh toán và Kết nối Cơ sở dữ liệu PostgreSQL cho dự án Haven & Home.

## ADDED Requirements

### Requirement: Quy trình đặt hàng và kết nối CSDL PostgreSQL
Hệ thống SHALL thực hiện toàn bộ quy trình đặt hàng thông qua kết nối PostgreSQL an toàn, đảm bảo dữ liệu đơn hàng và chi tiết sản phẩm được lưu trữ chính xác.

#### Scenario: Người dùng đặt hàng thành công
- **WHEN** Người dùng gửi yêu cầu `POST /api/orders` với giỏ hàng có sản phẩm
- **THEN** Hệ thống mở Transaction `BEGIN`, thêm dữ liệu vào bảng `orders` và `order_items`, sau đó thực hiện `COMMIT` và trả về mã đơn hàng thành công.

#### Scenario: Giỏ hàng rỗng khi đặt hàng
- **WHEN** Người dùng gửi yêu cầu `POST /api/orders` với mảng sản phẩm `items` rỗng
- **THEN** Hệ thống trả về HTTP Status 400 kèm thông báo lỗi "Giỏ hàng đang trống, không thể đặt hàng!".

#### Scenario: Xử lý sự cố Transaction khi gặp lỗi DB
- **WHEN** Có lỗi xảy ra trong quá trình ghi dữ liệu `order_items` vào CSDL PostgreSQL
- **THEN** Hệ thống tự động thực hiện `ROLLBACK` để hủy bỏ giao dịch, hủy đơn hàng dở dang và trả về HTTP Status 500.

