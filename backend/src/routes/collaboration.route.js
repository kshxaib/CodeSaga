import express from "express"
import {authMiddleware} from "../middleware/auth.middleware.js"
import {getCollaborationById, getCollaborationByProblem, updateCollaborationCode} from "../controllers/collaboration.controller.js"

const collaborationRoutes = express.Router();

collaborationRoutes.get('/', authMiddleware, getCollaborationByProblem);
collaborationRoutes.get('/:collaborationId', authMiddleware, getCollaborationById);
collaborationRoutes.put('/:collaborationId', authMiddleware, updateCollaborationCode);

export default collaborationRoutes