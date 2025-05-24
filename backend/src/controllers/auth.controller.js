import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { generateCodeForEmail } from "../libs/generateCode.js";
import { sendEmail } from "../libs/mail.js";
import { OAuth2Client } from "google-auth-library";
import verifyGoogleToken from "../libs/googleAuth.js";
import {generatePassword} from "../libs/generatePassword.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  const { email, password, name, username } = req.body;

  if ([email, password, name, username].some((filed) => filed?.trim() === "")) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingEmailUser = await db.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Check if username already exists
    const existingUsernameUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUsernameUser) {
      return res.status(409).json({ message: "Username already taken" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = generateCodeForEmail();

    await db.user.update({
      where: { email },
      data: {
        forgotPasswordOtp: code,
        forgotPasswordOtpExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendEmail(user.name, email, code, "Reset Your Password");

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email } = req.params;
  const { code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      message: "Email and code are required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    if (user.forgotPasswordOtp !== code) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    if (user.forgotPasswordOtpExpiry < new Date()) {
      return res.status(400).json({
        message: "Code expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const changePassword = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        forgotPasswordOtp: null,
        forgotPasswordOtpExpiry: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Error changing password",
    });
  }
};

export const checkUniqueUsername = async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must be at least 3 characters",
    });
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "Username is already taken",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Username check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during username check",
    });
  }
};

export const googleRegister = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const payload = await verifyGoogleToken(token);
    const { email, name, picture, sub } = payload;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login instead.',
      });
    }

    // Generate username
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let count = 1;
    
    while (await db.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${count}`;
      count++;
    }

    const randomPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        image: picture,
        role: 'USER',
        provider: 'GOOGLE',
      },
    });

    const jwtToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000, 
    });

    const emailSubject = "Welcome to LogicVerse - Your Account Details";
   await sendEmail(name, email, null, emailSubject, randomPassword);

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        image: newUser.image,
      },
    });

  } catch (error) {
    console.error('Google registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false,
      message: "Google token is required" 
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email;

    if (!googleEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email not found in Google token" 
      });
    }

    const user = await db.user.findUnique({
      where: { email: googleEmail },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this Google email. Please register first." 
      });
    }

    if (!user.provider) {
      return res.status(403).json({
        success: false,
        message: "This email was registered normally. Please login with password."
      });
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user?.image,
      },
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Invalid Google token" 
    });
  }
};