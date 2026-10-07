import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useShowroomStore } from '../../stores/useShowroomStore';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, addToast } =
    useShowroomStore();
  const { login, register, loginWithProvider } = useAuthStore();

  const [loginEmail, setLoginEmail] = useState('demo@havenhome.vn');
  const [loginPassword, setLoginPassword] = useState('12345678');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      addToast(`Chào mừng ${res.user.name} đã đăng nhập!`, 'success', '👋');
      closeAuthModal();
    } else {
      addToast(res.message, 'warning', '⚠️');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const res = await register(regName, regEmail, regPassword);
    if (res.success) {
      addToast(`Tạo tài khoản thành công! Xin chào ${res.user.name}.`, 'success', '🎉');
      closeAuthModal();
    } else {
      addToast(res.message, 'warning', '⚠️');
    }
  };

  const handleGoogleLogin = async () => {
    const res = await loginWithProvider('google');
    if (res.success) {
      addToast(`Đăng nhập Google thành công! Xin chào ${res.user.name}.`, 'success', '🌐');
      closeAuthModal();
    }
  };

  return (
    <div className="auth-modal-wrapper active">
      <div className="auth-backdrop" onClick={closeAuthModal}></div>
      <div className="auth-card">
        <button className="modal-close" onClick={closeAuthModal} aria-label="Đóng popup">
          &times;
        </button>

        <div className="auth-header">
          <span className="brand-mark sm">H</span>
          <h3 className="auth-title">Chào mừng đến với Haven & Home</h3>
          <p className="auth-subtitle">Đăng nhập để lưu không gian 3D và quản lý đơn hàng</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${authModalTab === 'login' ? 'active' : ''}`}
            onClick={() => setAuthModalTab('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab-btn ${authModalTab === 'register' ? 'active' : ''}`}
            onClick={() => setAuthModalTab('register')}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Social Login */}
        <div className="social-login-group">
          <button className="social-btn google-btn" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.22 0 10.06 0 12s.45 3.78 1.25 5.39l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Tiếp tục với Google</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>hoặc với email</span>
        </div>

        {/* Login Form */}
        {authModalTab === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                placeholder="tenban@email.com"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password">Mật khẩu</label>
                <a
                  href="#"
                  className="forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('Đã gửi liên kết khôi phục mật khẩu vào email của bạn!', 'info', '📧');
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <input
                type="password"
                id="login-password"
                placeholder="Nhập mật khẩu"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="primary-btn auth-submit-btn">
              Đăng nhập
            </button>
          </form>
        )}

        {/* Register Form */}
        {authModalTab === 'register' && (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Họ và tên</label>
              <input
                type="text"
                id="reg-name"
                placeholder="Nguyễn Văn A"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                placeholder="tenban@email.com"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Mật khẩu</label>
              <input
                type="password"
                id="reg-password"
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="primary-btn auth-submit-btn">
              Tạo tài khoản
            </button>
          </form>
        )}

        {/* Quick Demo Box */}
        <div className="quick-demo-box">
          <span>
            💡 <strong>Dùng thử nhanh:</strong> Nhấn Đăng nhập để sử dụng tài khoản mẫu ngay lập tức.
          </span>
        </div>
      </div>
    </div>
  );
}
