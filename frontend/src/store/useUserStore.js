import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";
import { toast } from "sonner";


export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  searchResults: [],
  socket: null,

  getUserDetails: async () => {
  set({ isLoading: true });
  try {
    const res = await axiosInstance.get("/users/check");
    set({ user: res.data });
  } catch (error) {
    console.error("Error fetching user details:", error);
  } finally {
    set({ isLoading: false });
  }
},

  updateProfile: async (formData) => {
    console.log("Updating profile with data:", formData);
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put("users/check", formData);
      set({ user: res.data.user });
      showToast(res);
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchUsers: async (query) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/users/search-user?username=${query}`);
      set({ searchResults: res.data.users });
    } catch (error) {
      console.error("Error searching users:", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUserByUsername: async (username) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/users/${username}`);
      set({ viewedProfile: res.data.user });
    } catch (error) {
      console.error("Error fetching user by username:", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  upgradeToPro: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/users/initiate-pro-upgrade");
      return response.data;
    } catch (error) {
      console.error("Error initiating PRO upgrade:", error);
      toast.error(error.response?.data?.message || "Failed to initiate PRO upgrade");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyProUpgrade: async (paymentData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/users/verify-pro-upgrade", paymentData);
      if (response.data.success) {
        await get().getUserDetails();
      }
      return response.data;
    } catch (error) {
      console.error("Error verifying PRO upgrade:", error);
      toast.error(error.response?.data?.message || "Failed to verify PRO upgrade");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getUserStats: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/users/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error(error.response?.data?.message || "Failed to fetch user stats");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
