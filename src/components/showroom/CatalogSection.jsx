import React from 'react';
import { useShowroomStore, hotspotsData } from '../../stores/useShowroomStore';

export default function CatalogSection({ engineRef }) {
  const { setSelectedProduct } = useShowroomStore();

  const handleCardClick = (item) => {
    if (engineRef && engineRef.current) {
      engineRef.current.focusHotspot(item);
    }
    setSelectedProduct(item);
    const viewport = document.getElementById('showroom-viewport');
    if (viewport) {
      viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const catalogItems = [
    {
      hotspotId: 'hotspot-sofa',
      tag: 'Bestseller',
      thumbClass: 'sofa-thumb',
      type: 'Sofa 3 Chỗ',
      name: 'Luna Curve Lounge',
      summary: 'Vải Bouclé cao cấp nhập khẩu, bo cong tinh tế.',
      price: '$1,499',
    },
    {
      hotspotId: 'hotspot-table',
      tag: 'Điêu Khắc',
      thumbClass: 'table-thumb',
      type: 'Bàn Trà',
      name: 'Arlo Fluted Table',
      summary: 'Mặt đá Calacatta tự nhiên, chân gân sọc gỗ sồi.',
      price: '$480',
    },
    {
      hotspotId: 'hotspot-lamp',
      tag: 'Đồng Thau',
      thumbClass: 'lamp-thumb',
      type: 'Đèn Sàn',
      name: 'Halo Arc Brass',
      summary: 'Cần vòm uốn nghệ thuật, ánh sáng vàng ấm 2700K.',
      price: '$320',
    },
    {
      hotspotId: 'hotspot-chair',
      tag: 'Nordic',
      thumbClass: 'chair-thumb',
      type: 'Ghế Tựa Đơn',
      name: 'Terra Nordic Chair',
      summary: 'Công thái học ôm lưng, đệm nỉ cao cấp êm dịu.',
      price: '$590',
    },
  ];

  return (
    <section className="catalog-section" id="collection-section">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">BỘ SƯU TẬP PHÒNG KHÁCH</span>
          <h2 className="section-title">Chọn đồ nội thất để tương tác trực tiếp</h2>
        </div>
        <p className="section-desc">
          Bấm vào bất kỳ món đồ nào bên dưới, góc máy 3D sẽ tự động di chuyển đến tâm điểm sản phẩm tương ứng trong phòng mẫu.
        </p>
      </div>

      <div className="catalog-grid">
        {catalogItems.map((item) => {
          const matchedHotspot = hotspotsData.find((h) => h.id === item.hotspotId);
          return (
            <div
              key={item.hotspotId}
              className="catalog-card"
              onClick={() => handleCardClick(matchedHotspot || item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(matchedHotspot || item);
                }
              }}
            >
              <div className="card-tag">{item.tag}</div>
              <div className={`catalog-thumb ${item.thumbClass}`}>
                <div className="thumb-badge">3D Focus</div>
              </div>
              <div className="catalog-info">
                <div className="cat-type">{item.type}</div>
                <h3 className="cat-name">{item.name}</h3>
                <p className="cat-summary">{item.summary}</p>
                <div className="cat-footer">
                  <span className="cat-price">{item.price}</span>
                  <span className="cat-link">Xem 3D &rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
