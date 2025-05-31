import { Server } from "socket.io";
import { db } from "./db.js";

const socketRateLimits = new Map();

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

    socket.on("joinDiscussion", async (problemId) => {
      try {
        socket.join(`problem:${problemId}`);
        console.log(`Client ${socket.id} joined problem discussion: ${problemId}`);

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

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};

export default initializeSocket;