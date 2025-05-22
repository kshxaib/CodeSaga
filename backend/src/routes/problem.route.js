import express from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser,
  searchProblems,
  getRecommendedProblems,
  reactToProblem,
  getRandomProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, isAdmin, createProblem);
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);
problemRoutes.put("/update-problem/:id", authMiddleware, isAdmin, updateProblem);
problemRoutes.delete("/delete-problem/:id", authMiddleware, isAdmin, deleteProblem);
problemRoutes.get("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

problemRoutes.get('/search-problems', authMiddleware, searchProblems)
problemRoutes.get('/recommendations', authMiddleware, getRecommendedProblems)
problemRoutes.post('/:problemId/react', authMiddleware, reactToProblem)
problemRoutes.get('/random', authMiddleware, getRandomProblem)

export default problemRoutes;
    