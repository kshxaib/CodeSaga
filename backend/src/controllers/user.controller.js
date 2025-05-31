import { db } from "../libs/db.js";
import { uploadOnCloudinary } from "../libs/cloudinary.js";

export const check = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        image: true,
        bio: true,
        linkedin: true,
        portfolio: true,
        followerCount: true,
        followingCount: true,
        longestStreak: true,
        currentStreak: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user,
    });
  } catch (error) {
    throw new Error("Unauthorized access");
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
        followerCount: updatedUser.followerCount,
        followingCount: updatedUser.followingCount,
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
        followerCount: true,
        followingCount: true,
        followers: {
          where: {
            followerId: currentUserId,
          },
          select: {
            id: true,
          },
        },
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
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      isFollowing: user.followers.length > 0,
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

export const followUser = async (req, res) => {
  const currentUserId = req.user.id;
  const userId = decodeURIComponent(req.params.userId);

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  if (currentUserId === userId) {
    return res.status(400).json({ success: false, message: "You cannot follow yourself" });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ success: false, message: "You are already following this user" });
    }

    const [follow, currentUserUpdated, userUpdated] = await db.$transaction([
      db.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      }),
      db.user.update({
        where: { id: currentUserId },
        data: { followingCount: { increment: 1 } },
      }),
      db.user.update({
        where: { id: userId },
        data: { followerCount: { increment: 1 } },
      }),
    ]);

    const currentUser = await db.user.findUnique({ where: { id: currentUserId } });

    const notification = await db.notification.create({
      data: {
        userId,
        type: 'NEW_FOLLOWER',
        content: `${currentUser.username} started following you!`,
        referenceId: currentUserId,
      },
    });

    req.io.to(`notifications:${userId}`).emit('newNotification', notification);
    req.io.to(`notifications:${userId}`).emit('newFollower', {
      followerId: currentUserId,
      followerUsername: currentUser.username,
    });

    return res.status(200).json({
      success: true,
      message: `You are now following ${user.name}`,
      followedUser: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        followerCount: userUpdated.followerCount,
        followingCount: userUpdated.followingCount,
        isFollowing: true,
      },
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ success: false, message: "Internal server error while following user" });
  }
};

export const unfollowUser = async (req, res) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (currentUserId === userId) {
    return res.status(400).json({ error: "You cannot unfollow yourself" });
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    await db.user.update({
      where: { id: currentUserId },
      data: { followingCount: { decrement: 1 } },
    });
    await db.user.update({
      where: { id: userId },
      data: { followerCount: { decrement: 1 } },
    });

    return res.status(200).json({
      success: true,
      message: `You have unfollowed ${user.name}`,
      unfollowedUser: {
        id: user.id,
        username: user.username,
        name: user.name,
        image: user.image,
        isFollowing: false,
      },
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ error: "Internal server error while unfollowing user" });
  }
};

export const fetchFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await db.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
    });

    if (!followers.length) {
      return res.status(404).json({
        success: false,
        message: "No followers found",
      });
    }

    const followerIds = followers.map(f => f.follower.id);

    const followingOfCurrentUser = await db.follow.findMany({
      where: {
        followerId: userId,
        followingId: { in: followerIds },
      },
      select: { followingId: true },
    });

    const followingSet = new Set(followingOfCurrentUser.map(f => f.followingId));

    const followerUsers = followers.map(f => ({
      ...f.follower,
      isFollowing: followingSet.has(f.follower.id),
    }));

    return res.status(200).json({
      success: true,
      message: "Followers fetched successfully",
      followers: followerUsers,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({
      error: "Internal server error while fetching followers",
    });
  }
};

export const fetchFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await db.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
    });

    if (!following.length) {
      return res.status(404).json({
        success: false,
        message: "Not following anyone yet",
      });
    }

    const followingUsers = following.map(f => f.following);

    return res.status(200).json({
      success: true,
      message: "Following list fetched successfully",
      following: followingUsers,
    });
  } catch (error) {
    console.error("Error fetching following list:", error);
    return res.status(500).json({
      error: "Internal server error while fetching following list",
    });
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.user?.id;

  try {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        followers: {
          where: { followerId: currentUserId },
          select: { followerId: true }
        },
        _count: {
          select: {
            followers: true,
            following: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = user.followers.length > 0;
    delete user.followers;

    return res.status(200).json({
      user: {
        ...user,
        isFollowing,
        followerCount: user._count.followers,
    followingCount: user._count.following
      }
    });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}