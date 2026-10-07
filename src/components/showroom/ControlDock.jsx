import React from 'react';
import { useShowroomStore, sofaFinishes } from '../../stores/useShowroomStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function ControlDock({ onSaveRoom, onToggleFullscreen }) {
  const {
    currentFinishKey,
    setFinishKey,
    currentLightingMode,
    setLightingMode,
    currentCameraPreset,
    setCameraPreset,
    isLampOn,
    toggleLamp,
    showDimensions,
    toggleDimensions,
    autoRotate,
    toggleAutoRotate,
  } = useShowroomStore();

  const activeFinish = sofaFinishes[currentFinishKey] || sofaFinishes.cream;

  return (
    <div className="control-dock">
      {/* Nhóm 1: Góc nhìn Camera */}
      <div className="dock-group">
        <span className="dock-title">Góc nhìn</span>
        <div className="btn-group">
          <button
            className={`dock-btn ${currentCameraPreset === 'overview' ? 'active' : ''}`}
            onClick={() => setCameraPreset('overview')}
            title="Toàn cảnh phòng"
          >
            <span className="dock-icon">🏠</span>
            <span className="dock-text">Toàn cảnh</span>
          </button>
          <button
            className={`dock-btn ${currentCameraPreset === 'sofa' ? 'active' : ''}`}
            onClick={() => setCameraPreset('sofa')}
            title="Cận cảnh sofa Luna"
          >
            <span className="dock-icon">🛋️</span>
            <span className="dock-text">Sofa</span>
          </button>
          <button
            className={`dock-btn ${currentCameraPreset === 'lounge' ? 'active' : ''}`}
            onClick={() => setCameraPreset('lounge')}
            title="Góc thư giãn & Bàn trà"
          >
            <span className="dock-icon">🪑</span>
            <span className="dock-text">Thư giãn</span>
          </button>
          <button
            className={`dock-btn ${currentCameraPreset === 'topdown' ? 'active' : ''}`}
            onClick={() => setCameraPreset('topdown')}
            title="Góc nhìn mặt bằng kiến trúc"
          >
            <span className="dock-icon">📐</span>
            <span className="dock-text">Mặt bằng</span>
          </button>
        </div>
      </div>

      <div className="dock-divider"></div>

      {/* Nhóm 2: Tùy biến Màu sắc & Chất liệu Sofa */}
      <div className="dock-group">
        <div className="dock-title-row">
          <span className="dock-title">Chất liệu Sofa</span>
          <span className="finish-highlight">{activeFinish.name}</span>
        </div>
        <div className="swatch-group">
          {Object.entries(sofaFinishes).map(([key, item]) => (
            <button
              key={key}
              className={`swatch-btn ${currentFinishKey === key ? 'active' : ''}`}
              onClick={() => setFinishKey(key)}
              title={item.name}
              style={{ '--swatch-color': item.colorHex }}
            />
          ))}
        </div>
      </div>

      <div className="dock-divider"></div>

      {/* Nhóm 3: Ánh sáng */}
      <div className="dock-group">
        <span className="dock-title">Ánh sáng</span>
        <div className="btn-group">
          <button
            className={`dock-btn ${currentLightingMode === 'day' ? 'active' : ''}`}
            onClick={() => setLightingMode('day')}
            title="Ánh sáng tự nhiên ban ngày"
          >
            <span className="dock-icon">☀️</span>
            <span className="dock-text">Ngày</span>
          </button>
          <button
            className={`dock-btn ${currentLightingMode === 'sunset' ? 'active' : ''}`}
            onClick={() => setLightingMode('sunset')}
            title="Ánh hoàng hôn ấm áp"
          >
            <span className="dock-icon">🌅</span>
            <span className="dock-text">Hoàng hôn</span>
          </button>
          <button
            className={`dock-btn ${currentLightingMode === 'night' ? 'active' : ''}`}
            onClick={() => setLightingMode('night')}
            title="Ánh đèn ấm cúng ban đêm"
          >
            <span className="dock-icon">🌙</span>
            <span className="dock-text">Đêm</span>
          </button>
        </div>
      </div>

      <div className="dock-divider"></div>

      {/* Nhóm 4: Công cụ tiện ích */}
      <div className="dock-group">
        <span className="dock-title">Tiện ích</span>
        <div className="icon-tools">
          <button
            className={`tool-btn ${showDimensions ? 'active' : ''}`}
            onClick={toggleDimensions}
            title="Bật/Tắt thước đo 3D kích thước thực"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 3H3v18h18V3zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
            </svg>
            <span>Thước đo</span>
          </button>
          <button
            className={`tool-btn ${autoRotate ? 'active' : ''}`}
            onClick={toggleAutoRotate}
            title="Tự động xoay 360°"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Tự xoay</span>
          </button>
          <button
            className={`tool-btn ${isLampOn ? 'active' : ''}`}
            onClick={toggleLamp}
            title="Bật/Tắt bóng đèn cây Halo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
            </svg>
            <span>Đèn cây</span>
          </button>
          <button
            className="tool-btn"
            onClick={onSaveRoom}
            title="Lưu góc phối cảnh 3D vào tài khoản"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Lưu phòng</span>
          </button>
          <button
            className="tool-btn"
            onClick={onToggleFullscreen}
            title="Toàn màn hình không gian 3D"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <span>Phóng to</span>
          </button>
        </div>
      </div>
    </div>
  );
}
