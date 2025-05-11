import express from 'express';
import { changePassword, checkUniqueUsername, forgotPassword, login, logout, register, verifyOtp } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', authMiddleware, logout)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp/:email', verifyOtp)
authRoutes.post('/change-password', changePassword)
authRoutes.get('/check-username', checkUniqueUsername)

export default authRoutes;