import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api.js';

export const AVAILABLE_VOUCHERS = {
  HAVEN10: { code: 'HAVEN10', discountPercent: 10, description: 'Giảm 10% tổng hóa đơn' },
  WELCOME50: { code: 'WELCOME50', discountAmount: 50, description: 'Giảm trực tiếp $50' },
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedVoucher: null,

      addItem: (product, finish = null, userId = null) => {
        const numericPrice =
          typeof product.price === 'string'
            ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
            : product.price;

        const finishKey = finish?.key || 'standard';
        const itemId = `${product.id}_${finishKey}`;

        const items = get().items;
        const existingIndex = items.findIndex((i) => i.id === itemId);

        let newItems;
        if (existingIndex > -1) {
          newItems = items.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newItems = [
            ...items,
            {
              id: itemId,
              productId: product.id,
              name: product.name,
              category: product.category,
              price: numericPrice,
              priceFormatted: `$${numericPrice.toLocaleString()}`,
              quantity: 1,
              customization: finish
                ? {
                    finishKey: finish.key,
                    finishName: finish.name,
                    swatchColor: finish.colorHex || finish.swatchColor,
                  }
                : null,
            },
          ];
        }

        set({ items: newItems });

        // Đồng bộ lên backend nếu online
        api.syncCartItem(userId, product, finish);
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      },

      applyVoucher: async (code) => {
        const upperCode = code.trim().toUpperCase();

        // Kiểm tra backend PostgreSQL
        const apiRes = await api.checkVoucher(upperCode);
        if (apiRes.success && apiRes.voucher) {
          const voucher = {
            code: apiRes.voucher.code,
            discountPercent: parseFloat(apiRes.voucher.discount_percent) || 0,
            discountAmount: parseFloat(apiRes.voucher.discount_amount) || 0,
            description: apiRes.voucher.description,
          };
          set({ appliedVoucher: voucher });
          return { success: true, voucher };
        }

        // Fallback voucher mặc định
        if (AVAILABLE_VOUCHERS[upperCode]) {
          const voucher = AVAILABLE_VOUCHERS[upperCode];
          set({ appliedVoucher: voucher });
          return { success: true, voucher };
        }

        return { success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn!' };
      },

      removeVoucher: () => set({ appliedVoucher: null }),

      clearCart: () => set({ items: [], appliedVoucher: null }),

      getTotals: () => {
        const items = get().items;
        const voucher = get().appliedVoucher;

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

        let discount = 0;
        if (voucher) {
          if (voucher.discountPercent) {
            discount = (subtotal * voucher.discountPercent) / 100;
          } else if (voucher.discountAmount) {
            discount = Math.min(subtotal, voucher.discountAmount);
          }
        }

        const shipping = 0;
        const total = Math.max(0, subtotal - discount + shipping);

        return {
          itemCount,
          subtotal,
          discount,
          shipping,
          total,
          subtotalFormatted: `$${subtotal.toLocaleString()}`,
          discountFormatted: discount > 0 ? `-$${discount.toLocaleString()}` : '$0',
          shippingFormatted: 'Miễn phí',
          totalFormatted: `$${total.toLocaleString()}`,
        };
      },
    }),
    {
      name: 'haven_home_cart_v2',
    }
  )
);
