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
      overtimeData: [],
      leaveData: [],
      shiftData: [],
      employeeData: [],
      attendanceHistoryData: [],
      clockIn: null,
      clockOut: null,
      userId: "",
      startTimeShift: null,
      endTimeShift: null,
      profilePhotoUrl: null,
      assignedShift: [],
      overtimeAllData: [],
      attendanceStatus: null,

      setAttendanceStatus: (status) => set({ attendanceStatus: status }),
      setOvertimeAllData: (data) => set({ overtimeAllData: data }),
      setAssignedShift: (data) => set({ assignedShift: data }),
      setToken: (data) => set({ token: data }),
      setIsAdmin: (value) => set({ isAdmin: value }),
      setName: (data) => set({ name: data }),
      setRole: (role) => set({ role: role }),
      setPhoto: (url) => set({ photo: url }),
      setOvertimeData: (data) => set({ overtimeData: data }),
      setLeaveData: (data) => set({ leaveData: data }),
      setShiftData: (data) => set({ shiftData: data }),
      setEmployeeData: (data) => set({ employeeData: data }),
      setAttendanceHistoryData: (data) => set({ attendanceHistoryData: data }),
      setClockIn: (data) => set({ clockIn: data }),
      setClockOut: (data) => set({ clockOut: data }),
      setUserId: (data) => set({ userId: data }),
      setStartTimeShift: (data) => set({ startTimeShift: data }),
      setEndTimeShift: (data) => set({ endTimeShift: data }),
      setProfilePhotoUrl: (url) => set({ profilePhotoUrl: url }),

      logout: () =>
        set({
          token: "",
          isAdmin: false,
          name: null,
          role: null,
          photo: null,
          overtimeData: [],
          leaveData: [],
          shiftData: [],
          employeeData: [],
          attendanceHistoryData: [],
          clockIn: null,
          clockOut: null,
          userId: "",
          startTimeShift: null,
          endTimeShift: null,
          profilePhotoUrl: null,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        token: state.token,
        isAdmin: state.isAdmin,
        role: state.role,
      }),
    },
  ),
);

export default useAuthStore;
