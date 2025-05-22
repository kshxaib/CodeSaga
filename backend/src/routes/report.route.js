import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import { deleteReport, getAllReports, submitReport, updateReportStatus } from '../controllers/report.controller.js';

const reportRoutes = express.Router();

reportRoutes.post("/", authMiddleware, submitReport)
reportRoutes.get("/all", authMiddleware, getAllReports)
reportRoutes.put("/:reportId", authMiddleware, isAdmin,updateReportStatus)
reportRoutes.delete("/", authMiddleware, isAdmin, deleteReport)

export default reportRoutes;