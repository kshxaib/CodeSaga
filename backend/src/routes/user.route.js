import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { check, initiateProUpgrade, searchUser, updateProfile, verifyProUpgrade} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get('/check', authMiddleware, check)
userRoutes.put('/check', authMiddleware, upload.single('image'), updateProfile)
userRoutes.get('/search-user', authMiddleware, searchUser)
userRoutes.post('/initiate-pro-upgrade', authMiddleware, initiateProUpgrade)
userRoutes.post('/verify-pro-upgrade', authMiddleware, verifyProUpgrade)


export default userRoutes;