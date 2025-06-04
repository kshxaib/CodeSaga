import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getCodeCompletion } from '../controllers/ai.controller.js';


const aiRoutes = express.Router();

aiRoutes.post("/completions", authMiddleware,getCodeCompletion)

export default aiRoutes;