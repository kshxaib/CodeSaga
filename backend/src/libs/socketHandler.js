import { Server } from "socket.io";
import { db } from "./db.js";
import { invitationEvents } from "./events.js";

const socketRateLimits = new Map();
const activeCollaborations = new Map();
const connectedUsers = new Map();

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
      socket.join(`user:${userId}`); 
      socket.join(`notifications:${userId}`); 
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    });

    socket.on("invitationEvent", (data) => {
      switch(data.type) {
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

    // Real-time Collaboration for Problem Solving
    socket.on("joinProblemSession", ({ problemId, userId }) => {
      socket.join(`collab:${problemId}:${userId}`);
      console.log(`User ${userId} joined problem session for ${problemId}`);
    });

    // Handle code updates during collaboration
    socket.on("codeUpdate", ({ problemId, userId, code, language }) => {
      // Broadcast to all collaborators except sender
      socket.to(`collab:${problemId}:${userId}`).emit("codeUpdate", { code, language });
    });

    // Handle cursor position updates
    socket.on("cursorUpdate", ({ problemId, userId, position }) => {
      socket.to(`collab:${problemId}:${userId}`).emit("cursorUpdate", { 
        userId, 
        position 
      });
    });

    socket.on('joinCollaboration', async ({collaborationId, userId}) => {
      try {
        const collaboration = await db.problemCollaboration.findUnique({
          where: {id: collaborationId},
          include: {
            participants: {
              select: {id: true, username: true, image: true}
            },
            problem: {
              select: { title: true }
            }
          }
        })

         if (!collaboration.participants.some(p => p.id === userId)) {
            throw new Error('User not part of this collaboration');
         }

          if (!activeCollaborations.has(collaborationId)) {
    activeCollaborations.set(collaborationId, new Set());
  }
  activeCollaborations.get(collaborationId).add(userId);

   socket.join(`collaboration:${collaborationId}`);

           // Send current collaboration data to user
        socket.emit("collaborationState", {
          id: collaboration.id,
          problemId: collaboration.problemId,
          problemTitle: collaboration.problem.title,
          code: collaboration.currentCode,
          language: collaboration.language,
          participants: collaboration.participants
        });

        // Notify others about new participant
        socket.to(`collaboration:${collaborationId}`).emit('participantJoined', {
          userId,
          username: collaboration.participants.find(p => p.id === userId)?.username
        });

        // Broadcast active participants
        io.to(`collaboration:${collaborationId}`).emit('activeParticipants', {
          participants: Array.from(activeCollaborations.get(collaborationId))
        });
      } catch (error) {
         socket.emit('collaborationError', error.message);
      }
    })

    socket.on("updateCollaborationCode", async ({ collaborationId, userId, code, language }) => {
      try {
        const collaboration = await db.problemCollaboration.findUnique({
          where: { id: collaborationId },
          include: {
            participants: {
              select: { id: true }
            }
          }
        });

        if (!collaboration.participants.some(p => p.id === userId)) {
          throw new Error('Unauthorized update');
        }

        await db.problemCollaboration.update({
          where: { id: collaborationId }, 
          data: { currentCode: code, language }
        });

        socket.to(`collaboration:${collaborationId}`).emit('codeUpdate', {
          userId,
          code,
          language
        });

      } catch (error) {
        socket.emit('collaborationError', error.message);
      }
    })

    socket.on("disconnect", () => {
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        console.log(`User ${userId} disconnected`);
        connectedUsers.delete(socket.id);
        
        // Notify collaborators about disconnection
        socket.broadcast.emit("userDisconnected", { userId });
      } else {
        console.log("Anonymous client disconnected", socket.id);
      }
    });

     // Error Handler
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  return {io, invitationEvents}
};

export default initializeSocket;