import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: "",
      isAdmin: false,
      name: null,
      role: null,
      photo: null,

      setPhoto: (url) => set({ photo: url }),
      setRole: (role) => set({ role: role }),
      setName: (data) => set({ name: data }),
      setIsAdmin: (value) => set({ isAdmin: value }),
      setToken: (data) => set({ token: data }),

      logout: () =>
        set({
          token: "",
          isAdmin: false,
        }),

      getToken: () => get().token,
      getIsAdmin: () => get().isAdmin,
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        token: state.token,
        isAdmin: state.isAdmin,
        userRole: state.userRole,
      }),
    }
  )
);

export default useAuthStore;
