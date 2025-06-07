import { db } from "../libs/db.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import { uploadOnCloudinary } from "../libs/cloudinary.js";
import dayjs from "dayjs";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getUserDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const [
      totalSubmissions,
      acceptedSubmissions,
      problemsSolved,
      recentSolvedProblems,
      totalContests,
      contestsWon,
      contestRanks,
      contestScores,
      devLogs,
      discussions,
      replies,
      upvotesReceived,
      reports,
      testCaseStats,
      userSubmissions,
      playlistsCreated,
      playlistsPurchased,
      solvedProblemsWithTags,
    ] = await Promise.all([
      db.submission.count({ where: { userId } }),
      db.submission.count({ where: { userId, status: "Accepted" } }),
      db.problemSolved.count({ where: { userId } }),
      db.problemSolved.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { problem: true },
      }),
      db.contestParticipant.count({ where: { userId } }),
      db.contestParticipant.count({ where: { userId, rank: 1 } }),
      db.contestParticipant.findMany({
        where: { userId, rank: { not: null } },
        select: { rank: true },
      }),
      db.contestParticipant.findMany({
        where: { userId },
        orderBy: { joinedAt: "asc" },
        select: { totalScore: true, joinedAt: true },
      }),
      db.devLog.findMany({ where: { userId } }),
      db.discussionMessage.count({ where: { userId } }),
      db.discussionReply.count({ where: { userId } }),
      db.discussionUpvote.count({ where: { message: { userId } } }),
      db.problemReport.groupBy({
        by: ["status"],
        where: { userId },
        _count: { _all: true },
      }),
      db.testCaseResult.groupBy({
        by: ["passed"],
        where: { submission: { userId } },
        _count: { _all: true },
      }),
      db.submission.findMany({
        where: { userId },
        select: { memory: true, time: true },
      }),
      db.playlist.count({ where: { userId } }),
      db.playlistPurchase.count({ where: { userId } }),
      db.problemSolved.findMany({
        where: { userId },
        include: { problem: true },
      }),
    ]);

    // Manual calculation of average memory and time from strings
    const memoryNumbers = [];
    const timeNumbers = [];

    for (const submission of userSubmissions) {
      if (submission.memory) {
        try {
          const memoryArr = JSON.parse(submission.memory);
          memoryArr.forEach((val) => {
            const num = parseInt(val.replace(/\D/g, ""));
            if (!isNaN(num)) memoryNumbers.push(num);
          });
        } catch (e) {}
      }

      if (submission.time) {
        try {
          const timeArr = JSON.parse(submission.time);
          timeArr.forEach((val) => {
            const num = parseFloat(val.replace(/[^\d.]/g, ""));
            if (!isNaN(num)) timeNumbers.push(num);
          });
        } catch (e) {}
      }
    }

    const avg = (arr) =>
      arr.length > 0 ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3)) : null;

    const averageMemory = avg(memoryNumbers); // In KB
    const averageTime = avg(timeNumbers);     // In sec

    const averageRank =
      contestRanks.length > 0
        ? contestRanks.reduce((sum, r) => sum + (r.rank ?? 0), 0) / contestRanks.length
        : null;

    const tagCounts = {};
    for (const item of solvedProblemsWithTags) {
      for (const tag of item.problem.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    return res.status(200).json({
      user: {
        profile: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          bio: user.bio,
          linkedin: user.linkedin,
          portfolio: user.portfolio,
          role: user.role,
          proSince: user.proSince,
          memberSince: user.createdAt,
        },
        activity: {
          totalSubmissions,
          acceptedSubmissions,
          problemsSolved,
          recentSolvedProblems,
          streak: {
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            lastSolvedDate: user.lastSolvedDate,
          },
        },
        contests: {
          totalContests,
          contestsWon,
          bestRank: Math.min(...contestRanks.map((r) => r.rank ?? Infinity)),
          averageRank,
          scoreTimeline: contestScores,
        },
        testCases: {
          passed: testCaseStats.find((t) => t.passed === true)?._count._all || 0,
          failed: testCaseStats.find((t) => t.passed === false)?._count._all || 0,
          averageMemory,
          averageTime,
        },
        contributions: {
          devLogsWritten: devLogs.length,
          devLogUpvotes: devLogs.reduce((sum, log) => sum + log.upvotes, 0),
          discussions,
          replies,
          upvotesReceived,
          reports,
          playlistsCreated,
          playlistsPurchased,
        },
        tags: Object.entries(tagCounts).map(([tag, count]) => ({ tag, count })),
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { bio, linkedin, portfolio } = req.body;
  const { id } = req.user;

  if (!bio && !linkedin && !portfolio && !req.file) {
    return res.status(400).json({
      success: false,
      message: "At least one field or an image is required for update",
    });
  }

  if (bio && bio.length > 200) {
    return res.status(400).json({
      success: false,
      message: "Bio should be less than 200 characters",
    });
  }

  if (linkedin && !linkedin.startsWith("https://www.linkedin.com/")) {
    return res.status(400).json({
      success: false,
      message: "LinkedIn URL must start with https://www.linkedin.com/",
    });
  }

  if (!id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let imageUrl = user.image;
    if (req.file) {
      const imageLocalPath = req.file.path;

      if (!imageLocalPath) {
        console.error("No file path found in uploaded file");
        return res.status(400).json({
          success: false,
          message: "Invalid file upload",
        });
      }

      const uploadResult = await uploadOnCloudinary(imageLocalPath);

      if (!uploadResult) {
        console.error("Cloudinary upload failed");
        return res.status(400).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }

      imageUrl = uploadResult.secure_url;
    }

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (req.file) updateData.image = imageUrl;

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        image: updatedUser.image,
        bio: updatedUser.bio,
        linkedin: updatedUser.linkedin,
        portfolio: updatedUser.portfolio,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating profile",
    });
  }
};

export const searchUser = async (req, res) => {
  const { username } = req.query;
  const currentUserId = req.user?.id;

  console.log("Authenticated user:", req.user);

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Username query parameter is required",
    });
  }

  try {
    const users = await db.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
        NOT: {
          id: currentUserId,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
      },
      take: 10,
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No users found matching your query",
      });
    }

    const result = users.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
    }));

    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      users: result,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while searching users",
    });
  }
};

export const initiateProUpgrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role.includes("PRO")) {
      return res.status(400).json({ success: false, message: "User is already PRO" });
    }

    const receipt = `pro_upgrade_${userId.slice(0, 10)}`;
    const options = {
      amount: 29900, // ₹299 in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId,
        type: "PRO_UPGRADE",
      }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Error initiating PRO upgrade:", error);
    return res.status(500).json({
      success: false,
      message: "Error while initiating payment",
    });
  }
};

export const verifyProUpgrade = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for payment verification",
      });
    }

    const userId = req.user.id;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (user.role.includes("PRO")) {
      return res.status(200).json({
        success: true,
        message: "User is already PRO",
      });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        role: "PRO",
        proSince: new Date()
      },
    });

    return res.status(200).json({
      success: true,
      message: "PRO upgrade successful",
      user: updatedUser,
    });

  } catch (error) {
    console.error("PRO upgrade verification error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during PRO upgrade",
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const totalSolved = await prisma.problemSolved.count({
      where: { userId },
    });

    const todayStart = dayjs().startOf("day").toDate();
    const solvedToday = await prisma.problemSolved.count({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastSolvedDate: true,
      },
    });

    const totalSubmissions = await prisma.submission.count({
      where: { userId },
    });

    const correctSubmissions = await prisma.submission.count({
      where: {
        userId,
        status: "Accepted",
      },
    });

    const accuracy = totalSubmissions
      ? Math.round((correctSubmissions / totalSubmissions) * 100)
      : 0;

    const rankedUsers = await prisma.user.findMany({
      orderBy: { problemSolved: { _count: "desc" } },
      select: { id: true },
    });

    const rank = rankedUsers.findIndex((u) => u.id === userId) + 1;
    const rankPercentile = Math.round((rank / rankedUsers.length) * 100);
    const stats = {
      solved: totalSolved,
      solvedToday,
      streak: user?.currentStreak ?? 0,
      longestStreak: user?.longestStreak ?? 0,
      accuracy,
      rank,
      rankPercentile,
    }
    console.log(stats)
    return res.json({
      success: true,
      message: "User stats fetched successfully",
      stats
    });
  } catch (err) {
    console.error("[getUserStats]", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats"
    });
  }
};