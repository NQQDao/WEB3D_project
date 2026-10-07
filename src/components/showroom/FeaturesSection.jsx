import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="features-section" id="features-section">
      <div className="features-grid">
        <div className="feature-item">
          <div className="feat-icon">💎</div>
          <h4>Vật Liệu PBR Thực Tế</h4>
          <p>Tái hiện chính xác độ nhám (roughness), độ phản xạ ánh kim và vân thớ gỗ như nhìn tận mắt tại xưởng.</p>
        </div>
        <div className="feature-item">
          <div className="feat-icon">📐</div>
          <h4>Tỷ Lệ Kiến Trúc Chuẩn</h4>
          <p>Mọi món đồ được dựng theo tỷ lệ kích thước thực tế (cm), giúp bạn an tâm khi bài trí vào không gian nhà bạn.</p>
        </div>
        <div className="feature-item">
          <div className="feat-icon">🌿</div>
          <h4>Sản Xuất Bền Vững</h4>
          <p>100% gỗ rừng trồng có chứng chỉ FSC, vải dệt thân thiện không hóa chất độc hại, bảo vệ sức khỏe gia đình.</p>
        </div>
        <div className="feature-item">
          <div className="feat-icon">⚡</div>
          <h4>Tải Nhanh 60 FPS</h4>
          <p>Tối ưu hóa hình học Procedural siêu nhẹ, tương thích mượt mà trên cả máy tính lẫn điện thoại thông minh.</p>
        </div>
      </div>
    </section>
  );
}
