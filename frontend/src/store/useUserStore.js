import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";
import io from 'socket.io-client';
import { toast } from "sonner";


export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  followers: [],
  following: [],
  searchResults: [],
  viewedProfile: null,
  socket: null,

  getUserDetails: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users/check");
      set({ user: res.data.user });
    } catch (error) {
      console.error("Error fetching user details:", error);
      showToast(error);
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
  
  updateUserFollowStatus: (userId, isFollowing) => {
    set((state) => ({
      followers: state.followers.map(user =>
        user.id === userId ? { ...user, isFollowing } : user
      ),
      following: state.following.map(user =>
        user.id === userId ? { ...user, isFollowing } : user
      ),
      searchResults: state.searchResults.map(user =>
        user.id === userId ? { ...user, isFollowing } : user
      ),
      viewedProfile: state.viewedProfile?.id === userId 
      ? { ...state.viewedProfile, isFollowing }
      : state.viewedProfile
    }));
  },

  followUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/users/follow/${userId}`);
      set(state => ({
        following: [...state.following, res.data.followedUser],
        user: {
          ...state.user,
          followingCount: state.user.followingCount + 1,
        }
      }));
      get().updateUserFollowStatus(userId, true);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      console.error("Error following user:", error);
      toast.error(error.response?.data?.message || "Failed to follow user");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  unfollowUser: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/users/unfollow/${userId}`);
      set(state => ({
        following: state.following.filter(user => user.id !== userId),
        user: {
          ...state.user,
          followingCount: Math.max(0, state.user.followingCount - 1),
        }
      }));
      get().updateUserFollowStatus(userId, false);
      showToast(res);
      return res.data;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      showToast(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFollowers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/users/followers');
      set({ followers: res.data.followers });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFollowing: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/users/followings');
      set({ following: res.data.following });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

}));
