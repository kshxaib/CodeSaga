import express from "express"
import {authMiddleware} from "../middleware/auth.middleware.js"
import { createCollaboration, getCollaboration, joinCollaboration, leaveCollaboration, updateCollaborationCode} from "../controllers/collaboration.controller.js"

const collaborationRoutes = express.Router();

collaborationRoutes.post("/", authMiddleware, createCollaboration);
collaborationRoutes.get("/:collaborationId", authMiddleware, getCollaboration);
collaborationRoutes.post("/:collaborationId/join", authMiddleware, joinCollaboration);
collaborationRoutes.put("/:collaborationId/code", authMiddleware, updateCollaborationCode);
collaborationRoutes.post("/:collaborationId/leave", authMiddleware, leaveCollaboration);

export default collaborationRoutes