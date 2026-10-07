import React from 'react';
import { useShowroomStore, sofaFinishes } from '../../stores/useShowroomStore';
import { useCartStore } from '../../stores/useCartStore';

export default function ProductModal() {
  const {
    selectedProduct,
    isProductModalOpen,
    closeProductModal,
    currentFinishKey,
    openCart,
    addToast,
  } = useShowroomStore();
  const { addItem } = useCartStore();

  if (!isProductModalOpen || !selectedProduct) return null;

  const currentSofaFinish = selectedProduct.id === 'hotspot-sofa' ? sofaFinishes[currentFinishKey] : null;

  const handleAddToCart = () => {
    let finish = null;
    if (selectedProduct.id === 'hotspot-sofa') {
      const sf = sofaFinishes[currentFinishKey];
      if (sf) {
        finish = {
          key: currentFinishKey,
          name: sf.name,
          colorHex: sf.colorHex,
        };
      }
    }

    addItem(selectedProduct, finish);
    addToast(`Đã thêm "${selectedProduct.name}" vào giỏ hàng!`, 'success', '🛒');
    closeProductModal();
    openCart();
  };

  return (
    <div className={`product-modal ${isProductModalOpen ? 'active' : ''}`}>
      <div className="modal-card">
        <button className="modal-close" onClick={closeProductModal} aria-label="Đóng bảng chi tiết">
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-eyebrow-row">
            <span className="modal-category">{selectedProduct.category}</span>
            <span className="modal-pbr-badge">PBR 1:1 SCALE</span>
          </div>
          <h3 className="modal-title">{selectedProduct.name}</h3>
          <div className="modal-price-row">
            <span className="modal-price">{selectedProduct.price}</span>
            <span className="modal-stock">● Sẵn hàng bàn giao 48h</span>
          </div>
        </div>

        {/* Selected Finish Preview (For Sofa) */}
        {currentSofaFinish && (
          <div className="modal-current-finish-card">
            <div className="finish-card-head">
              <span className="finish-head-label">Chất liệu bọc đang chọn:</span>
              <strong className="finish-head-val">{currentSofaFinish.name}</strong>
            </div>
            <div className="finish-card-swatch-row">
              <span
                className="finish-swatch-circle"
                style={{ backgroundColor: currentSofaFinish.colorHex }}
              ></span>
              <p className="finish-swatch-desc">{currentSofaFinish.description}</p>
            </div>
          </div>
        )}

        <p className="modal-desc">{selectedProduct.description}</p>

        {selectedProduct.specs && (
          <div className="modal-specs-list">
            {Object.entries(selectedProduct.specs).map(([key, val]) => (
              <div key={key} className="spec-row">
                <span className="spec-label">{key}</span>
                <span className="spec-val">{val}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-buy-btn" onClick={handleAddToCart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button
            className="modal-ar-btn"
            onClick={() => addToast('Mô phỏng AR: Hướng camera điện thoại vào phòng để ướm thử tỷ lệ 1:1!', 'info', '📱')}
          >
            📱 Xem AR trong phòng
          </button>
        </div>
      </div>
    </div>
  );
}
