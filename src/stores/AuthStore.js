import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: "",
      isAdmin: false,
      userData: null,
      userRole: null,
      hasPermissionCamera: null,

      setHasPermissionCamera: (value) => set({ hasPermissionCamera: value }),
      setUserRole: (role) => set({ userRole: role }),
      setUserData: (data) => set({ userData: data }),
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
    },
  ),
);

export default useAuthStore;
