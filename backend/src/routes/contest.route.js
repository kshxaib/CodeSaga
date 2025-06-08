import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import { createContest, getAllContests, getContestById, getContestLeaderboard, getContestProblems, getContestScore, getContestStats, getContestSubmissions, registerForContest, submitContestSolution } from '../controllers/contest.controller.js';

const contestRoutes = express.Router();

contestRoutes.get("/", authMiddleware, getAllContests)
contestRoutes.get("/:id", authMiddleware, getContestById)
contestRoutes.get("/:id/leaderboard", authMiddleware, getContestLeaderboard)
contestRoutes.get("/:contestId/score", authMiddleware, getContestScore)
contestRoutes.get("/:id/stats", authMiddleware, getContestStats)
contestRoutes.get("/:contestId/problems", authMiddleware, getContestProblems)
contestRoutes.get("/:contestId/submissions/:problemId", authMiddleware, getContestSubmissions)


contestRoutes.post("/:id/register", authMiddleware, registerForContest)
contestRoutes.post("/:contestId/submit", authMiddleware, submitContestSolution)

contestRoutes.post("/", authMiddleware, createContest)

export default contestRoutes;