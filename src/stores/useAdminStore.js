import { create } from 'zustand';
import { api } from '../api';
import { hotspotsData } from './useShowroomStore';

export const useAdminStore = create((set, get) => ({
  // Active Navigation Tab
  activeTab: 'overview', // 'overview' | 'orders' | 'products' | 'vouchers' | 'customers'
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Stats State
  stats: null,
  isLoadingStats: false,

  // Orders State
  orders: [],
  selectedOrder: null,
  isOrderModalOpen: false,
  orderFilter: 'all', // 'all' | 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled'

  // Products State
  products: [...hotspotsData],
  selectedProductForEdit: null,
  isProductEditModalOpen: false,

  // Vouchers State
  vouchers: [],
  isCreateVoucherModalOpen: false,

  // Customers State
  customers: [],

  // --- ACTIONS ---

  fetchStats: async () => {
    set({ isLoadingStats: true });
    const res = await api.getAdminStats();
    if (res.success && res.stats) {
      set({ stats: res.stats, isLoadingStats: false });
    } else {
      set({ isLoadingStats: false });
    }
  },

  fetchOrders: async () => {
    const res = await api.getAdminOrders();
    if (res.success && res.orders) {
      set({ orders: res.orders });
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o
        ),
        selectedOrder:
          state.selectedOrder?.id === orderId
            ? { ...state.selectedOrder, order_status: newStatus }
            : state.selectedOrder,
      }));
      get().fetchStats();
      return true;
    }
    return false;
  },

  openOrderDetail: (order) => set({ selectedOrder: order, isOrderModalOpen: true }),
  closeOrderDetail: () => set({ isOrderModalOpen: false, selectedOrder: null }),
  setOrderFilter: (filter) => set({ orderFilter: filter }),

  fetchVouchers: async () => {
    const res = await api.getAdminVouchers();
    if (res.success && res.vouchers) {
      set({ vouchers: res.vouchers });
    }
  },

  createVoucher: async (voucherData) => {
    const res = await api.createVoucher(voucherData);
    if (res.success && res.voucher) {
      set((state) => ({
        vouchers: [res.voucher, ...state.vouchers],
        isCreateVoucherModalOpen: false,
      }));
      return { success: true };
    }
    return { success: false, message: res.message || 'Lỗi tạo voucher' };
  },

  toggleVoucher: async (code) => {
    const res = await api.toggleVoucher(code);
    if (res.success) {
      set((state) => ({
        vouchers: state.vouchers.map((v) =>
          v.code === code ? { ...v, is_active: !v.is_active } : v
        ),
      }));
    }
  },

  deleteVoucher: async (code) => {
    const res = await api.deleteVoucher(code);
    if (res.success) {
      set((state) => ({
        vouchers: state.vouchers.filter((v) => v.code !== code),
      }));
    }
  },

  openCreateVoucherModal: () => set({ isCreateVoucherModalOpen: true }),
  closeCreateVoucherModal: () => set({ isCreateVoucherModalOpen: false }),

  // Products actions
  openProductEditModal: (product) =>
    set({ selectedProductForEdit: { ...product }, isProductEditModalOpen: true }),
  closeProductEditModal: () =>
    set({ isProductEditModalOpen: false, selectedProductForEdit: null }),

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      isProductEditModalOpen: false,
      selectedProductForEdit: null,
    }));
  },

  // Customers actions
  fetchCustomers: async () => {
    const res = await api.getAdminCustomers();
    if (res.success && res.customers) {
      set({ customers: res.customers });
    }
  },
}));
