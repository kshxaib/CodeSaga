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
  const currentUserId = req.user.id;

  if (!username) {
    return res.status(400).json({
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
      },
      take: 10,
    });

    if (users.length === 0) {
      return res.status(404).json({
        error: "No users found matching your query",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({
      error: "Internal server error while searching users",
    });
  }
};

export const followUser = async (req, res) => {
  const cuurentUserId = req.user.id;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }

  if (cuurentUserId === userId) {
    return res.status(400).json({
      error: "You cannot follow yourself",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const currentUser = await db.user.findUnique({
      where: {
        id: cuurentUserId,
      },
      include: {
        followers: true,
      },
    });

    const isFollowing = currentUser.followers.some(
      (follower) => follower.id === userId
    );
    if (isFollowing) {
      return res.status(400).json({
        error: "You are already following this user",
      });
    }

    await db.user.update({
      where: { id: cuurentUserId },
      data: {
        following: {
          connect: { id: userId },
        },
        followingCount: {
          increment: 1,
        },
      },
    });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        followers: {
          connect: { id: cuurentUserId },
        },
        followerCount: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `You are now following ${user.name}`,
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({
      error: "Internal server error while following user",
    });
  }
};

export const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }

  if (currentUserId === userId) {
    return res.status(400).json({
      error: "You cannot unfollow yourself",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const currentUser = await db.user.findUnique({
      where: {
        id: currentUserId,
      },
      include: {
        following: true,
      },
    });

    const isFollowing = currentUser.following.some(
      (following) => following.id === userId
    );

    if (!isFollowing) {
      return res.status(400).json({
        error: "You are not following this user",
      });
    }

    await db.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          disconnect: { id: userId },
        },
        followingCount: {
          decrement: 1,
        },
      },
    });

    await db.user.update({
      where: { id: userId },
      data: {
        followers: {
          disconnect: { id: currentUserId },
        },
        followerCount: {
          decrement: 1,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `You have unfollowed ${user.name}`,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({
      error: "Internal server error while unfollowing user",
    });
  }
};
