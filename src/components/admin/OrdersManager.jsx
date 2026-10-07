import React, { useEffect } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function OrdersManager() {
  const {
    orders,
    fetchOrders,
    updateOrderStatus,
    selectedOrder,
    isOrderModalOpen,
    openOrderDetail,
    closeOrderDetail,
    orderFilter,
    setOrderFilter,
  } = useAdminStore();

  const { addToast } = useShowroomStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    orderFilter === 'all'
      ? orders
      : orders.filter((o) => o.order_status === orderFilter);

  const handleStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      addToast(`Đã cập nhật trạng thái đơn hàng sang "${getStatusText(newStatus)}"`, 'success', '📦');
    }
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý kỹ thuật',
      delivering: 'Đang giao & Lắp đặt',
      completed: 'Đã bàn giao hoàn tất',
      cancelled: 'Đã hủy',
    };
    return map[status] || status;
  };

  return (
    <div className="admin-orders-view">
      {/* Header & Filter Row */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản Lý Đơn Hàng 3D</h2>
          <p className="admin-page-desc">
            Theo dõi, xử lý và cập nhật tiến độ đơn hàng với thông số cấu hình 3D tùy biến của khách hàng.
          </p>
        </div>

        <div className="order-filter-pills">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ xác nhận' },
            { id: 'processing', label: 'Đang xử lý' },
            { id: 'delivering', label: 'Đang giao' },
            { id: 'completed', label: 'Hoàn tất' },
          ].map((f) => (
            <button
              key={f.id}
              className={`filter-pill-btn ${orderFilter === f.id ? 'active' : ''}`}
              onClick={() => setOrderFilter(f.id)}
            >
              {f.label}
              {f.id === 'pending' && (
                <span className="filter-count-badge">
                  {orders.filter((o) => o.order_status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng & Liên Hệ</th>
                <th>Cấu Hình Sản Phẩm 3D</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty-row">
                    Không có đơn hàng nào trong mục này.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="order-code-group">
                          <strong className="order-code-badge">{order.order_code}</strong>
                          <span className="order-date-text">
                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="table-customer-cell">
                          <strong className="customer-name">{order.customer_name}</strong>
                          <span className="customer-phone">📞 {order.customer_phone}</span>
                          <span className="customer-email">✉️ {order.customer_email}</span>
                        </div>
                      </td>

                      <td>
                        <div className="table-order-items">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((it, idx) => (
                              <div key={idx} className="order-item-chip">
                                {it.finish_color_hex && (
                                  <span
                                    className="item-chip-swatch"
                                    style={{ backgroundColor: it.finish_color_hex }}
                                  ></span>
                                )}
                                <span className="item-chip-name">{it.product_name}</span>
                                {it.finish_name && (
                                  <span className="item-chip-finish">({it.finish_name})</span>
                                )}
                                <span className="item-chip-qty">x{it.quantity}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-muted">1x Sofa Luna Curve Lounge</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="table-price-cell">
                          <strong className="table-price">${order.total_amount?.toLocaleString()}</strong>
                          {order.discount_amount > 0 && (
                            <span className="discount-applied">
                              - ${order.discount_amount?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <select
                          className={`status-select status-${order.order_status}`}
                          value={order.order_status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="pending">⏳ Chờ xác nhận</option>
                          <option value="processing">⚙️ Đang xử lý</option>
                          <option value="delivering">🚚 Đang giao & Lắp đặt</option>
                          <option value="completed">✅ Đã hoàn tất</option>
                          <option value="cancelled">❌ Đã hủy đơn</option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="admin-action-btn"
                          onClick={() => openOrderDetail(order)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="admin-modal-wrapper active">
          <div className="admin-modal-backdrop" onClick={closeOrderDetail}></div>
          <div className="admin-modal-card order-detail-modal">
            <button className="modal-close" onClick={closeOrderDetail}>
              &times;
            </button>

            <div className="modal-header">
              <span className="modal-category">CHI TIẾT ĐƠN HÀNG</span>
              <h3 className="modal-title">Đơn hàng #{selectedOrder.order_code}</h3>
              <span className="order-modal-date">
                Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Customer Info Box */}
            <div className="detail-info-grid">
              <div className="info-block">
                <h5>Khách hàng</h5>
                <strong>{selectedOrder.customer_name}</strong>
                <span>{selectedOrder.customer_phone}</span>
                <span>{selectedOrder.customer_email}</span>
              </div>
              <div className="info-block">
                <h5>Địa chỉ giao & Lắp đặt</h5>
                <p>{selectedOrder.shipping_address || 'Địa chỉ mặc định tại Showroom'}</p>
                <span className="text-muted">Phương thức: {selectedOrder.payment_method === 'cod' ? 'Thanh toán khi nhận hàng & Lắp đặt' : 'Chuyển khoản'}</span>
              </div>
            </div>

            {/* Items with 3D Customization */}
            <h5 className="section-mini-heading">Sản phẩm & Cấu hình 3D:</h5>
            <div className="modal-items-list">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="modal-item-row">
                  <div className="modal-item-left">
                    {item.finish_color_hex && (
                      <span
                        className="modal-item-swatch"
                        style={{ backgroundColor: item.finish_color_hex }}
                      ></span>
                    )}
                    <div>
                      <strong>{item.product_name}</strong>
                      {item.finish_name && (
                        <span className="modal-item-finish-text">
                          Chất liệu: {item.finish_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="modal-item-right">
                    <span>{item.quantity} x ${item.unit_price?.toLocaleString()}</span>
                    <strong>${(item.quantity * item.unit_price)?.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Lines */}
            <div className="modal-order-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>${selectedOrder.subtotal?.toLocaleString()}</span>
              </div>
              {selectedOrder.discount_amount > 0 && (
                <div className="summary-row discount-row">
                  <span>Khuyến mãi:</span>
                  <span>- ${selectedOrder.discount_amount?.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Phí vận chuyển & Bàn giao:</span>
                <span className="text-success">Miễn phí 100%</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <strong>Tổng thanh toán:</strong>
                <strong className="total-highlight">${selectedOrder.total_amount?.toLocaleString()}</strong>
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="modal-status-bar">
              <span>Trạng thái đơn:</span>
              <select
                className={`status-select status-${selectedOrder.order_status}`}
                value={selectedOrder.order_status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
              >
                <option value="pending">⏳ Chờ xác nhận</option>
                <option value="processing">⚙️ Đang xử lý kỹ thuật</option>
                <option value="delivering">🚚 Đang giao hàng & Lắp đặt</option>
                <option value="completed">✅ Đã hoàn tất</option>
                <option value="cancelled">❌ Đã hủy đơn</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
