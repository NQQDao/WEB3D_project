import React, { useState } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function ProductsManager() {
  const {
    products,
    selectedProductForEdit,
    isProductEditModalOpen,
    openProductEditModal,
    closeProductEditModal,
    updateProduct,
  } = useAdminStore();

  const { addToast } = useShowroomStore();

  const [editPrice, setEditPrice] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStockStatus, setEditStockStatus] = useState('in_stock');

  const handleOpenEdit = (product) => {
    openProductEditModal(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDesc(product.description);
    setEditStockStatus('in_stock');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedProductForEdit) return;

    updateProduct(selectedProductForEdit.id, {
      name: editName,
      price: editPrice.startsWith('$') ? editPrice : `$${editPrice}`,
      description: editDesc,
      stockStatus: editStockStatus,
    });

    addToast(`Đã lưu cập nhật cho sản phẩm "${editName}"!`, 'success', '🛋️');
  };

  return (
    <div className="admin-products-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản Lý Sản Phẩm & Bảng Giá</h2>
          <p className="admin-page-desc">
            Cập nhật giá bán, mô tả, tình trạng kho và thông số kỹ thuật cho các món đồ nội thất 3D.
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="admin-products-grid">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
            <div className="product-card-top">
              <span className="product-category-tag">{product.category}</span>
              <span className="product-status-pill in-stock">● Sẵn hàng</span>
            </div>

            <h3 className="product-card-name">{product.name}</h3>
            <p className="product-card-desc">{product.description}</p>

            <div className="product-specs-box">
              {product.specs &&
                Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="product-spec-line">
                    <span>{k}:</span>
                    <strong>{v}</strong>
                  </div>
                ))}
            </div>

            <div className="product-card-bottom">
              <div className="product-price-group">
                <span className="price-label">Giá niêm yết:</span>
                <strong className="product-price-val">{product.price}</strong>
              </div>

              <button
                className="primary-btn mini-btn"
                onClick={() => handleOpenEdit(product)}
              >
                ✏️ Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Edit Modal */}
      {isProductEditModalOpen && selectedProductForEdit && (
        <div className="admin-modal-wrapper active">
          <div className="admin-modal-backdrop" onClick={closeProductEditModal}></div>
          <div className="admin-modal-card">
            <button className="modal-close" onClick={closeProductEditModal}>
              &times;
            </button>

            <div className="modal-header">
              <span className="modal-category">CHỈNH SỬA SẢN PHẨM 3D</span>
              <h3 className="modal-title">{selectedProductForEdit.name}</h3>
            </div>

            <form className="auth-form" onSubmit={handleSave}>
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá bán niêm yết (USD)</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="$1,499"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tình trạng kho hàng</label>
                <select
                  className="admin-select-input"
                  value={editStockStatus}
                  onChange={(e) => setEditStockStatus(e.target.value)}
                >
                  <option value="in_stock">🟢 Sẵn hàng giao trong 48h</option>
                  <option value="pre_order">🟡 Đặt hàng sản xuất riêng (7-10 ngày)</option>
                  <option value="out_of_stock">🔴 Tạm hết hàng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="primary-btn auth-submit-btn">
                Lưu thay đổi bảng giá & thông số
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
