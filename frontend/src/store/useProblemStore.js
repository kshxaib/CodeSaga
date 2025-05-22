import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";

export const useProblemStore = create((set) => ({
    problems : [],
    problem : null,
    solvedProblems : [],
    isLoading : false,
    isDeletingProblem : false,
    isUpdatingProblem : false,
    isGettingRandomProblem : false,

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
            return res.data.problem
        } catch (error) {
            console.error("Error while fetching problem", error);
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

    deleteProblem: async (id) => {
        try {
            set({isDeletingProblem: true});
            const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
            showToast(res);

            const problemsRes = await axiosInstance.get("/problems/get-all-problems");
            set({problems: problemsRes.data.problems});
        } catch (error) {
            console.log("Error while deleting problem", error);
            showToast(error);
        } finally{
            set({isDeletingProblem: false});
        }
    },

    updateProblem: async (id, value) => {
        try {
            set({isUpdatingProblem: true});
            const res = await axiosInstance.put(`/problems/update-problem/${id}`, value);
            showToast(res);
            const problemsRes = await axiosInstance.get("/problems/get-all-problems");
            set({problems: problemsRes.data.problems});
        } catch (error) {
            console.error(error);
            showToast(error);
        } finally {
            set({isUpdatingProblem: false});
        }
    },

    getRandomProblem: async () => {
        try {
            set({isGettingRandomProblem: true});
            const res = await axiosInstance.get("/problems/random");
            return res.data.problem
        } catch (error) {
            console.error("Error while fetching random problem", error);
            showToast(error);
        } finally {
            set({isGettingRandomProblem: false});
        }
    }
}))