import express from "express"
import { authMiddleware } from '../middleware/auth.middleware.js';
import { acceptInvitation, getUserInvitations, sendInvitation, updateInvitationStatus } from "../controllers/invitation.controller.js";

const invitationRoutes = express.Router();

invitationRoutes.get('/', authMiddleware, getUserInvitations)
invitationRoutes.post('/', authMiddleware, sendInvitation)
invitationRoutes.put('/:invitationId', authMiddleware, updateInvitationStatus)
invitationRoutes.post("/:invitationId/accept", authMiddleware, acceptInvitation);

export default invitationRoutes