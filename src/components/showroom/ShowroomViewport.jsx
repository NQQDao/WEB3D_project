import React, { useEffect, useRef, useState } from 'react';
import { ShowroomEngine } from '../../engine/threeEngine';
import { useShowroomStore, sofaFinishes, hotspotsData } from '../../stores/useShowroomStore';
import { useAuthStore } from '../../stores/useAuthStore';
import HotspotsOverlay from './HotspotsOverlay';
import ControlDock from './ControlDock';
import ProductModal from './ProductModal';

export default function ShowroomViewport({ engineRef }) {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const [engineInstance, setEngineInstance] = useState(null);
  const [projectedHotspots, setProjectedHotspots] = useState([]);

  const {
    currentFinishKey,
    currentLightingMode,
    currentCameraPreset,
    isLampOn,
    showDimensions,
    autoRotate,
    setSelectedProduct,
    openAuthModal,
    addToast,
  } = useShowroomStore();

  const { isLoggedIn, saveCurrentRoom } = useAuthStore();

  // 1. Mount Three.js Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new ShowroomEngine(containerRef.current, (hotspots) => {
      setProjectedHotspots(hotspots);
    });

    setEngineInstance(engine);
    if (engineRef) engineRef.current = engine;

    return () => {
      engine.dispose();
      if (engineRef) engineRef.current = null;
    };
  }, []);

  // 2. React to Finish changes
  useEffect(() => {
    if (engineInstance) {
      engineInstance.applySofaFinish(currentFinishKey);
    }
  }, [currentFinishKey, engineInstance]);

  // 3. React to Lighting changes
  useEffect(() => {
    if (engineInstance) {
      engineInstance.setLightingMode(currentLightingMode);
    }
  }, [currentLightingMode, engineInstance]);

  // 4. React to Camera Preset changes
  useEffect(() => {
    if (engineInstance) {
      engineInstance.setCameraView(currentCameraPreset);
    }
  }, [currentCameraPreset, engineInstance]);

  // 5. React to Lamp Toggle
  useEffect(() => {
    if (engineInstance) {
      engineInstance.toggleLamp(isLampOn);
    }
  }, [isLampOn, engineInstance]);

  // 6. React to Dimensions Toggle
  useEffect(() => {
    if (engineInstance) {
      engineInstance.toggleDimensions(showDimensions);
    }
  }, [showDimensions, engineInstance]);

  // 7. React to AutoRotate Toggle
  useEffect(() => {
    if (engineInstance) {
      engineInstance.toggleAutoRotate(autoRotate);
    }
  }, [autoRotate, engineInstance]);

  const handleSelectHotspot = (item) => {
    if (engineInstance) {
      engineInstance.focusHotspot(item);
    }
    setSelectedProduct(item);
  };

  const handleSaveRoom = async () => {
    if (!isLoggedIn()) {
      addToast('Vui lòng đăng nhập để lưu không gian 3D cá nhân!', 'warning', '🔒');
      openAuthModal('login');
      return;
    }

    const defaultName = `Phòng khách Haven - ${sofaFinishes[currentFinishKey].name}`;
    const roomName = prompt('Nhập tên cho bản phối cảnh không gian này:', defaultName);
    if (!roomName) return;

    const lightingNames = {
      day: 'Ban Ngày',
      sunset: 'Hoàng Hôn',
      night: 'Ban Đêm',
    };

    const newRoom = await saveCurrentRoom(
      roomName,
      currentFinishKey,
      sofaFinishes[currentFinishKey].name,
      currentLightingMode,
      lightingNames[currentLightingMode] || 'Tự nhiên'
    );

    addToast(`Đã lưu không gian "${newRoom.name}" vào tài khoản!`, 'success', '💾');
  };

  const handleToggleFullscreen = () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section className="viewport-wrapper" id="showroom-viewport" ref={viewportRef}>
      <div className="viewport-header">
        <div className="viewport-badge">
          <span className="live-dot"></span>
          <span>Living Room Suite 01 (React 3D)</span>
        </div>
        <div className="viewport-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Giữ chuột xoay • Lăn chuột phóng to • Click điểm ghim</span>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="canvas-box"></div>

      {/* 3D Hotspots Overlay */}
      <HotspotsOverlay
        hotspots={projectedHotspots}
        onSelectHotspot={handleSelectHotspot}
      />

      {/* Control Dock */}
      <ControlDock
        onSaveRoom={handleSaveRoom}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Product Modal */}
      <ProductModal />
    </section>
  );
}
