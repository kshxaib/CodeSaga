import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import { deleteReport, getAllReports, getReportById, submitReport, updateReportStatus } from '../controllers/report.controller.js';

const reportRoutes = express.Router();

reportRoutes.post("/:problemId", authMiddleware, submitReport)
reportRoutes.get("/", authMiddleware, getAllReports)
reportRoutes.get("/:reportId", authMiddleware, isAdmin, getReportById)
reportRoutes.put("/:reportId", authMiddleware, isAdmin,updateReportStatus)
reportRoutes.delete("/:reportId", authMiddleware, isAdmin, deleteReport)

export default reportRoutes;