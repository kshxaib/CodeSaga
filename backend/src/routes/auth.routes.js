import express from 'express';
import { changePassword, forgotPassword, login, logout, register, verifyOtp } from '../controllers/auth.contoller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp/:email', verifyOtp)
authRoutes.post('/change-password/:email', changePassword)
authRoutes.post('/logout', authMiddleware, logout)

export default authRoutes;