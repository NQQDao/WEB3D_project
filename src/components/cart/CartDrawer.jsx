import React, { useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { useShowroomStore, hotspotsData } from '../../stores/useShowroomStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function CartDrawer({ engineRef }) {
  const [voucherInputText, setVoucherInputText] = useState('');
  const { isCartOpen, closeCart, openAuthModal, openCheckoutSuccess, addToast, setFinishKey } =
    useShowroomStore();
  const { items, appliedVoucher, updateQuantity, removeItem, applyVoucher, removeVoucher, clearCart } =
    useCartStore();
  const { isLoggedIn, user } = useAuthStore();

  if (!isCartOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountAmount = 0;

  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountAmount = (subtotal * appliedVoucher.discountPercent) / 100;
    } else if (appliedVoucher.discountAmount) {
      discountAmount = Math.min(subtotal, appliedVoucher.discountAmount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyVoucher = async () => {
    if (!voucherInputText.trim()) {
      addToast('Vui lòng nhập mã giảm giá!', 'warning', '⚠️');
      return;
    }
    const res = await applyVoucher(voucherInputText.trim());
    if (res.success) {
      addToast(`Áp dụng thành công mã ${res.voucher.code}!`, 'success', '🎉');
      setVoucherInputText('');
    } else {
      addToast(res.message, 'warning', '⚠️');
    }
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    addToast('Đã gỡ mã giảm giá', 'info', '🏷️');
  };

  const handleRestore3D = (item) => {
    closeCart();
    const product = hotspotsData.find((h) => h.id === item.productId);
    if (product && engineRef?.current) {
      engineRef.current.focusHotspot(product);
    }
    if (item.customization?.finishKey) {
      setFinishKey(item.customization.finishKey);
      if (engineRef?.current) {
        engineRef.current.applySofaFinish(item.customization.finishKey);
      }
    }
    const viewport = document.getElementById('showroom-viewport');
    if (viewport) {
      viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    addToast(`Đang hiển thị "${item.name}" trong không gian 3D`, 'info', '✨');
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!isLoggedIn()) {
      addToast('Vui lòng đăng nhập để hoàn tất đặt hàng!', 'warning', '🔒');
      openAuthModal('login');
      return;
    }

    const orderData = {
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
      totalFormatted: `$${finalTotal.toLocaleString()}`,
      items: [...items],
      date: new Date().toLocaleDateString('vi-VN'),
    };

    openCheckoutSuccess(orderData);
    clearCart();
    addToast('Đặt hàng thành công! Haven & Home sẽ liên hệ bạn trong 2 giờ.', 'success', '🎉');
  };

  return (
    <div className="cart-drawer-wrapper active">
      <div className="cart-backdrop" onClick={closeCart}></div>
      <aside className="cart-drawer-panel">
        <div className="cart-header">
          <div className="cart-title-row">
            <h3 className="cart-heading">Giỏ hàng của bạn</h3>
            <span className="cart-items-badge">
              {items.reduce((acc, i) => acc + i.quantity, 0)} sản phẩm
            </span>
          </div>
          <button className="drawer-close-btn" onClick={closeCart} aria-label="Đóng giỏ hàng">
            &times;
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon">🛋️</div>
              <h4>Giỏ hàng đang trống</h4>
              <p>Khám phá phòng khách 3D và thêm món đồ yêu thích với màu sắc tùy chỉnh nhé!</p>
              <button
                className="primary-btn mini-btn"
                onClick={() => {
                  closeCart();
                  document.getElementById('showroom-viewport')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                Khám phá 3D ngay
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-info">
                    <div className="cart-item-header">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        className="btn-delete-cart-item"
                        onClick={() => {
                          removeItem(item.id);
                          addToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info', '🗑️');
                        }}
                        title="Xóa sản phẩm"
                      >
                        &times;
                      </button>
                    </div>

                    {item.customization && (
                      <div className="cart-item-customization">
                        <span
                          className="cart-swatch-preview"
                          style={{ backgroundColor: item.customization.swatchColor }}
                        ></span>
                        <span>{item.customization.finishName}</span>
                      </div>
                    )}

                    <div className="cart-item-footer">
                      <span className="cart-item-price">${(item.price * item.quantity).toLocaleString()}</span>
                      <div className="cart-qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="btn-restore-3d"
                      onClick={() => handleRestore3D(item)}
                    >
                      <span>🔄 Xem lại trong 3D</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chân giỏ hàng & Thanh toán */}
        {items.length > 0 && (
          <div className="cart-footer">
            {/* Voucher Box */}
            <div className="voucher-box">
              <div className="voucher-input-group">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi (Thử: HAVEN10)"
                  value={voucherInputText}
                  onChange={(e) => setVoucherInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyVoucher();
                  }}
                />
                <button onClick={handleApplyVoucher}>Áp dụng</button>
              </div>

              {appliedVoucher && (
                <div className="voucher-applied-info">
                  <span className="voucher-badge">
                    {appliedVoucher.code} ({appliedVoucher.discountPercent ? `-${appliedVoucher.discountPercent}%` : `-$${appliedVoucher.discountAmount}`})
                  </span>
                  <button className="btn-remove-voucher" onClick={handleRemoveVoucher}>
                    Gỡ bỏ
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="summary-line">
                <span>Tạm tính</span>
                <strong>${subtotal.toLocaleString()}</strong>
              </div>

              {appliedVoucher && discountAmount > 0 && (
                <div className="summary-line line-discount">
                  <span>Giảm giá</span>
                  <strong>-${discountAmount.toLocaleString()}</strong>
                </div>
              )}

              <div className="summary-line">
                <span>Vận chuyển & Lắp đặt</span>
                <span className="text-success">Miễn phí toàn quốc</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-line total-line">
                <span>Tổng thanh toán</span>
                <strong className="total-price">${finalTotal.toLocaleString()}</strong>
              </div>
            </div>

            <button className="primary-btn checkout-btn" onClick={handleCheckout}>
              <span>Tiến hành đặt hàng</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
