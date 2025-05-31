import {db} from "../libs/db.js"

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id
        const { page = 1, limit = 10, isRead } = req.query
        const skip = (page - 1) * limit

        const whereClause = { userId }
        if (isRead !== undefined) whereClause.isRead = isRead === 'true'

        const notifications = await db.notification.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: parseInt(limit)
        })

        const total = await db.notification.count({
            where: whereClause
        })

        return res.status(200).json({
            success: true,
            data: notifications,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const {notificationId} = req.params
        const userId = req.user.id

        const notification = await db.notification.findUnique({
            where: {
                id: notificationId
            }
        })

        if(!notification || notification.userId !== userId){
            return res.status(400).json({
                success: false,
                message: "Notification not found"
            })
        }

        if(notification.isRead){
            return res.status(400).json({
                success: false,
                message: "Notification is already marked as read"
            })
        }

        const updatedNotification = await db.notification.update({
            where: {id: notificationId},
            data: {
                isRead: true
            }
        })

        req.io.to(`notifications:${userId}`).emit('notificationRead', notificationId)

        return res.status(200).json({
            success: true,
            updatedNotification
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        })
    }
}

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id

        const {count} = await db.notification.updateMany({
            where:{
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        })

         req.io.to(`notifications:${userId}`).emit('allNotificationsRead');

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            markedRead: count
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read"
        })
    }
}

export const getUnreadNotificationCount = async (req, res) => {
    try {
        const userId = req.user.id
    
        const count = await db.notification.count({
            where: {
                userId,
                isRead: false
            }
        })
    
        return res.status(200).json({
            success: true,
            count
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get unread notification count"
        })
    }
}