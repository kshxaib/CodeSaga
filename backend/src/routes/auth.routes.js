import express from 'express';
import { googleRegister, changePassword, checkUniqueUsername, forgotPassword, login, logout, register, verifyOtp, googleLogin } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', authMiddleware, logout)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp/:email', verifyOtp)
authRoutes.post('/change-password', changePassword)
authRoutes.get('/check-username', checkUniqueUsername)
authRoutes.post('/google/register', googleRegister)
authRoutes.post('/google/login', googleLogin)

export default authRoutes;