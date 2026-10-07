import React, { useRef } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ShowroomViewport from './components/showroom/ShowroomViewport';
import CatalogSection from './components/showroom/CatalogSection';
import FeaturesSection from './components/showroom/FeaturesSection';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/cart/CheckoutModal';
import AuthModal from './components/auth/AuthModal';
import SavedRoomsModal from './components/auth/SavedRoomsModal';
import ToastContainer from './components/common/ToastContainer';
import AdminLayout from './components/admin/AdminLayout';
import { useShowroomStore } from './stores/useShowroomStore';

export default function App() {
  const engineRef = useRef(null);
  const { setCameraPreset, currentView } = useShowroomStore();

  const handleQuickTourSofa = () => {
    setCameraPreset('sofa');
    if (engineRef.current) {
      engineRef.current.setCameraView('sofa');
    }
    const viewport = document.getElementById('showroom-viewport');
    if (viewport) {
      viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // If in Admin Mode, render full-screen Admin Dashboard
  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
      </>
    );
  }

  // Otherwise render the 3D Showroom Customer Experience
  return (
    <div className="page-shell">
      {/* Glow Trang Trí Nền */}
      <div className="bg-glow glow-one"></div>
      <div className="bg-glow glow-two"></div>

      {/* Header Điều Hướng */}
      <Header />

      {/* Main Hero: Không Gian Nội Thất 3D Trực Quan */}
      <main className="hero" id="showroom-section">
        {/* Cột Trái: Giới Thiệu & Thông Điệp Sản Phẩm */}
        <section className="hero-copy">
          <div className="badge-tag">
            <span className="status-indicator"></span>
            PHÒNG KHÁCH MẪU CHUẨN CHỈ • WEB3D REALTIME
          </div>

          <h1 className="hero-heading">
            Kiến tạo không gian sống <em>chuẩn mực</em> & thanh lịch.
          </h1>

          <p className="lede">
            Trải nghiệm phối cảnh nội thất tương tác thời gian thực. Tự do xoay 360°,
            thay đổi chất liệu vải nỉ Bouclé hay da bò tự nhiên, và quan sát ánh sáng thực
            tế từ bình minh rạng rỡ tới hoàng hôn ấm cúng.
          </p>

          <div className="usp-tags">
            <span className="usp-item">✨ Chuẩn vật liệu PBR</span>
            <span className="usp-item">🎯 Xoay 360° tự do</span>
            <span className="usp-item">📐 Thước đo 3D tỷ lệ 1:1</span>
            <span className="usp-item">💡 3 kịch bản ánh sáng</span>
            <span className="usp-item">🛒 Lưu cấu hình 3D vào giỏ</span>
          </div>

          <div className="cta-row">
            <a href="#collection-section" className="primary-btn">
              Khám phá bộ sưu tập
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <button className="secondary-btn" onClick={handleQuickTourSofa}>
              🔍 Xem cận cảnh Sofa
            </button>
          </div>

          {/* Thông số uy tín */}
          <div className="stats-grid">
            <div className="stat-card">
              <strong>1.200+</strong>
              <span>Không gian bàn giao</span>
            </div>
            <div className="stat-card">
              <strong>4.95 / 5</strong>
              <span>Khách hàng hài lòng</span>
            </div>
            <div className="stat-card">
              <strong>10 Năm</strong>
              <span>Bảo hành khung kết cấu</span>
            </div>
          </div>
        </section>

        {/* Cột Phải: Khung Nhìn 3D Viewport */}
        <ShowroomViewport engineRef={engineRef} />
      </main>

      {/* Danh Mục Sản Phẩm Tương Tác Đồng Bộ Cảnh 3D */}
      <CatalogSection engineRef={engineRef} />

      {/* Khối Giới Thiệu Công Nghệ & Tiêu Chuẩn Sản Phẩm */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer engineRef={engineRef} />
      <AuthModal />
      <SavedRoomsModal engineRef={engineRef} />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
}
