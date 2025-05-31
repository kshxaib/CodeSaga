import { create } from 'zustand';
import {axiosInstance} from "../libs/axios"

const useInvitationStore = create((set) => ({
    invitations: [],
    isLoading: false,
    error: null,
    success: false,

    fetchInvitations: async () => {
        set({isLoading: true, error: null})
        try {
            const response = await axiosInstance.get("/invitations")
            set({invitations: response.data.invitations, error: null, success: true})
        } catch (error) {
            set({ error: error.message});
        } finally {
            set({isLoading: false})
        }
    },

    sendInvitation: async (problemId, receiverId, message) => {
        set({isLoading: true, error: null, success: false})
        try {
            const res = await axiosInstance.post("/invitations", {problemId, receiverId, message})
            const data = res.data
            set((state) => ({
                invitations: [...state.invitations, data.invitation],
                isLoading: false,
                success: true
            }))
            return data
        } catch (error) {
            set({error: error.message});
        } finally {
            set({isLoading: false})
        }
    },

    updateInvitationStatus: async (invitationId, status) => {
        set({isLoading: true, error: null})
        try {
            const res = await axiosInstance.put(`/invitations/${invitationId}`, {status})
            const data = res.data
            set((state) => ({
                invitations: state.invitations.map((inv) => 
                inv.id === invitationId ? data.updateInvitation: inv)
            }))
        } catch (error) {
            set({error: error.message});
            throw error;
        } finally {
            set({isLoading: false})
        }
    },

    cancelInvitation: async (invitationId) => {
        set({isLoading: true, error: null})
        try {
            await axiosInstance.delete(`/invitations/${invitationId}`)
            set((state) => ({
                invitations: state.invitations.filter((inv) => inv.id !== invitationId)
            }))
        } catch (error) {
            set({error: error.message});
            throw error;
        } finally {
            set({isLoading: false})
        }
    }
}))

export default useInvitationStore