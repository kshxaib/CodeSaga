import { Server } from "socket.io";
import { db } from "./db.js";
import { invitationEvents } from "./events.js";

const socketRateLimits = new Map();
export const activeCollaborations = new Map();
const connectedUsers = new Map();
export const userSockets = new Map();

const checkRateLimit = (socket) => {
  const ip = socket.handshake.address;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 100;

  if (!socketRateLimits.has(ip)) {
    socketRateLimits.set(ip, {
      count: 1,
      lastReset: now
    });
    return true;
  }

  const limitInfo = socketRateLimits.get(ip);

  if (now - limitInfo.lastReset > windowMs) {
    limitInfo.count = 1;
    limitInfo.lastReset = now;
    return true;
  }

  if (limitInfo.count >= max) {
    return false;
  }

  limitInfo.count++;
  return true;
};

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.use(([event, ...args], next) => {
      if (!checkRateLimit(socket)) {
        return next(new Error("Too many requests, please try again later"));
      }
      next();
    });

    socket.on("authenticate", (userId) => {
      connectedUsers.set(socket.id, userId);
      userSockets.set(userId, socket.id);
      socket.join(`user:${userId}`);
      socket.join(`notifications:${userId}`);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    });

    socket.on("invitationEvent", (data) => {
      switch (data.type) {
        case 'invitationCreated':
          invitationEvents.emit('invitationCreated', data.invitation);
          break;
        case 'invitationStatusUpdated':
          invitationEvents.emit('invitationStatusUpdated', data.invitation);
          break;
      }
    });

    socket.on("joinDiscussion", async (problemId) => {
      try {
        socket.join(`problem:${problemId}`);

        const messages = await db.discussionMessage.findMany({
          where: { discussion: { problemId } },
          include: {
            user: { select: { id: true, username: true, image: true } },
            replies: {
              include: {
                user: { select: { id: true, username: true, image: true } },
              },
            },
            upvotes: true,
          },
          orderBy: { createdAt: "asc" },
        });

        socket.emit("initialMessages", messages);
      } catch (error) {
        console.error("Error joining discussion:", error);
        socket.emit("error", "Failed to join discussion");
      }
    });

    socket.on("newMessage", async ({ problemId, userId, content }, callback) => {
      try {
        let discussion = await db.problemDiscussion.findFirst({
          where: { problemId },
        });

        if (!discussion) {
          discussion = await db.problemDiscussion.create({
            data: { problemId },
          });
        }

        const message = await db.discussionMessage.create({
          data: {
            content,
            userId,
            discussionId: discussion.id,
          },
          include: {
            user: { select: { id: true, username: true, image: true } },
            replies: true,
            upvotes: true,
          },
        });

        socket.to(`problem:${problemId}`).emit("newMessage", message);
        callback(message);
      } catch (error) {
        console.error("Error creating message:", error);
        callback({ error: "Failed to post message" });
      }
    });

    socket.on("newReply", async ({ messageId, userId, content }, callback) => {
      try {
        const reply = await db.discussionReply.create({
          data: {
            messageId,
            userId,
            content,
          },
          include: {
            user: { select: { id: true, username: true, image: true } },
            message: {
              include: {
                discussion: {
                  select: { problemId: true },
                },
              },
            },
          },
        });

        socket.to(`problem:${reply.message.discussion.problemId}`).emit("newReply", reply);
        callback(reply);
      } catch (error) {
        console.error("Error creating reply:", error);
        callback({ error: "Failed to post reply" });
      }
    });

    socket.on("upvoteMessage", async ({ messageId, userId }) => {
      try {
        const existingUpvote = await db.discussionUpvote.findFirst({
          where: { messageId, userId },
        });

        if (existingUpvote) {
          await db.discussionUpvote.delete({
            where: { id: existingUpvote.id },
          });
        } else {
          await db.discussionUpvote.create({
            data: { messageId, userId },
          });
        }

        const message = await db.discussionMessage.findUnique({
          where: { id: messageId },
          include: {
            upvotes: true,
            discussion: {
              select: { problemId: true },
            },
          },
        });

        io.to(`problem:${message.discussion.problemId}`).emit("messageUpdated", {
          messageId,
          upvoteCount: message.upvotes.length,
          isUpvoted: !existingUpvote,
        });
      } catch (error) {
        console.error("Error handling upvote:", error);
        socket.emit("error", "Failed to process upvote");
      }
    });

    socket.on("subscribeToNotifications", (userId) => {
      socket.join(`notifications:${userId}`);
      console.log(`User ${userId} subscribed to notifications`);
    });


    // Collaboration System
    socket.on("sendInvitation", async ({ problemId, receiverId }) => {
      try {
        const senderId = connectedUsers.get(socket.id);
        if (!senderId) throw new Error("Not authenticated");

        // Check if users are connected
        if (!userSockets.has(receiverId)) {
          return socket.emit("invitationError", "User is not online");
        }

        // Check if already collaborating
        if (activeCollaborations.has(senderId) || activeCollaborations.has(receiverId)) {
          return socket.emit("invitationError", "User is already in a collaboration");
        }

        // Create invitation
        const invitation = {
          id: uuidv4(),
          senderId,
          receiverId,
          problemId,
          status: "PENDING",
          createdAt: new Date()
        };

        // Send to receiver
        io.to(userSockets.get(receiverId)).emit("receiveInvitation", invitation);

        // Send back to sender
        socket.emit("invitationSent", invitation);
      } catch (error) {
        socket.emit("invitationError", error.message);
      }
    });

    socket.on("respondToInvitation", ({ invitationId, response, problemId }) => {
      try {
        const userId = connectedUsers.get(socket.id);
        if (!userId) throw new Error("Not authenticated");

        // In a real app, you'd validate this with your database
        const invitation = {
          id: invitationId,
          status: response ? "ACCEPTED" : "DECLINED"
        };

        // Notify sender
        const senderSocket = userSockets.get(invitation.senderId);
        if (senderSocket) {
          io.to(senderSocket).emit("invitationResponse", {
            invitationId,
            response,
            problemId
          });
        }

        if (response) {
          // Create collaboration room
          const roomId = `collab:${invitationId}`;
          const participants = [invitation.senderId, userId];

          // Join both users to the room
          participants.forEach(id => {
            if (userSockets.has(id)) {
              io.to(userSockets.get(id)).emit("joinCollaboration", {
                roomId,
                problemId,
                partner: participants.find(p => p !== id)
              });
              socket.join(roomId);
            }
          });

          // Track active collaboration
          activeCollaborations.set(invitation.senderId, roomId);
          activeCollaborations.set(userId, roomId);
          collaborationRooms.set(roomId, {
            participants,
            problemId,
            code: "", // Initial code
            language: "JAVASCRIPT" // Default language
          });
        }
      } catch (error) {
        socket.emit("collaborationError", error.message);
      }
    });

    socket.on("updateCollaborationCode", ({ roomId, code, language }) => {
      try {
        const userId = connectedUsers.get(socket.id);
        if (!userId) throw new Error("Not authenticated");
        if (!collaborationRooms.has(roomId)) throw new Error("Invalid room");

        const room = collaborationRooms.get(roomId);
        if (!room.participants.includes(userId)) throw new Error("Not authorized");

        // Update room state
        room.code = code;
        room.language = language;

        // Broadcast to other participants
        socket.to(roomId).emit("codeUpdated", { code, language });
      } catch (error) {
        socket.emit("collaborationError", error.message);
      }
    });

    socket.on("leaveCollaboration", ({ roomId }) => {
      try {
        const userId = connectedUsers.get(socket.id);
        if (!userId) throw new Error("Not authenticated");
        if (!collaborationRooms.has(roomId)) return;

        const room = collaborationRooms.get(roomId);

        // Remove user from active collaborations
        activeCollaborations.delete(userId);

        // Notify other participants
        socket.to(roomId).emit("partnerLeft", { userId });

        // Clean up if room is empty
        const remainingParticipants = room.participants.filter(id =>
          id !== userId && activeCollaborations.get(id) === roomId
        );

        if (remainingParticipants.length === 0) {
          collaborationRooms.delete(roomId);
        }
      } catch (error) {
        console.error("Error leaving collaboration:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        connectedUsers.delete(socket.id);
        userSockets.delete(userId);
      }

      // Handle leaving collaborations on disconnect
      activeCollaborations.forEach((collab, collabId) => {
        if (collab.sockets.has(socket.id)) {
          collab.sockets.delete(socket.id);
          if (userId) {
            const userSocketsInCollab = Array.from(collab.sockets).filter(sockId => {
              return connectedUsers.get(sockId) === userId;
            });

            if (userSocketsInCollab.length === 0) {
              // Remove user from participants
              db.problemCollaboration.update({
                where: { id: collabId },
                data: {
                  participants: {
                    disconnect: { id: userId }
                  }
                }
              });

              collab.participants = collab.participants.filter(p => p.id !== userId);
              io.to(`collaboration:${collabId}`).emit("participantLeft", {
                userId,
                participants: collab.participants
              });
            }
          }
        }
      });
    });

    socket.on("disconnect", () => {
      const userId = connectedUsers.get(socket.id);
      if (userId && activeCollaborations.has(userId)) {
        const roomId = activeCollaborations.get(userId);
        socket.to(roomId).emit("partnerDisconnected", { userId });
        activeCollaborations.delete(userId);

        const room = collaborationRooms.get(roomId);
        if (room) {
          const remaining = room.participants.filter(id => id !== userId);
          if (remaining.length === 0) {
            collaborationRooms.delete(roomId);
          }
        }
      }
      connectedUsers.delete(socket.id);
    });

    // Error Handler
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return { io, invitationEvents }
};

export default initializeSocket;