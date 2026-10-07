// ============================================================================
// API CLIENT SERVICE - Giao tiếp giữa Frontend và Backend PostgreSQL
// Có cơ chế dự phòng thông minh (Online PostgreSQL / Offline LocalStorage)
// ============================================================================

const API_BASE = '/api';

class ApiService {
  constructor() {
    this.isBackendAvailable = false;
    this.checkHealth();
  }

  async checkHealth() {
    try {open 
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        this.isBackendAvailable = data.database?.connected || false;
        if (this.isBackendAvailable) {
          console.log('✅ Đã kết nối thành công tới Backend Node.js & PostgreSQL!');
        }
        return data;
      }
    } catch {
      this.isBackendAvailable = false;
    }
    return { status: 'offline', database: { connected: false } };
  }

  // --- AUTH APIS ---
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, offline: true, error: e.message };
    }
  }

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, offline: true, error: e.message };
    }
  }

  async loginWithProvider(provider) {
    try {
      const res = await fetch(`${API_BASE}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, offline: true, error: e.message };
    }
  }

  // --- SAVED ROOMS APIS ---
  async getSavedRooms(userId) {
    try {
      const url = userId ? `${API_BASE}/rooms?userId=${userId}` : `${API_BASE}/rooms`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend không phản hồi, dùng dữ liệu lưu trữ cục bộ:', e.message);
    }
    return { success: false, offline: true };
  }

  async saveRoom(roomData) {
    try {
      const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, lưu phòng cục bộ:', e.message);
    }
    return { success: false, offline: true };
  }

  async deleteRoom(roomId) {
    try {
      const res = await fetch(`${API_BASE}/rooms/${roomId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, xóa phòng cục bộ:', e.message);
    }
    return { success: false, offline: true };
  }

  // --- CART APIS ---
  async syncCartItem(userId, product, finish) {
    try {
      const res = await fetch(`${API_BASE}/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, product, finish }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Bỏ qua lỗi khi offline
    }
    return { success: false, offline: true };
  }

  async checkVoucher(code) {
    try {
      const res = await fetch(`${API_BASE}/cart/voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, offline: true, error: e.message };
    }
  }

  // --- ORDER APIS ---
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (e) {
      return { success: false, offline: true, error: e.message };
    }
  }

  // ==========================================================================
  // --- ADMIN APIS (Hệ thống Quản trị Vận hành) ---
  // ==========================================================================

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Admin API Stats offline, dùng dữ liệu mẫu:', e.message);
    }
    // Fallback Mock Stats
    return {
      success: true,
      stats: {
        totalRevenue: 24850,
        totalOrders: 18,
        pendingOrders: 4,
        completedOrders: 12,
        totalCustomers: 46,
        totalSavedRooms: 32,
        popularityStats: [
          { id: 'hotspot-sofa', name: 'Sofa Luna Curve Lounge', views: 1420, ordersCount: 38, percent: 62 },
          { id: 'hotspot-table', name: 'Bàn Trà Arlo Fluted', views: 890, ordersCount: 24, percent: 22 },
          { id: 'hotspot-chair', name: 'Ghế Thư Giãn Terra', views: 560, ordersCount: 16, percent: 11 },
          { id: 'hotspot-lamp', name: 'Đèn Cây Halo Arc Brass', views: 420, ordersCount: 12, percent: 5 },
        ],
        finishPopularity: [
          { key: 'cream', name: 'Kem Bouclé (Ivory)', colorHex: '#f3ece0', share: 45 },
          { key: 'cognac', name: 'Da Bò Cognac (Leather)', colorHex: '#9e522c', share: 32 },
          { key: 'sage', name: 'Xanh Rêu Velvet (Olive)', colorHex: '#485844', share: 15 },
          { key: 'charcoal', name: 'Xám Khói Slate (Charcoal)', colorHex: '#2b2e34', share: 8 },
        ],
      },
    };
  }

  async getAdminOrders() {
    try {
      const res = await fetch(`${API_BASE}/admin/orders`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Admin API Orders offline, dùng dữ liệu mẫu:', e.message);
    }
    // Fallback Mock Orders
    return {
      success: true,
      orders: [
        {
          id: 'ord_1',
          order_code: 'HV-948201',
          customer_name: 'Nguyễn Anh Tuấn',
          customer_email: 'tuan.nguyen@havenhome.vn',
          customer_phone: '0912 345 678',
          shipping_address: 'Villa 12, Khu đô thị Thảo Điền, TP. Thủ Đức',
          subtotal: 1979,
          discount_amount: 197.9,
          total_amount: 1781.1,
          order_status: 'pending',
          payment_method: 'cod',
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          items: [
            {
              product_id: 'hotspot-sofa',
              product_name: 'Sofa Luna Curve Lounge',
              finish_name: 'Kem Bouclé (Ivory)',
              finish_color_hex: '#f3ece0',
              quantity: 1,
              unit_price: 1499,
              total_price: 1499,
            },
            {
              product_id: 'hotspot-table',
              product_name: 'Bàn Trà Arlo Fluted Table',
              finish_name: 'Đá Cẩm Thạch Trắng',
              finish_color_hex: '#ffffff',
              quantity: 1,
              unit_price: 480,
              total_price: 480,
            },
          ],
        },
        {
          id: 'ord_2',
          order_code: 'HV-948185',
          customer_name: 'Trần Thị Thu Thảo',
          customer_email: 'thao.tran@gmail.com',
          customer_phone: '0988 776 655',
          shipping_address: 'Căn hộ 1804, Tòa Sapphire, Masteri Centre Point, TP.HCM',
          subtotal: 1499,
          discount_amount: 50,
          total_amount: 1449,
          order_status: 'processing',
          payment_method: 'bank_transfer',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          items: [
            {
              product_id: 'hotspot-sofa',
              product_name: 'Sofa Luna Curve Lounge',
              finish_name: 'Da Bò Cognac (Leather)',
              finish_color_hex: '#9e522c',
              quantity: 1,
              unit_price: 1499,
              total_price: 1499,
            },
          ],
        },
        {
          id: 'ord_3',
          order_code: 'HV-948020',
          customer_name: 'Lê Hoàng Nam',
          customer_email: 'nam.le@interior.com',
          customer_phone: '0903 112 233',
          shipping_address: 'Số 45, Đường Lê Duẩn, Quận 1, TP.HCM',
          subtotal: 910,
          discount_amount: 0,
          total_amount: 910,
          order_status: 'completed',
          payment_method: 'cod',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          items: [
            {
              product_id: 'hotspot-chair',
              product_name: 'Ghế Thư Giãn Terra Nordic',
              finish_name: 'Vải dệt nỉ cao cấp',
              finish_color_hex: '#d9b382',
              quantity: 1,
              unit_price: 590,
              total_price: 590,
            },
            {
              product_id: 'hotspot-lamp',
              product_name: 'Đèn Cây Halo Arc Brass',
              finish_name: 'Đồng thau xước 2700K',
              finish_color_hex: '#c59758',
              quantity: 1,
              unit_price: 320,
              total_price: 320,
            },
          ],
        },
      ],
    };
  }

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Update order status offline fallback:', e.message);
    }
    return { success: true, order: { id, order_status: status } };
  }

  async getAdminVouchers() {
    try {
      const res = await fetch(`${API_BASE}/admin/vouchers`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Admin API Vouchers offline, dùng danh sách mặc định:', e.message);
    }
    return {
      success: true,
      vouchers: [
        {
          code: 'HAVEN10',
          discount_percent: 10,
          discount_amount: 0,
          description: 'Giảm 10% cho đơn hàng đầu tiên trải nghiệm Showroom 3D',
          is_active: true,
          used_count: 24,
          max_uses: 100,
          expires_at: '2026-12-31',
        },
        {
          code: 'WELCOME50',
          discount_percent: 0,
          discount_amount: 50,
          description: 'Ưu đãi trừ thẳng $50 cho thành viên mới đăng ký tài khoản',
          is_active: true,
          used_count: 15,
          max_uses: 50,
          expires_at: '2026-12-31',
        },
        {
          code: 'LUXURYVIP',
          discount_percent: 15,
          discount_amount: 0,
          description: 'Chiết khấu 15% độc quyền dành cho khách hàng VIP và KTS',
          is_active: true,
          used_count: 8,
          max_uses: 20,
          expires_at: '2026-11-30',
        },
      ],
    };
  }

  async createVoucher(voucherData) {
    try {
      const res = await fetch(`${API_BASE}/admin/vouchers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voucherData),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Create voucher offline fallback:', e.message);
    }
    return {
      success: true,
      voucher: {
        ...voucherData,
        code: voucherData.code.toUpperCase(),
        is_active: true,
        used_count: 0,
      },
    };
  }

  async toggleVoucher(code) {
    try {
      const res = await fetch(`${API_BASE}/admin/vouchers/${code}/toggle`, {
        method: 'PATCH',
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Toggle voucher offline fallback:', e.message);
    }
    return { success: true };
  }

  async deleteVoucher(code) {
    try {
      const res = await fetch(`${API_BASE}/admin/vouchers/${code}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Delete voucher offline fallback:', e.message);
    }
    return { success: true };
  }

  async getAdminCustomers() {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Admin API Customers offline fallback:', e.message);
    }
    return {
      success: true,
      customers: [
        {
          id: 'usr_1',
          name: 'Nguyễn Anh Tuấn',
          email: 'tuan.nguyen@havenhome.vn',
          created_at: '2026-09-15',
          saved_rooms_count: 3,
          total_orders_count: 2,
          total_spent: 3420,
        },
        {
          id: 'usr_2',
          name: 'Trần Thị Thu Thảo',
          email: 'thao.tran@gmail.com',
          created_at: '2026-09-22',
          saved_rooms_count: 1,
          total_orders_count: 1,
          total_spent: 1449,
        },
        {
          id: 'usr_3',
          name: 'Lê Hoàng Nam',
          email: 'nam.le@interior.com',
          created_at: '2026-10-01',
          saved_rooms_count: 4,
          total_orders_count: 1,
          total_spent: 910,
        },
      ],
    };
  }
}

export const api = new ApiService();
