import { create } from 'zustand';

export const sofaFinishes = {
  cream: {
    name: 'Kem Bouclé (Ivory)',
    color: 0xf3ece0,
    colorHex: '#f3ece0',
    roughness: 0.88,
    metalness: 0.0,
    description: 'Vải nỉ xù Bouclé cao cấp nhập khẩu Bỉ, ấm áp, mềm mại tự nhiên.',
    pillowColorA: 0xc89d7c,
    pillowColorB: 0x5a6351,
  },
  cognac: {
    name: 'Da Bò Cognac (Leather)',
    color: 0x9e522c,
    colorHex: '#9e522c',
    roughness: 0.38,
    metalness: 0.08,
    description: 'Da thuộc Full-grain Italy màu nâu Cognac sang trọng cổ điển.',
    pillowColorA: 0xe8ded0,
    pillowColorB: 0x2e2c2a,
  },
  sage: {
    name: 'Xanh Rêu Velvet (Olive)',
    color: 0x485844,
    colorHex: '#485844',
    roughness: 0.65,
    metalness: 0.02,
    description: 'Nhung tuyết màu xanh rêu thanh lịch, phong cách Modern Nordic.',
    pillowColorA: 0xd9b382,
    pillowColorB: 0xece5db,
  },
  charcoal: {
    name: 'Xám Khói Slate (Charcoal)',
    color: 0x2b2e34,
    colorHex: '#2b2e34',
    roughness: 0.78,
    metalness: 0.02,
    description: 'Vải dệt công nghệ chống bám bẩn, gam màu xám than hiện đại.',
    pillowColorA: 0xc47e5b,
    pillowColorB: 0x9fa4ab,
  },
};

export const hotspotsData = [
  {
    id: 'hotspot-sofa',
    name: 'Sofa Luna Curve Lounge',
    category: 'Sofa 3 Chỗ Cao Cấp',
    price: '$1,499',
    position: [-0.2, 0.75, -0.5],
    cameraPos: [0.7, 1.6, 2.6],
    cameraTarget: [-0.2, 0.7, -0.4],
    description:
      'Đệm mút đàn hồi đa tầng bọc vải Bouclé Bỉ êm ái, khung gỗ tự nhiên chống mối mọt kết hợp chân đồng thau tinh tế.',
    specs: {
      'Kích thước': '220 x 95 x 82 cm',
      'Chất liệu bọc': 'Bouclé / Da Bò / Nhung',
      'Khung chịu lực': 'Gỗ Sồi Tự Nhiên & Thép',
      'Bảo hành': '10 năm chính hãng',
    },
  },
  {
    id: 'hotspot-table',
    name: 'Bàn Trà Arlo Fluted',
    category: 'Bàn Trà Điêu Khắc',
    price: '$480',
    position: [-0.2, 0.42, 0.82],
    cameraPos: [-0.1, 1.4, 1.9],
    cameraTarget: [-0.2, 0.38, 0.82],
    description:
      'Mặt bàn đá cẩm thạch trắng Calacatta phủ chống ố, kết hợp thân gỗ sồi gân sọc điêu khắc nghệ thuật.',
    specs: {
      'Đường kính': '68 cm',
      'Chiều cao': '38 cm',
      'Mặt bàn': 'Đá Cẩm Thạch Tự Nhiên',
      'Thân bàn': 'Gỗ Sồi Gân Sọc',
    },
  },
  {
    id: 'hotspot-lamp',
    name: 'Đèn Cây Halo Arc Brass',
    category: 'Đèn Sàn Nghệ Thuật',
    price: '$320',
    position: [1.4, 2.2, -0.8],
    cameraPos: [2.4, 2.0, 1.2],
    cameraTarget: [1.4, 1.7, -0.8],
    description:
      'Cần vòm đồng thau xước thanh mảnh, đế đá tự nhiên nặng giữ cân bằng, ánh sáng ấm 2700K dịu nhẹ thư thái.',
    specs: {
      'Chiều cao': '210 cm',
      'Độ vươn vòm': '120 cm',
      'Đế đèn': 'Đá Cẩm Thạch Nguyên Khối',
      'Bóng đèn': 'LED Warm White 2700K',
    },
  },
  {
    id: 'hotspot-chair',
    name: 'Ghế Thư Giãn Terra Nordic',
    category: 'Ghế Tựa Đơn (Armchair)',
    price: '$590',
    position: [-1.85, 0.72, 0.45],
    cameraPos: [-2.6, 1.7, 1.8],
    cameraTarget: [-1.85, 0.55, 0.45],
    description:
      'Thiết kế công thái học ôm trọn lưng, đệm mút mềm bọc nỉ ấm cúng, chân gỗ sồi tiện vát thanh lịch.',
    specs: {
      'Kích thước': '78 x 82 x 78 cm',
      'Độ ngả lưng': 'Công thái học 105°',
      'Chất liệu': 'Vải dệt cao cấp & Gỗ Sồi',
      'Tải trọng': '180 kg',
    },
  },
];

export const useShowroomStore = create((set, get) => ({
  // View Router State
  currentView: 'showroom', // 'showroom' | 'admin'
  setView: (view) => set({ currentView: view }),

  // 3D Controls State
  currentFinishKey: 'cream',
  currentLightingMode: 'day',
  currentCameraPreset: 'overview',
  isLampOn: false,
  showDimensions: false,
  autoRotate: false,

  // Selected Product & Modals
  selectedProduct: hotspotsData[0],
  isProductModalOpen: false,

  // Modals / Drawers
  isCartOpen: false,
  isAuthModalOpen: false,
  authModalTab: 'login',
  isSavedRoomsOpen: false,
  isCheckoutSuccessOpen: false,
  lastOrderData: null,

  // Toasts
  toasts: [],

  // Setters
  setFinishKey: (key) => set({ currentFinishKey: key }),
  setLightingMode: (mode) => set({ currentLightingMode: mode }),
  setCameraPreset: (preset) => set({ currentCameraPreset: preset }),
  toggleLamp: () => set((s) => ({ isLampOn: !s.isLampOn })),
  toggleDimensions: () => set((s) => ({ showDimensions: !s.showDimensions })),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),

  setSelectedProduct: (product) => set({ selectedProduct: product, isProductModalOpen: true }),
  closeProductModal: () => set({ isProductModalOpen: false }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalTab: (tab) => set({ authModalTab: tab }),

  openSavedRooms: () => set({ isSavedRoomsOpen: true }),
  closeSavedRooms: () => set({ isSavedRoomsOpen: false }),

  openCheckoutSuccess: (orderData) =>
    set({ isCheckoutSuccessOpen: true, lastOrderData: orderData, isCartOpen: false }),
  closeCheckoutSuccess: () => set({ isCheckoutSuccessOpen: false }),

  // Toast Action
  addToast: (message, type = 'info', icon = '✨') => {
    const id = Date.now() + Math.random();
    set((s) => ({
      toasts: [...s.toasts, { id, message, type, icon }],
    }));
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },
}));
