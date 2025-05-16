import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";

export const useProblemStore = create((set) => ({
    problems : [],
    problem : null,
    solvedProblems : [],
    isLoading : false,

    createProblem: async (value) => {
        try {
            set({isLoading: true});
            const res = await axiosInstance.post("/problems/create-problem", value);
            showToast(res);
            return res
        } catch (error) {
            console.error("Error while creating problem", error);
            showToast(error);
        } finally {
            set({isLoading: false});
        }
    },

    getAllProblems: async () => {
        try {
            set({ isLoading: true})
            const res = await axiosInstance.get("/problems/get-all-problems");
            set({problems: res.data.problems});
        } catch (error) {
            console.error("Error while fetching problems", error);
            showToast(error);
        } finally {
            set({ isLoading: false});
        }
    },

    getProblemById: async (id) => {
        try {
            set({ isLoading: true});
            const res = await axiosInstance.get(`/problems/get-problem/${id}`);
            set({problem: res.data.problem});
            showToast(res);
        } catch (error) {
            console.error("Error while fetching problem", error);
            showToast(error);
        } finally {
            set({ isLoading: false});
        }
    },

    getSolvedProblems: async () => {
        try {
            set({isLoading: true});
            const res = await axiosInstance.get("/problems/get-solved-problem");
            set({solvedProblems: res.data.solvedProblems});
        } catch (error) {
            console.error("Error while fetching solved problems", error);
            showToast(error);
        } finally {
            set({isLoading: false});
        }
    },

    searchProblems: async (value) => {
        console.log(value);
        try {
            set({isLoading: true});
            const res = await axiosInstance.get(`/problems/search-problems?search=${value}`);
            // showToast(res);
            return res  
        } catch (error) {
            console.error("Error while searching problems", error);
            showToast(error);
        } finally {
            set({isLoading: false});
        }
    }
}))