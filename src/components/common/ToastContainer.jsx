import React from 'react';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function ToastContainer() {
  const { toasts } = useShowroomStore();

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item show toast-${toast.type || 'info'}`}
        >
          <span className="toast-icon">{toast.icon || '✨'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
