import React from 'react';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function CheckoutModal() {
  const { isCheckoutSuccessOpen, closeCheckoutSuccess, lastOrderData } = useShowroomStore();

  if (!isCheckoutSuccessOpen || !lastOrderData) return null;

  return (
    <div className="checkout-modal-wrapper active">
      <div className="checkout-backdrop" onClick={closeCheckoutSuccess}></div>
      <div className="checkout-card">
        <div className="success-icon">🎉</div>
        <h3 className="checkout-title">Đặt hàng thành công!</h3>
        <p className="checkout-msg">
          Cảm ơn bạn đã lựa chọn Haven & Home. Đơn hàng của bạn đã được ghi nhận cùng thông số cấu hình 3D tùy biến.
        </p>

        <div className="checkout-summary-box">
          <div className="checkout-summary-row">
            <span>Số lượng sản phẩm:</span>
            <strong>{lastOrderData.itemCount} món</strong>
          </div>
          <div className="checkout-summary-row">
            <span>Tổng thanh toán:</span>
            <strong className="text-primary">{lastOrderData.totalFormatted}</strong>
          </div>
          <div className="checkout-summary-row">
            <span>Phương thức:</span>
            <span>Thanh toán khi nhận hàng & Lắp đặt</span>
          </div>
          <div className="checkout-summary-row">
            <span>Giao hàng:</span>
            <span>Miễn phí 48h (Kỹ thuật viên bàn giao & cân chỉnh)</span>
          </div>
        </div>

        <button className="primary-btn" onClick={closeCheckoutSuccess}>
          Hoàn tất & Tiếp tục trải nghiệm
        </button>
      </div>
    </div>
  );
}
