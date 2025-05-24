import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.route.js";
import executeRoutes from "./routes/execute.routes.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import userRoutes from "./routes/user.route.js";
import reportRoutes from "./routes/report.route.js";

import { db } from "./libs/db.js";

dotenv.config();
const app = express();

// HTTP server for Socket.IO
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Custom rate limiting implementation for Socket.IO
const socketRateLimits = new Map();

const checkRateLimit = (socket) => {
  const ip = socket.handshake.address;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const max = 100; // Max 100 requests per window

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

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // Apply rate limiting to socket events
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

    // Broadcast to others in the room EXCEPT the sender
    socket.to(`problem:${problemId}`).emit("newMessage", message);
    // Send just to the sender via callback
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

    // Broadcast to others in the room EXCEPT the sender
    socket.to(`problem:${reply.message.discussion.problemId}`).emit("newReply", reply);
    // Send just to the sender via callback
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

// Middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// API routes
app.get("/", (req, res) => {
  res.send("Welcome to the CodeSaga 🔥");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/problems/report", reportRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io is ready at ws://localhost:${PORT}/socket.io`);
});