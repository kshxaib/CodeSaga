import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getCodeCompletion, getCodeReview } from '../controllers/ai.controller.js';


const aiRoutes = express.Router();

aiRoutes.post("/completions", authMiddleware,getCodeCompletion)
aiRoutes.post("/review", authMiddleware, getCodeReview)

export default aiRoutes;