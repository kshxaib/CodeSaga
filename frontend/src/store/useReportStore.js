import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";

export const useReportStore = create((set, get) => ({
  reports: [],
  currentReport: null,
  isSubmittingReport: false,
  isGettingReports: false,

  submitReport: async (problemId, reason, description) => {
    try {
      set({ isSubmittingReport: true });
      const res = await axiosInstance.post("/problems/report", {
        problemId,
        reason,
        description,
      });
      showToast(res);
    } catch (error) {
      console.error(error);
      showToast(error);
    } finally {
      set({ isSubmittingReport: false });
    }
  },

  getAllReports: async () => {
    try {
      set({ isGettingReports: true });
      const res = await axiosInstance.get("/problems/report/all");
      set({
        reports: res.data.data || [],
      });
    } catch (error) {
      console.error(error);
      showToast(error);
    } finally {
      set({ isGettingReports: false });
    }
  },

  updateReportStatus: async (reportId, status) => {
    try {
      const res = await axiosInstance.put(`/problems/report/${reportId}`, {
        status,
      });
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === reportId ? { ...report, status } : report
        ),
      }));
      showToast(res);
    } catch (error) {
      console.error(error);
      showToast(error);
    }
  },

  deleteReport: async (reportId) => {
    console.log("Deleting report with ID:", reportId);
    try {
      const res = await axiosInstance.delete('/problems/report', {
  data: { reportId },
});
      set((state) => ({
        reports: state.reports.filter((report) => report.id !== reportId),
      }));
      showToast(res);
    } catch (error) {
      console.error(error);
      showToast(error);
    }
  },
}));
