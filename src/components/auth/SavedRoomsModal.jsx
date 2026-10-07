import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useShowroomStore, sofaFinishes } from '../../stores/useShowroomStore';

export default function SavedRoomsModal({ engineRef }) {
  const { isSavedRoomsOpen, closeSavedRooms, setFinishKey, setLightingMode, addToast, currentFinishKey, currentLightingMode } =
    useShowroomStore();
  const { savedRooms, removeSavedRoom, saveCurrentRoom, isLoggedIn } = useAuthStore();

  if (!isSavedRoomsOpen) return null;

  const handleRestoreRoom = (room) => {
    closeSavedRooms();

    if (room.finishKey) {
      setFinishKey(room.finishKey);
      if (engineRef?.current) {
        engineRef.current.applySofaFinish(room.finishKey);
      }
    }

    if (room.lightingMode) {
      setLightingMode(room.lightingMode);
      if (engineRef?.current) {
        engineRef.current.setLightingMode(room.lightingMode);
      }
    }

    const viewport = document.getElementById('showroom-viewport');
    if (viewport) {
      viewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    addToast(`Đã khôi phục không gian "${room.name}"!`, 'success', '🎨');
  };

  const handleDeleteRoom = (roomId, roomName) => {
    removeSavedRoom(roomId);
    addToast(`Đã xóa "${roomName}" khỏi danh sách`, 'info', '🗑️');
  };

  const handleSaveCurrent = async () => {
    const defaultName = `Phòng khách Haven - ${sofaFinishes[currentFinishKey]?.name || 'Tùy biến'}`;
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
      sofaFinishes[currentFinishKey]?.name || 'Vải nỉ Bouclé',
      currentLightingMode,
      lightingNames[currentLightingMode] || 'Tự nhiên'
    );

    addToast(`Đã lưu không gian "${newRoom.name}" vào tài khoản!`, 'success', '💾');
  };

  return (
    <div className="saved-rooms-modal-wrapper active">
      <div className="saved-rooms-backdrop" onClick={closeSavedRooms}></div>
      <div className="saved-rooms-card">
        <button className="modal-close" onClick={closeSavedRooms} aria-label="Đóng">
          &times;
        </button>

        <div className="modal-header">
          <span className="modal-category">BỘ SƯU TẬP CỦA BẠN</span>
          <h3 className="modal-title">Không gian 3D đã lưu</h3>
          <p className="modal-desc">
            Các bản phối màu và góc ánh sáng bạn đã lưu lại để trình chiếu hoặc đặt hàng theo cấu hình riêng.
          </p>
        </div>

        <div className="saved-rooms-actions-bar">
          <button className="primary-btn mini-btn" onClick={handleSaveCurrent}>
            <span>💾 Lưu phối cảnh 3D hiện tại</span>
          </button>
        </div>

        <div className="saved-rooms-list">
          {savedRooms.length === 0 ? (
            <div className="empty-rooms">
              <p>Bạn chưa lưu không gian 3D nào. Hãy tùy chỉnh màu sắc và góc ánh sáng rồi nhấn "Lưu phòng" nhé!</p>
            </div>
          ) : (
            savedRooms.map((room) => (
              <div key={room.id} className="saved-room-card">
                <div className="saved-room-info">
                  <h4 className="saved-room-title">{room.name}</h4>
                  <span className="saved-room-date">Lưu ngày: {room.date}</span>
                  <div className="saved-room-tags">
                    <span className="room-tag finish-tag">🎨 {room.finishName}</span>
                    <span className="room-tag lighting-tag">💡 {room.lightingName}</span>
                  </div>
                </div>
                <div className="saved-room-actions">
                  <button
                    className="primary-btn mini-btn btn-load-room"
                    onClick={() => handleRestoreRoom(room)}
                  >
                    Khôi phục 3D
                  </button>
                  <button
                    className="btn-delete-room"
                    onClick={() => handleDeleteRoom(room.id, room.name)}
                    title="Xóa không gian này"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
