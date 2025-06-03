import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            }, 
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                username: true
            }
        })

        if(!user) {
            return res.status(404).json({ error: "Unauthorized access" });
        }

        req.user = user;
        next();
    } catch (error) {
        throw new Error("Internal server error")
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where : {
                id: userId
            }, 
            select: {
                role: true
            }
        })

        if(!user ||user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden access" });
        }

        next();
    } catch (error) {
        throw new Error("Internal server error")
    }
}