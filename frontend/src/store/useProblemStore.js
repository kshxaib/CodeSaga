import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { showToast } from "../libs/showToast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isLoading: false,
  isDeletingProblem: false,
  isUpdatingProblem: false,
  isGettingRandomProblem: false,
  isReactingToProblem: false,

  createProblem: async (value) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/problems/create-problem", value);
      showToast(res);
      return res;
    } catch (error) {
      console.error("Error while creating problem", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllProblems: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.problems });
    } catch (error) {
      console.error("Error while fetching problems", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: res.data.problem });
      return res.data.problem;
    } catch (error) {
      console.error("Error while fetching problem", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getSolvedProblems: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/problems/get-solved-problem");
      set({ solvedProblems: res.data.solvedProblems });
    } catch (error) {
      console.error("Error while fetching solved problems", error);
      showToast(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      showToast(res);

     set((state) => ({
  problems:  state.problems.filter((problem) => problem.id !== id),
}))
    } catch (error) {
      console.log("Error while deleting problem", error);
      showToast(error);
    } finally {
      set({ isDeletingProblem: false });
    }
  },

  updateProblem: async (id, value) => {
    try {
      set({ isUpdatingProblem: true });
      const res = await axiosInstance.put(
        `/problems/update-problem/${id}`,
        value
      );
      showToast(res);
      const problemsRes = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: problemsRes.data.problems });
    } catch (error) {
      console.error(error);
      showToast(error);
    } finally {
      set({ isUpdatingProblem: false });
    }
  },

  getRandomProblem: async () => {
    try {
      set({ isGettingRandomProblem: true });
      const res = await axiosInstance.get("/problems/random");
      return res.data.problem;
    } catch (error) {
      console.error("Error while fetching random problem", error);
      showToast(error);
    } finally {
      set({ isGettingRandomProblem: false });
    }
  },

  reactToProblem: async (id, value) => {
    try {
      set({ isReactingToProblem: true });

      const res = await axiosInstance.post("/problems/react", {
        problemId: id,
        isLike: value,
      });

      showToast(res);

      const updatedProblem = res.data.problem;

      // Efficient local state update
      set((state) => ({
        problems: state.problems.map((p) =>
          p.id === id
            ? {
                ...p,
                likes: updatedProblem.likes,
                dislikes: updatedProblem.dislikes,
              }
            : p
        ),
        problem:
          state.problem?.id === id
            ? {
                ...state.problem,
                likes: updatedProblem.likes,
                dislikes: updatedProblem.dislikes,
              }
            : state.problem,
      }));
    } catch (error) {
      console.error("Error while reacting to problem", error);
      showToast(error);
    } finally {
      set({ isReactingToProblem: false });
    }
  },
  checkProblemInPlaylist: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/problems/${problemId}`);
      return res.data.exists;
    } catch (error) {
      console.error("Error while checking problem in playlist", error);
      showToast(error);
    }
  },
}));
