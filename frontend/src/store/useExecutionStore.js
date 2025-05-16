import {create} from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";


export const useExecutionStore = create((set) => ({
    isExecuting: false,
    submission: null,

    executeCode: async (source_code, language_id, stdin, expected_outputs, problemId) => {
        try {
            set({isExecuting: true});
            const res = await axiosInstance.post("/execute-code", {source_code, language_id, stdin, expected_outputs, problemId})
            set({submission: res.data.submission});
            showToast(res);
        } catch (error) {
            console.error("Error while executing code", error);
            showToast(error);
        } finally {
            set({isExecuting: false});
        }
    }
}))