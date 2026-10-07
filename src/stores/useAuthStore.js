import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      savedRooms: [
        {
          id: 'room_sample_1',
          name: 'Phòng khách Penthouse Masteri',
          date: '2026-09-20',
          finishKey: 'cognac',
          finishName: 'Da Bò Cognac (Leather)',
          lightingMode: 'sunset',
          lightingName: 'Hoàng Hôn Ấm Áp',
        },
      ],

      isLoggedIn: () => !!get().user,

      syncRoomsFromBackend: async () => {
        const user = get().user;
        if (!user) return;
        const res = await api.getSavedRooms(user.id);
        if (res.success && res.rooms && res.rooms.length > 0) {
          set({ savedRooms: res.rooms });
        }
      },

      login: async (email, password) => {
        if (!email || !password) {
          return { success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' };
        }

        const res = await api.login(email, password);
        if (res.success && res.user) {
          set({ user: res.user });
          get().syncRoomsFromBackend();
          return { success: true, user: res.user };
        }

        // Fallback user
        const userName = email.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        const user = {
          id: `usr_${Date.now()}`,
          name: formattedName || 'Khách hàng Haven',
          email: email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formattedName}&backgroundColor=b05e38`,
          tier: 'Thành viên VIP',
        };

        set({ user });
        return { success: true, user };
      },

      loginWithProvider: async (provider) => {
        const res = await api.loginWithProvider(provider);
        if (res.success && res.user) {
          set({ user: res.user });
          get().syncRoomsFromBackend();
          return { success: true, user: res.user };
        }

        const user = {
          id: `usr_${provider}_${Date.now()}`,
          name: provider === 'google' ? 'Nguyễn Anh Tuấn' : 'Tuấn Nguyễn (Apple)',
          email: `${provider}.user@havenhome.vn`,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Tuấn&backgroundColor=b05e38`,
          tier: 'Thành viên VIP',
        };

        set({ user });
        return { success: true, user };
      },

      register: async (name, email, password) => {
        if (!name || !email || !password) {
          return { success: false, message: 'Vui lòng điền đủ Họ tên, Email và Mật khẩu!' };
        }

        const res = await api.register(name, email, password);
        if (res.success && res.user) {
          set({ user: res.user });
          return { success: true, user: res.user };
        }

        const user = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b05e38`,
          tier: 'Thành viên Mới',
        };

        set({ user });
        return { success: true, user };
      },

      logout: () => {
        set({ user: null });
      },

      saveCurrentRoom: async (roomName, finishKey, finishName, lightingMode, lightingName) => {
        const user = get().user;
        const roomPayload = {
          userId: user ? user.id : null,
          name: roomName || `Phòng khách số ${get().savedRooms.length + 1}`,
          finishKey: finishKey || 'cream',
          finishName: finishName || 'Kem Bouclé',
          lightingMode: lightingMode || 'day',
          lightingName: lightingName || 'Ban Ngày',
        };

        if (user) {
          api.saveRoom(roomPayload).then((res) => {
            if (res.success && res.room) {
              console.log('✅ Đã lưu không gian 3D vào PostgreSQL!');
            }
          });
        }

        const newRoom = {
          id: `room_${Date.now()}`,
          name: roomPayload.name,
          date: new Date().toLocaleDateString('vi-VN'),
          finishKey: roomPayload.finishKey,
          finishName: roomPayload.finishName,
          lightingMode: roomPayload.lightingMode,
          lightingName: roomPayload.lightingName,
        };

        set((s) => ({ savedRooms: [newRoom, ...s.savedRooms] }));
        return newRoom;
      },

      removeSavedRoom: (roomId) => {
        if (roomId && !roomId.startsWith('room_sample') && !roomId.startsWith('room_')) {
          api.deleteRoom(roomId);
        }
        set((s) => ({
          savedRooms: s.savedRooms.filter((r) => r.id !== roomId),
        }));
      },
    }),
    {
      name: 'haven_home_auth_v2',
    }
  )
);
