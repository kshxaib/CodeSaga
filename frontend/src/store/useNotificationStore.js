import { create } from 'zustand';
import {axiosInstance} from "../libs/axios"
import { showToast } from '../libs/showToast';

const useNotificationStore = create((set) => ({
    notifications: [],
    isLoading: false,
    unreadCount: 0,

    fetchNotifications: async () => {
    set({ isLoading: true });
     console.log("fetchNotifications triggered...");
    try {
        const res = await axiosInstance.get('/notifications');
        const notifications = res.data.data;
  console.log("Fetched notifications:", notifications);
        set({
            notifications,
            unreadCount: notifications.filter(n => !n.isRead).length
        });
         console.log("Notification store updated");
    } catch (error) {
        console.error("Error fetching notifications:", error);
        showToast(error);
    } finally {
        set({ isLoading: false });
    }
},
    markAsRead: async (notificationId) => {
        try {
            await axiosInstance.put(`/notifications/${notificationId}/read`);
            set(state => ({
                notifications: state.notifications.map(n => 
                    n.id === notificationId ? {...n, isRead: true} : n
                ),
                unreadCount: state.unreadCount - 1
            }));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            showToast(error);
        }
    },

     markAllAsRead: async () => {
        try {
            await axiosInstance.put('/notifications/read-all');
            set(state => ({
                notifications: state.notifications.map(n => ({...n, isRead: true})),
                unreadCount: 0
            }));
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            showToast(error);
        }
    },

    incrementUnreadCount: () => set(state => ({ unreadCount: state.unreadCount + 1 })),

    getUnreadNotificationCount: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get('/notifications/unread');
        set({ unreadCount: res.data.count }); 
    } catch (error) {
        console.error(error);
        showToast(error);
    } finally {
        set({ isLoading: false });
    }
}
}))

export default useNotificationStore