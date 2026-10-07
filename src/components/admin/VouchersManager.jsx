import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function VouchersManager() {
  const {
    vouchers,
    fetchVouchers,
    createVoucher,
    toggleVoucher,
    deleteVoucher,
    isCreateVoucherModalOpen,
    openCreateVoucherModal,
    closeCreateVoucherModal,
  } = useAdminStore();

  const { addToast } = useShowroomStore();

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percent'); // 'percent' | 'fixed'
  const [discountValue, setDiscountValue] = useState(10);
  const [description, setDescription] = useState('');
  const [maxUses, setMaxUses] = useState(50);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const voucherData = {
      code: code.trim().toUpperCase(),
      discountPercent: discountType === 'percent' ? parseFloat(discountValue) : 0,
      discountAmount: discountType === 'fixed' ? parseFloat(discountValue) : 0,
      description: description || `Mã giảm giá ${code.toUpperCase()}`,
      maxUses: parseInt(maxUses, 10) || null,
    };

    const res = await createVoucher(voucherData);
    if (res.success) {
      addToast(`Đã tạo thành công mã giảm giá ${voucherData.code}!`, 'success', '🏷️');
      setCode('');
      setDescription('');
    } else {
      addToast(res.message, 'warning', '⚠️');
    }
  };

  const handleToggle = (vCode) => {
    toggleVoucher(vCode);
    addToast(`Đã thay đổi trạng thái mã ${vCode}`, 'info', '⚡');
  };

  const handleDelete = (vCode) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã ${vCode}?`)) {
      deleteVoucher(vCode);
      addToast(`Đã xóa mã voucher ${vCode}`, 'info', '🗑️');
    }
  };

  return (
    <div className="admin-vouchers-view">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Quản Lý Mã Khuyến Mãi (Voucher)</h2>
          <p className="admin-page-desc">
            Tạo và kiểm soát các mã giảm giá áp dụng trực tiếp trong giỏ hàng 3D của khách.
          </p>
        </div>

        <button className="primary-btn" onClick={openCreateVoucherModal}>
          <span>+ Tạo mã voucher mới</span>
        </button>
      </div>

      {/* Vouchers Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Voucher</th>
                <th>Mức Giảm</th>
                <th>Mô Tả Áp Dụng</th>
                <th>Lượt Dùng</th>
                <th>Hiệu Lực</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.code}>
                  <td>
                    <div className="voucher-code-pill">
                      <strong>{v.code}</strong>
                    </div>
                  </td>
                  <td>
                    <strong className="voucher-discount-val">
                      {v.discount_percent > 0
                        ? `Giảm ${v.discount_percent}%`
                        : `Giảm $${v.discount_amount}`}
                    </strong>
                  </td>
                  <td>
                    <span className="voucher-desc-text">{v.description}</span>
                  </td>
                  <td>
                    <span className="voucher-usage-text">
                      {v.used_count || 0} / {v.max_uses || '∞'} lượt
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-switch-btn ${v.is_active ? 'active' : ''}`}
                      onClick={() => handleToggle(v.code)}
                      title="Bật/Tắt hiệu lực"
                    >
                      {v.is_active ? '🟢 Đang hoạt động' : '⚪ Đã tạm dừng'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-delete-voucher"
                      onClick={() => handleDelete(v.code)}
                      title="Xóa mã"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {isCreateVoucherModalOpen && (
        <div className="admin-modal-wrapper active">
          <div className="admin-modal-backdrop" onClick={closeCreateVoucherModal}></div>
          <div className="admin-modal-card">
            <button className="modal-close" onClick={closeCreateVoucherModal}>
              &times;
            </button>

            <div className="modal-header">
              <span className="modal-category">TẠO MÃ KHUYẾN MÃI MỚI</span>
              <h3 className="modal-title">Thêm Voucher Showroom 3D</h3>
            </div>

            <form className="auth-form" onSubmit={handleCreateVoucher}>
              <div className="form-group">
                <label>Mã Voucher (Code)</label>
                <input
                  type="text"
                  placeholder="VD: LUXURY20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Loại giảm giá</label>
                  <select
                    className="admin-select-input"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                  >
                    <option value="percent">Giảm theo Phần Trăm (%)</option>
                    <option value="fixed">Giảm Số Tiền Cố Định ($)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Giá trị giảm {discountType === 'percent' ? '(%)' : '($)'}</label>
                  <input
                    type="number"
                    min={1}
                    max={discountType === 'percent' ? 100 : 5000}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Số lượt sử dụng tối đa</label>
                <input
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả hiển thị cho khách hàng</label>
                <input
                  type="text"
                  placeholder="VD: Giảm 20% đơn hàng khi mua Sofa Luna"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="primary-btn auth-submit-btn">
                Kích hoạt mã voucher ngay
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
