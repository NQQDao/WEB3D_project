import React, { useEffect } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';

export default function DashboardOverview() {
  const { stats, fetchStats, isLoadingStats, orders, fetchOrders, openOrderDetail, setActiveTab } =
    useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  if (isLoadingStats || !stats) {
    return (
      <div className="admin-loading-state">
        <div className="admin-spinner"></div>
        <p>Đang tổng hợp dữ liệu thống kê từ hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="admin-overview-view">
      {/* 1. KPI Cards Header */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box revenue-icon">💰</div>
          <div className="kpi-data">
            <span className="kpi-label">Tổng doanh thu</span>
            <strong className="kpi-value">${stats.totalRevenue.toLocaleString()}</strong>
            <span className="kpi-trend positive">↑ +18.4% so với tháng trước</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box orders-icon">📦</div>
          <div className="kpi-data">
            <span className="kpi-label">Đơn hàng mới</span>
            <strong className="kpi-value">{stats.pendingOrders} / {stats.totalOrders}</strong>
            <span className="kpi-trend warning">● Cần xử lý sớm</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box customers-icon">👥</div>
          <div className="kpi-data">
            <span className="kpi-label">Khách hàng</span>
            <strong className="kpi-value">{stats.totalCustomers}</strong>
            <span className="kpi-trend positive">100% người dùng thực</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box rooms-icon">🛋️</div>
          <div className="kpi-data">
            <span className="kpi-label">Phối cảnh 3D đã lưu</span>
            <strong className="kpi-value">{stats.totalSavedRooms}</strong>
            <span className="kpi-trend">Tương tác cao</span>
          </div>
        </div>
      </div>

      {/* 2. 3D Interaction Analytics & Popularity */}
      <div className="admin-charts-grid">
        {/* 3D Product Popularity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Món đồ 3D được xem nhiều nhất</h3>
              <p className="admin-card-subtitle">Thống kê tương tác trực tiếp trên Showroom Web3D</p>
            </div>
            <span className="badge-pill">3D Heatmap</span>
          </div>

          <div className="popularity-list">
            {stats.popularityStats.map((item) => (
              <div key={item.id} className="popularity-item">
                <div className="popularity-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-numbers">
                    <strong>{item.views.toLocaleString()}</strong> lượt xem • {item.ordersCount} đơn
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Material / Finish Share */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Chất liệu Sofa được chuộng nhất</h3>
              <p className="admin-card-subtitle">Tỷ lệ người dùng chuyển đổi vật liệu PBR</p>
            </div>
            <span className="badge-pill">Vật liệu PBR</span>
          </div>

          <div className="finish-share-list">
            {stats.finishPopularity.map((finish) => (
              <div key={finish.key} className="finish-share-item">
                <div className="finish-share-left">
                  <span
                    className="finish-swatch-dot"
                    style={{ backgroundColor: finish.colorHex }}
                  ></span>
                  <span className="finish-share-name">{finish.name}</span>
                </div>
                <div className="finish-share-right">
                  <div className="finish-progress-track">
                    <div
                      className="finish-progress-fill"
                      style={{ width: `${finish.share}%`, backgroundColor: finish.colorHex }}
                    ></div>
                  </div>
                  <strong className="finish-share-percent">{finish.share}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Quick Table */}
      <div className="admin-card recent-orders-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Đơn hàng mới nhất</h3>
            <p className="admin-card-subtitle">Các đơn hàng phát sinh từ trải nghiệm Showroom 3D</p>
          </div>
          <button
            className="secondary-btn mini-btn"
            onClick={() => setActiveTab('orders')}
          >
            Xem tất cả đơn hàng &rarr;
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Sản Phẩm & Cấu Hình 3D</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => {
                const statusMap = {
                  pending: { label: 'Chờ xác nhận', class: 'status-pending' },
                  processing: { label: 'Đang xử lý', class: 'status-processing' },
                  delivering: { label: 'Đang giao & Lắp đặt', class: 'status-delivering' },
                  completed: { label: 'Hoàn tất', class: 'status-completed' },
                  cancelled: { label: 'Đã hủy', class: 'status-cancelled' },
                };
                const st = statusMap[order.order_status] || statusMap.pending;

                return (
                  <tr key={order.id}>
                    <td>
                      <strong className="order-code-badge">{order.order_code}</strong>
                    </td>
                    <td>
                      <div className="table-customer-cell">
                        <strong>{order.customer_name}</strong>
                        <span>{order.customer_phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-items-cell">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it, idx) => (
                            <span key={idx} className="table-item-tag">
                              {it.product_name} {it.finish_name ? `(${it.finish_name})` : ''} x{it.quantity}
                            </span>
                          ))
                        ) : (
                          <span>1x Sofa Luna Curve Lounge</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong className="table-price">${order.total_amount?.toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`status-pill ${st.class}`}>{st.label}</span>
                    </td>
                    <td>
                      <button
                        className="admin-action-btn"
                        onClick={() => openOrderDetail(order)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
