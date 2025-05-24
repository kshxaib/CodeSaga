import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";

export const useUserStore = create((set) => ({
    user: null, 
    isLoading: false,

    getUserDetails: async () => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.get("/users/check")
            set({ user: res.data.user});
        } catch (error) {
            console.error("Error fetching user details:", error);
            showToast(error)
        } finally {
            set({isLoading: false});
        }
    },

    updateProfile: async (formData) => {
        console.log("Updating profile with data:", formData);
        set({isLoading: true})
        try {
            const res = await axiosInstance.put("users/check", formData)
            set({ user: res.data.user });
            showToast(res)
        } catch (error) {
            console.error("Error updating profile:", error);
            showToast(error)
        } finally {
            set({isLoading: false});
        }
    },

    followUser: async (userId) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.post(`/users/follow/${userId}`);
            showToast(res);
        } catch (error) {
            console.error("Error following user:", error);
            showToast(error)
        } finally {
            set({isLoading: false});
        }
    },

    unfollowUser: async (userId) => {
        set({isLoading: true});
        try {
            const res = await axiosInstance.post(`/users/unfollow/${userId}`);
            showToast(res);
        } catch (error) {
            console.error("Error unfollowing user:", error);
            showToast(error)
        } finally {
            set({isLoading: false});
        }
    },
}))

