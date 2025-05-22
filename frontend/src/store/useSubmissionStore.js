import {create} from "zustand";
import {axiosInstance} from "../libs/axios";
import { showToast } from "../libs/showToast";


export const useSubmissionStore = create((set) => ({
    isLoading: null,
    submissions: [],
    submission: null,
    submissionCount: null,


    getAllSubmissions: async () => {
        try {
            set({isLoading: true});
            const res = await axiosInstance.get('submission/get-all-submissions');
            set({submissions: res.data.submissions})
            showToast(res);
        } catch (error) {
            console.log(error);
            showToast(error);
        } finally{
            set({isLoading: false});
        }
    },

    getSubmissionForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`submission/get-submissions/${problemId}`);
            set({submission: res.data.submissions})
        } catch (error) {
            console.log(error);
            showToast(error);
        }
    },

    getSubmissionCountForProblem: async (problemId) => {
        try {
            const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);
            set({submissionCount: res.data.count})
        } catch (error) {
            console.log(error);
            showToast(error);
        }
    },
}));