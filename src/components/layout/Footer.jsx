import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" id="about-section">
      <div className="footer-top">
        <div class="footer-brand">
          <div className="brand">
            <span className="brand-mark">H</span>
            <span className="brand-name">Haven & Home</span>
          </div>
          <p className="footer-tagline">
            Nâng tầm phong cách sống với nội thất thiết kế đương đại và trải nghiệm số hóa 3D tiên phong trên React.js & Cloud PostgreSQL.
          </p>
        </div>
        <div className="footer-links">
          <div className="link-col">
            <h5>Bộ Sưu Tập</h5>
            <a href="#collection-section">Phòng khách</a>
            <a href="#collection-section">Phòng ngủ</a>
            <a href="#collection-section">Phòng ăn</a>
            <a href="#collection-section">Đèn & Decor</a>
          </div>
          <div className="link-col">
            <h5>Dịch Vụ</h5>
            <a href="#showroom-section">Tư vấn thiết kế 3D</a>
            <a href="#showroom-section">Tùy chỉnh chất liệu PBR</a>
            <a href="#showroom-section">Giao hàng & Lắp đặt 48h</a>
            <a href="#showroom-section">Bảo hành 10 năm</a>
          </div>
          <div className="link-col">
            <h5>Liên Hệ</h5>
            <span>Hotline: 1900 8888</span>
            <span>Email: studio@havenhome.vn</span>
            <span>Showroom: 88 Đồng Khởi, Q.1, TP.HCM</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Haven & Home Design Studio. All rights reserved. Web3D Engine powered by Three.js & React 19.</p>
      </div>
    </footer>
  );
}
