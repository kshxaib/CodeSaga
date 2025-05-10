import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { generateCodeForEmail } from "../libs/generateCode.js";
import { sendEmail } from "../libs/mail.js";
import { uploadOnCloudinary } from "../libs/cloudinary.js";

export const register = async (req, res) => {
  const { email, password, name, username } = req.body;

  if ([email, password, name, username].some((filed) => filed?.trim() === "")) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingEmailUser = await db.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Check if username already exists
    const existingUsernameUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUsernameUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: username.toLowerCase(),
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await sendEmail(newUser.name, email, "", "Welcome to LogicVerse");

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        image: newUser?.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user?.image,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const code = generateCodeForEmail();

    await db.user.update({
      where: { email },
      data: {
        forgotPasswordOtp: code,
        forgotPasswordOtpExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendEmail(user.name, email, code, 'Reset Your Password');

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
};

export const verifyOtp = async (req, res) => {
  const {email} = req.params
  const {code} = req.body

  if(!email || !code){
    return res.status(400).json({
      error: "Email and code are required"
    })
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    if(!user){
      return res.status(404).json({
        error: "User does not exist"
      })
    }

    if(user.forgotPasswordOtp !== code){
      return res.status(400).json({
        error: "Invalid code"
      })
    }

    if(user.forgotPasswordOtpExpiry < new Date()){
      return res.status(400).json({
        error: "Code expired"
      })
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    })

  } catch(error){
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Error verifying OTP" });
  }
   
}

export const changePassword = async (req, res) => {
    const {email} = req.params
    const {newPassword, confirmPassword} = req.body

    if(!email || !newPassword || !confirmPassword){
      return res.status(400).json({
        error: "All fields are required"
      })
    }

    try {
      const user = await db.user.findUnique({
        where: {
          email
        }
      })

      if(!user){
        return res.status(404).json({
          error: "User does not exist"
        })
      }

      if(newPassword !== confirmPassword){
        return res.status(400).json({
          error: "Passwords do not match"
        })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await db.user.update({
        where: {
          email
        },
        data: {
          password: hashedPassword,
          forgotPasswordOtp: null,
          forgotPasswordOtpExpiry: null
        }
      })

      return res.status(200).json({
        success: true,
        message: "Password changed successfully"
      })

    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({
        error: "Error changing password"
      })
    }
}
