import {db} from "../libs/db.js"

export const sendInvitation = async (req, res) => {
    try {
        const { problemId, receiverId, message } = req.body;
        const senderId = req.user.id;

        const maxInvites = 10
        const maxCollaborators = 5

        const existingInvites = await db.problemInvitation.count({
            where: {problemId, senderId}
        })

        if (existingInvites >= maxInvites) {
      return res.status(400).json({ error: `You can only send ${maxInvites} invitations per problem` });
    }

    const collaboration = await db.problemCollaboration.findFirst({
      where: { problemId, initiatorId: senderId },
      include: { participants: true }
    });

    if (collaboration && collaboration.participants.length >= maxCollaborators) {
      return res.status(400).json({ error: `Maximum ${maxCollaborators} collaborators allowed per problem` });
    }

        if(senderId === receiverId){
            return res.status(400).json({
                success: false,
                message: "You cannot invite yourself"
            })
        }

        const isFollower = await db.user.findFirst({
            where: {
                id: receiverId,
                followers: {
                    some: {
                        id: senderId
                    }
                }
            }
        })

        if(!isFollower){
            return res.status(400).json({
                success: false,
                message: "You can only invite your followers"
            })
        }

        const problem = await db.problem.findUnique({
            where: {id: problemId}
        })

        if(!problem){
            return res.status(400).json({
                success: false,
                message: "Problem not found"
            })
        }

        const existingInvitation = await db.problemInvitation.findFirst({
            where: {
                problemId,
                receiverId,
                senderId,
                status: { in: ["ACCEPTED", "PENDING"] }
            }
        })
        
        if(existingInvitation){
            return res.status(400).json({
                success: false,
                message: existingInvitation.status === "PENDING" ? "You have already sent an invitation to this user" : "You have already accepted an invitation from this user"
            })
        }

        const invitation = await db.problemInvitation.create({
            data: {
                problemId,
                receiverId,
                senderId,
                message,
                status: "PENDING"
            },
            include: {
                problem: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                sender: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                }
            }
        })

        const notification = await db.notification.create({
            data: {
                userId: receiverId,
                type: "INVITATION",
                content: `${req.user.username} invited you to help solve ${problem.title}`,
                referenceId: invitation.id,
            }
        })

        req.io.to(`notifications:${receiverId}`).emit("newNotification", notification)

        return res.status(200).json({
            success: true,
            message: "Invitation sent successfully",
            invitation
        })
            
    } catch (error) {
        console.error(error || "Error while sending invitation");
        res.status(400).json({
            success: false,
            message: "Error while sending invitation"
        })
    }
}

export const getUserInvitations = async (req, res) => {
    try {
        const userId = req.user.id
        const { page = 1, limit = 10, status } = req.query
        const skip = (page - 1) * limit

        const whereClause = { receiverId: userId }
        if (status) whereClause.status = status

        const invitations = await db.problemInvitation.findMany({
            where: whereClause,
            include: {
                problem: {
                    select: {
                        id: true,
                        title: true,
                        difficulty: true,
                    }
                },
                sender: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: parseInt(limit)
        })

        const total = await db.problemInvitation.count({
            where: whereClause
        })

        return res.status(200).json({
            success: true,
            invitations,
            meta: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error(error || "Error while getting user invitations");
        res.status(400).json({
            success: false,
            message: "Error while getting user invitations"
        })
    }
}

export const updateInvitationStatus = async (req, res) => {
    try {
        const {invitationId} = req.params
        const {status} = req.body
        const userId = req.user.id

        const invitation = await db.problemInvitation.findUnique({
            where: {
                id: invitationId
            },
            include: {
                sender: true,
                problem: {
                    select: {
                        title: true
                    }
                }
            }
        })

        if(!invitation || invitation.receiverId !== userId){
            return res.status(400).json({
                success: false,
                message: "Invitation not found"
            })
        }

        if(invitation.status !== "PENDING"){
            return res.status(400).json({
                success: false,
                message: "Invitation is not pending"
            })
        }

        const updateInvitation = await db.problemInvitation.update({
            where: {id: invitationId},
            data: {status}
        })

        const action = status === "ACCEPTED" ? "accepted" : "declined"

        const notification = await db.notification.create({
            data: {
                userId: invitation.senderId,
                type: status === "ACCEPTED" ? "ACCEPTED_INVITATION" : "GENERAL",
                content: `${req.user.username} ${action} your invitation to help solve ${invitation.problem.title}`,
                referenceId: invitation.id,
            }
        })

        req.io.to(`notifications:${invitation.senderId}`).emit("newNotification", notification)
         
        return res.status(200).json({
            success: true,
            message: "Invitation status updated successfully",
            updateInvitation
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            success: false,
            message: "Error while updating invitation status"
        })
    }
}

export const cancelInvitation = async (req, res) => {
    try {
        const {invitationId} = req.params
        const userId = req.user.id

        const invitation = await db.problemInvitation.findUnique({
            where: {id: invitationId},
            include: {
                receiver: true,
                problem: {
                    select: {
                        title: true
                    }
                }
            }
        })

        if(!invitation || invitation.receiverId !== userId){
            return res.status(400).json({
                success: false,
                message: "Invitation not found"
            })
        }

        if(invitation.status !== "PENDING"){
            return res.status(400).json({
                success: false,
                message: "Only pending invitations can be cancelled"
            })
        }

        const updatedInvitation = await db.problemInvitation.update({
            where: {id: invitationId},
            data: {status: "CANCELLED"}
        })

        const notification = await db.notification.create({
            data: {
                userId: invitation.receiverId,
                type: "GENERAL",
                content: `${req.user.username} cancelled their invitation to help solve ${invitation.problem.title}`,
                referenceId: invitation.id,
            }
        })

        req.io.to(`notifications:${invitation.receiverId}`).emit("newNotification", notification)
        
        return res.status(200).json({
            success: true,
            message: "Invitation cancelled successfully",
            updatedInvitation
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            success: false,
            message: "Error while cancelling invitation"
        })
    }
}