import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createDevLog, generateDescription, getDevLogs, getMyDevLogs, reactToDevLog } from '../controllers/devLog.controller.js';

const devLogRoutes = express.Router();

devLogRoutes.post("/", authMiddleware, createDevLog)
devLogRoutes.get("/", authMiddleware, getDevLogs)
devLogRoutes.get("/my", authMiddleware, getMyDevLogs)
devLogRoutes.post("/:id/react", authMiddleware, reactToDevLog)
devLogRoutes.post("/generate-description", authMiddleware, generateDescription)

export default devLogRoutes;