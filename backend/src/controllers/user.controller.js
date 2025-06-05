import { db } from "../libs/db.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import { uploadOnCloudinary } from "../libs/cloudinary.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,  
});

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