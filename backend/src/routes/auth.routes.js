import express from 'express';
import { changePassword, check, forgotPassword, login, logout, register, updateProfile, verifyOtp } from '../controllers/auth.contoller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/verify-otp/:email', verifyOtp)
authRoutes.post('/change-password/:email', changePassword)
authRoutes.post('/logout', authMiddleware, logout)
authRoutes.get('/check', authMiddleware, check)
authRoutes.put('/check', authMiddleware, upload.single('image'), updateProfile)

export default authRoutes;