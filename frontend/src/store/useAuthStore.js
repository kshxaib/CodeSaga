import {create} from "zustand";
import {axiosInstance} from "../libs/axios";
import {toast} from "sonner"
import {showToastFromResponse} from "../libs/showToastFromRespose";

export const useAuthStore = create(set => ({
    authUser : null,
    isSigninUp : false,
    isLogginIn : false,
    isCheckingAuth : false,

    checkAuth : async () => {
        set({isCheckingAuth : true})
        try {
            const res = await axiosInstance.get('/users/check')
            set({authUser: res.data.user})
        } catch (error) {
            console.log("Error while checking auth",error)
            set({authUser: null})
        } finally {
            set({isCheckingAuth : false})
        }
    },    
    
    signup : async (data) => {
        set({isSigninUp : true})
        try {
            const res = await axiosInstance.post('/auth/register', data)
            set({authUser: res.data.user})
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while signing up",error)
            toast.error("Error while signing up")
        } finally{
            set({isSigninUp : false})
        }        
    },

    login : async (data) => {
        set({isLogginIn : true})
        try {
            const res = await axiosInstance.post('/auth/login', data)
            set({authUser: res.data.user})
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while logging in",error)
            toast.error("Error while logging in")
        } finally {
            set({isLogginIn : false})
        }
    },

    logout : async () => {
        try {
            const res= await axiosInstance.post('/auth/logout')
            set({authUser: null})
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while logging out",error)
            toast.error("Error while logging out")
        }
    },

    forgotPassword : async (data) => {
        try {
            const res = await axiosInstance.post('/auth/forgot-password', data)
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while forgot password",error)
            toast.error("Error while forgot password")
        }
    },

    verifyOtp: async (data) => {
        try {
            const res = await axiosInstance.post(`/auth/verify-otp/${data.email}`, data)
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while verifying otp",error)
            toast.error("Error while verifying otp")
        }
    },

    changePassword : async (data) => {
        try {
            const res = await axiosInstance.post(`/auth/change-password/${data.email}`, data)
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while changing password",error)
            toast.error("Error while changing password")
        }
    },

    checkUniqueUsername : async (data) => {
        try {
            const res = await axiosInstance.get(`/auth/check-username?username=${data.username}`)
            showToastFromResponse(res)
        } catch (error) {
            console.log("Error while checking username",error)            
            toast.error("Error while checking username")
        }
    }
}))