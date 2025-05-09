import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getAllSubmissions, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions)
submissionRoutes.get("/get-submissions/:problemId", authMiddleware, getSubmissionsForProblem)
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getAllTheSubmissionsForProblem)

export default submissionRoutes;