# Haven & Home — 3D Interior Showroom (Web3D)

Dự án phối cảnh nội thất 3D phòng khách chuẩn chỉ, trực quan thời gian thực được xây dựng bằng **Three.js** và **Vite**.

![Haven & Home 3D Preview](https://raw.githubusercontent.com/NQQDao/WEB3D_project/main/preview.png) *(Tùy chọn)*

## ✨ Tính năng nổi bật

- **Không gian phòng khách 3D cao cấp:**
  - Sofa cong 3 chỗ *Luna Curve Lounge* (bo góc mềm mại, đệm công thái học, chân đồng thau).
  - Bàn trà điêu khắc *Arlo Fluted Table* (mặt đá Calacatta cẩm thạch, thân gỗ sồi gân sọc, decor hoa khô và nến).
  - Ghế tựa thư giãn *Terra Nordic Armchair*.
  - Đèn cây vòm *Halo Brass Arc Lamp* phát sáng thực tế (`PointLight`).
  - Cây xanh nội thất *Fiddle-leaf Fig* & Thảm len dệt xương cá.
  - Sàn gỗ tự nhiên phản xạ PBR mềm mại.
- **Hệ thống ánh sáng 3 kịch bản thời gian thực:**
  - ☀️ Ban ngày (Natural Daylight & Soft Shadows).
  - 🌅 Hoàng hôn (Golden Hour ấm áp).
  - 🌙 Ban đêm thư giãn (Warm Night & đèn cây rực rỡ).
- **Bộ tùy biến chất liệu PBR Sofa:**
  - Kem Bouclé (Ivory), Da Bò Cognac (Leather), Xanh Rêu Velvet (Olive), Xám Khói Slate (Charcoal).
- **Điều khiển góc quay thông minh:**
  - 4 Camera Presets: Toàn cảnh, Cận cảnh sofa, Góc thư giãn, Mặt bằng kiến trúc.
  - Xoay 360°, zoom, pan tự do chống lật sàn với OrbitControls.
- **Điểm ghim Hotspots 3D tương tác:**
  - Ghim phát sóng radar nhấp nháy, bấm để xem chi tiết thông số kỹ thuật (giá, kích thước, vật liệu).
- **Tiện ích bổ trợ:**
  - Thước đo kích thước 3D thực tế (220cm x 95cm x 82cm).
  - Tự xoay 360° (Auto-rotate Turntable).
  - Toàn màn hình (Fullscreen Viewer).
  - Tối ưu hóa 60 FPS, hỗ trợ cảm ứng di động (`touch-action: none`).

---

## 🚀 Cài đặt & Khởi chạy

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Truy cập `http://localhost:5173` trên trình duyệt.

### 3. Đóng gói cho Production:
```bash
npm run build
```
Thư mục xuất bản: `dist/`.

---

## 🛠️ Công nghệ sử dụng

- [Three.js](https://threejs.org/) (WebGL 3D Engine, PBR Materials, OrbitControls, RoundedBoxGeometry)
- [Vite](https://vitejs.dev/) (Build tool thế hệ mới, HMR cực nhanh)
- HTML5 Canvas Procedural Texturing (Tạo vân gỗ, vân đá, thảm dệt không phụ thuộc tài nguyên mạng)
- CSS3 Glassmorphism & Responsive Layout

