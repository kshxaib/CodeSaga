import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { deleteReport, getAllReports, getReportById, submitReport, updateReportStatus } from '../controllers/report.controller.js';

const reportRoutes = express.Router();

reportRoutes.post("/:problemId", authMiddleware, submitReport)
reportRoutes.get("/", authMiddleware, getAllReports)
reportRoutes.get("/:reportId", authMiddleware, getReportById)
reportRoutes.put("/:reportId", authMiddleware, updateReportStatus)
reportRoutes.delete("/:reportId", authMiddleware, deleteReport)

export default reportRoutes;