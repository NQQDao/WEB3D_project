import React from 'react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useShowroomStore } from '../../stores/useShowroomStore';
import DashboardOverview from './DashboardOverview';
import OrdersManager from './OrdersManager';
import ProductsManager from './ProductsManager';
import VouchersManager from './VouchersManager';
import CustomersManager from './CustomersManager';

export default function AdminLayout() {
  const { activeTab, setActiveTab } = useAdminStore();
  const { setView } = useShowroomStore();

  const navItems = [
    { id: 'overview', label: 'Tổng Quan KPI', icon: '📊' },
    { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: '📦' },
    { id: 'products', label: 'Sản Phẩm & Bảng Giá', icon: '🛋️' },
    { id: 'vouchers', label: 'Mã Khuyến Mãi', icon: '🏷️' },
    { id: 'customers', label: 'Khách Hàng (CRM)', icon: '👥' },
  ];

  return (
    <div className="admin-app-container">
      {/* 1. Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand-box">
          <span className="brand-mark sm">H</span>
          <div className="admin-brand-info">
            <span className="admin-brand-name">Haven & Home</span>
            <span className="admin-badge-tag">ADMIN STUDIO</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="btn-back-showroom"
            onClick={() => setView('showroom')}
          >
            <span>👁️ Trở về Showroom 3D</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="admin-main-content">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-current-title">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="admin-topbar-right">
            <button
              className="quick-showroom-switch-btn"
              onClick={() => setView('showroom')}
            >
              <span>👁️ Xem Showroom 3D</span>
            </button>

            <div className="admin-profile-pill">
              <span className="admin-avatar">A</span>
              <div className="admin-profile-text">
                <strong>Admin Studio</strong>
                <span>Quản trị viên</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="admin-body-container">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'vouchers' && <VouchersManager />}
          {activeTab === 'customers' && <CustomersManager />}
        </div>
      </main>
    </div>
  );
}
