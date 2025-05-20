import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "sonner";
import { showToast } from "../libs/showToast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLogginIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/users/check");
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error while checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.user });
      showToast(res);
    } catch (error) {
      console.log("Error while signing up", error);
      showToast(error);
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      showToast(res);
    } catch (error) {
      console.log("Error while logging in", error);
      showToast(error);
    } finally {
      set({ isLogginIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      showToast(res);
    } catch (error) {
      console.log("Error while logging out", error);
      showToast(error);
    }
  },

  forgotPassword: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", data);
      showToast(res);
    } catch (error) {
      console.log("Error while forgot password", error);
      showToast(error);
    }
  },

  verifyOtp: async (data) => {
    try {
      const res = await axiosInstance.post(
        `/auth/verify-otp/${data.email}`,
        data
      );
      showToast(res);
      return res;
    } catch (error) {
      console.log("Error while verifying otp", error);
      showToast(error);
      return error?.response;
    }
  },

  changePassword: async (data) => {
    let res;
    try {
      res = await axiosInstance.post(`/auth/change-password`, data);
      showToast(res);
    } catch (error) {
      console.log("Error while changing password", error);
      showToast(error);
    }
    return res;
  },

  checkUniqueUsername: async (username) => {
    try {
       const res = await axiosInstance.get(
        `/auth/check-username?username=${username}`
      );
      return res;
    } catch (error) {
      console.log("Error while checking username", error);
      return error?.response;
    }
  },

  googleAuth: async (token, isRegister) => {
    const loadingKey = isRegister ? 'isSigninUp' : 'isLogginIn';
    set({ [loadingKey]: true });
    
    try {
      const endpoint = isRegister ? '/auth/google/register' : '/auth/google/login';
      const { data } = await axiosInstance.post(endpoint, { token });
      
      set({ 
        authUser: data.user,
        isSigninUp: false,
        isLogginIn: false 
      });
      
      return data;
    } catch (error) {
      set({ 
        isSigninUp: false,
        isLogginIn: false 
      });
      throw error;
    }
  },
}));
