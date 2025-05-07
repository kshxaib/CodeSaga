import express from 'express';
import { check, login, logout, register } from '../controllers/auth.contoller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', authMiddleware, logout)
authRoutes.get('/check', authMiddleware, check)

export default authRoutes;