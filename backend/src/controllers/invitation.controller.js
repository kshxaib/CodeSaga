import { db } from "../libs/db.js"
import { userSockets } from "../libs/socketHandler.js";

export const sendInvitation = async (req, res) => {
  try {
    const { problemId, receiverId, message } = req.body;
    const senderId = req.user.id;

    const maxInvites = 10;
    const maxCollaborators = 5;

    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { title: true, codeSnippets: true }
    });

    // 1. Invite limit check
    const existingInvites = await db.problemInvitation.count({
      where: { problemId, senderId }
    });

    if (existingInvites >= maxInvites) {
      return res.status(400).json({
        success: false,
        message: `You can only send ${maxInvites} invitations per problem`
      });
    }

    // 2. Check/create collaboration room
    let collaboration = await db.problemCollaboration.findFirst({
      where: { problemId, initiatorId: senderId },
      include: { participants: true }
    });

    if (!collaboration) {
      collaboration = await db.problemCollaboration.create({
        data: {
          problemId,
          initiatorId: senderId,
          currentCode: problem.codeSnippets.JAVASCRIPT || "",
          language: "JAVASCRIPT",
          participants: {
            connect: [
              { id: senderId },
              { id: receiverId }
            ]
          }
        },
        include: { participants: true }
      });
    } else {
      // Add sender and receiver if missing
      const idsToAdd = [];
      if (!collaboration.participants.some(p => p.id === senderId)) {
        idsToAdd.push({ id: senderId });
      }
      if (!collaboration.participants.some(p => p.id === receiverId)) {
        idsToAdd.push({ id: receiverId });
      }
      if (idsToAdd.length > 0) {
        await db.problemCollaboration.update({
          where: { id: collaboration.id },
          data: {
            participants: {
              connect: idsToAdd
            }
          }
        });
      }

      // Check max collaborators limit
      const totalParticipants = collaboration.participants.length + idsToAdd.length;
      if (totalParticipants > maxCollaborators) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxCollaborators} collaborators allowed per problem`
        });
      }
    }

    // 3. Basic validation
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot invite yourself"
      });
    }

    const isFollower = await db.follow.findFirst({
      where: {
        followerId: receiverId,
        followingId: senderId
      }
    });

    if (!isFollower) {
      return res.status(400).json({
        success: false,
        message: "You can only invite your followers"
      });
    }

    // 4. Handle re-invitation
    const existingInvitation = await db.problemInvitation.findFirst({
      where: {
        problemId,
        receiverId,
        senderId
      }
    });

    if (existingInvitation) {
      if (["PENDING", "ACCEPTED"].includes(existingInvitation.status)) {
        return res.status(400).json({
          success: false,
          message:
            existingInvitation.status === "PENDING"
              ? "You have already sent an invitation to this user"
              : "This user has already accepted your invitation"
        });
      }

      const updatedInvitation = await db.problemInvitation.update({
        where: { id: existingInvitation.id },
        data: {
          status: "PENDING",
          message: message || "",
          updatedAt: new Date()
        },
        include: {
          problem: { select: { id: true, title: true } },
          sender: { select: { id: true, username: true, image: true } }
        }
      });

      const notification = await db.notification.create({
        data: {
          userId: receiverId,
          type: "INVITATION",
          content: `${req.user.username || "Someone"} invited you to help solve ${updatedInvitation.problem.title}`,
          referenceId: updatedInvitation.id
        }
      });

      req.io.to(`notifications:${receiverId}`).emit("newNotification", notification);

      return res.status(200).json({
        success: true,
        message: "Invitation resent successfully",
        invitation: updatedInvitation,
        collaborationId: collaboration.id
      });
    }

    // 5. New invitation
    const invitation = await db.problemInvitation.create({
      data: {
        problemId,
        receiverId,
        senderId,
        message,
        status: "PENDING"
      },
      include: {
        problem: { select: { id: true, title: true } },
        sender: { select: { id: true, username: true, image: true } }
      }
    });

    const notification = await db.notification.create({
      data: {
        userId: receiverId,
        type: "INVITATION",
        content: `${req.user.username || "Someone"} invited you to help solve ${invitation.problem.title}`,
        referenceId: invitation.id
      }
    });

    req.io.to(`notifications:${receiverId}`).emit("newNotification", notification);

    return res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
      invitation,
      collaborationId: collaboration.id
    });

  } catch (error) {
    console.error("Error while sending invitation:", error);
    return res.status(400).json({
      success: false,
      message: "Error while sending invitation"
    });
  }
};

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

export const acceptInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const userId = req.user.id;

        const invitation = await db.problemInvitation.findUnique({
            where: { id: invitationId },
            include: {
                sender: true,
                problem: true
            }
        });

        if (!invitation || invitation.receiverId !== userId) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }

        if (invitation.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Invitation is not pending"
            });
        }

        let collaboration = await db.problemCollaboration.findFirst({
            where: {
                problemId: invitation.problemId,
                participants: {
                    some: { id: invitation.senderId }
                }
            },
            include: { participants: true }
        });

        await db.problemInvitation.update({
            where: { id: invitationId },
            data: { status: "ACCEPTED" }
        });

        if (!collaboration) {
            collaboration = await db.problemCollaboration.create({
                data: {
                    problemId: invitation.problemId,
                    initiatorId: invitation.senderId,
                    participants: {
                        connect: [{ id: invitation.senderId }, { id: userId }]
                    },
                    currentCode: invitation.problem.codeSnippets?.JAVASCRIPT || "// Start collaborating here!",
                    language: "JAVASCRIPT"
                },
                include: {
                    participants: true,
                    problem: {
                        select: {
                            title: true,
                            id: true
                        }
                    }
                }
            });
        } else if (!collaboration.participants.some(p => p.id === userId)) {
            collaboration = await db.problemCollaboration.update({
                where: { id: collaboration.id },
                data: {
                    participants: {
                        connect: { id: userId }
                    }
                },
                include: {
                    participants: true,
                    problem: {
                        select: {
                            title: true
                        }
                    }
                }
            });
        }

        const notification = await db.notification.create({
            data: {
                userId: invitation.senderId,
                type: "COLLABORATION_JOINED",
                content: `${req.user.username} accepted your invitation to collaborate on "${invitation.problem.title}"`,
                referenceId: collaboration.id,
            }
        });

        req.io.to(`notifications:${invitation.senderId}`).emit("newNotification", notification);

        // Notify both users to join the collaboration session
        [invitation.senderId, userId].forEach(uid => {
            const socketId = userSockets.get(uid);
            if (socketId) {
                req.io.to(socketId).emit("redirectToCollaboration", {
                    collaborationId: collaboration.id,
                    problemId: collaboration.problemId
                });
            }
        });

        return res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            collaboration
        });

    } catch (error) {
        console.error("Error accepting invitation:", error);
        res.status(500).json({
            success: false,
            message: "Error accepting invitation"
        });
    }
};

export const updateInvitationStatus = async (req, res) => {
    try {
        const { invitationId } = req.params
        const { status } = req.body
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

        if (!invitation || invitation.receiverId !== userId) {
            return res.status(400).json({
                success: false,
                message: "Invitation not found"
            })
        }

        if (invitation.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Invitation is not pending"
            })
        }

        const updateInvitation = await db.problemInvitation.update({
            where: { id: invitationId },
            data: { status }
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