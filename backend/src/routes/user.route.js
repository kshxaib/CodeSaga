import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { check, fetchFollowers, fetchFollowing, followUser, getUserByUsername, searchUser, unfollowUser, updateProfile } from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get('/check', authMiddleware, check)
userRoutes.put('/check', authMiddleware, upload.single('image'), updateProfile)
userRoutes.get('/search-user', authMiddleware, searchUser)
userRoutes.get('/followers', authMiddleware, fetchFollowers)
userRoutes.get('/followings', authMiddleware, fetchFollowing)
userRoutes.post('/follow/:userId', authMiddleware, followUser)
userRoutes.post('/unfollow/:userId', authMiddleware, unfollowUser)
userRoutes.get('/:username', authMiddleware, getUserByUsername)

export default userRoutes;