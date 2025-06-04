import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { check, searchUser, updateProfile} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get('/check', authMiddleware, check)
userRoutes.put('/check', authMiddleware, upload.single('image'), updateProfile)
userRoutes.get('/search-user', authMiddleware, searchUser)


export default userRoutes;