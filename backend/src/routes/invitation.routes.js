import express from "express"
import { authMiddleware } from '../middleware/auth.middleware.js';
import { cancelInvitation, getUserInvitations, sendInvitation, updateInvitationStatus } from "../controllers/invitation.controller.js";

const invitationRoutes = express.Router();

invitationRoutes.post('/', authMiddleware, sendInvitation)
invitationRoutes.get('/', authMiddleware, getUserInvitations)
invitationRoutes.put('/:invitationId', authMiddleware, updateInvitationStatus)
invitationRoutes.delete('/:invitationId', authMiddleware, cancelInvitation)


export default invitationRoutes