import React, { useEffect } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';

export default function CustomersManager() {
  const { customers, fetchCustomers } = useAdminStore();

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="admin-customers-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản Lý Khách Hàng (CRM)</h2>
          <p className="admin-page-desc">
            Danh sách khách hàng đã đăng ký, số lượng không gian 3D đã lưu và lịch sử chi tiêu.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>Email Liên Hệ</th>
                <th>Ngày Tham Gia</th>
                <th>Phòng 3D Đã Lưu</th>
                <th>Đơn Hàng</th>
                <th>Tổng Chi Tiêu</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="customer-avatar-cell">
                      <div className="customer-avatar-badge">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="customer-email-text">{c.email}</span>
                  </td>
                  <td>
                    <span className="customer-date-text">
                      {new Date(c.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td>
                    <span className="saved-rooms-badge">
                      🛋️ {c.saved_rooms_count || 0} phòng
                    </span>
                  </td>
                  <td>
                    <span className="customer-orders-count">
                      {c.total_orders_count || 0} đơn
                    </span>
                  </td>
                  <td>
                    <strong className="customer-spent-val">
                      ${(c.total_spent || 0).toLocaleString()}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
