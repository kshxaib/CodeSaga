import bcrypt from 'bcryptjs';
import {db} from '../libs/db.js'
import {UserRole} from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import { generateCodeForEmail } from '../libs/generateCode.js';
import { forgotPasswordGenContent, sendMail } from '../libs/mail.js';

export const register = async (req, res) => {
    const {email, password, name} = req.body

    if(!email || !password || !name) {
        return res.status(400).json({error: "All fields are required"})
    }

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        })

        if(existingUser) {
            return res.status(409).json({error: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data: {
                email, 
                password: hashedPassword,
                name,
                role: UserRole.USER  
            }
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser?.image,
            }
        })

    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({error: "All fields are required"})
    }

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user?.image,
            }
        })

    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict'
        })

        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        })
    } catch (error) {
        throw new Error("Unauthorized access")
    }
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body

    if(!email){
        return res.status(400).json({error: "Email is required"})
    } 

    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const code = generateCodeForEmail() 
        
         await db.user.update({
      where: { email },
      data: {
        forgotPasswordOtp: code,
        forgotPasswordOtpExpiry: new Date(Date.now() + 15 * 60 * 1000), 
      },
    });

        const mailGenContent = forgotPasswordGenContent(user.name, code)

        //sending email
        await sendMail({
            email: user.email,
            subject: "Password Reset Code",
            mailGenContent
        })

        return res.status(200).json({
            success: true,
            message: "Password reset code sent to your email",
        })
    } catch (error) {
        console.error("Error sending email:", error)
        return res.status(500).json({error: "Error sending email"})
    }
}