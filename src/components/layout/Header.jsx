import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function Header() {
  const { user, isLoggedIn, logout, savedRooms } = useAuthStore();
  const { items } = useCartStore();
  const { openCart, openAuthModal, openSavedRooms, addToast, setView } = useShowroomStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    addToast('Đã đăng xuất tài khoản.', 'info', '👋');
  };

  return (
    <header className="topbar">
      <a href="#" className="brand">
        <span className="brand-mark">H</span>
        <div className="brand-text">
          <span className="brand-name">Haven & Home</span>
          <span className="brand-sub">3D Interior Studio</span>
        </div>
      </a>

      <nav className="nav" aria-label="Menu chính">
        <a href="#showroom-section" className="active">Phòng Mẫu 3D</a>
        <a href="#collection-section">Bộ Sưu Tập</a>
        <a href="#features-section">Vật Liệu & Công Nghệ</a>
        <a href="#about-section">Về Chúng Tôi</a>
      </nav>

      <div className="header-actions">
        {/* Nút Chuyển Trang Quản Trị Admin */}
        <button
          className="admin-switch-btn"
          onClick={() => setView('admin')}
          title="Chuyển sang Bảng Quản Trị Admin Dashboard"
        >
          <span>⚙️ Quản Trị</span>
        </button>

        {/* User Auth Section */}
        <div className="user-auth-wrapper" ref={dropdownRef}>
          {!isLoggedIn() ? (
            <button
              className="nav-auth-btn"
              onClick={() => openAuthModal('login')}
              title="Đăng nhập hoặc đăng ký"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Đăng nhập</span>
            </button>
          ) : (
            <div className="user-profile-menu">
              <button
                className="profile-trigger-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                <img src={user.avatar} alt="Avatar" className="user-avatar-img" />
                <span className="user-display-name">{user.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div className={`profile-dropdown-content ${isDropdownOpen ? 'active' : ''}`}>
                <div className="dropdown-header">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSavedRooms();
                  }}
                >
                  <span>📁 Không gian 3D đã lưu</span>
                  <span className="badge-mini">{savedRooms.length}</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setView('admin');
                  }}
                >
                  <span>⚙️ Bảng Quản Trị Admin</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <span>🚪 Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Pill */}
        <button className="cart-pill" onClick={openCart} aria-label="Mở giỏ hàng">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="cart-label">Giỏ hàng</span>
          <span className="cart-count bump" key={totalItemsCount}>
            {totalItemsCount}
          </span>
        </button>
      </div>
    </header>
  );
}
