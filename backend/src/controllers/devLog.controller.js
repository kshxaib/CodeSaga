import { db } from "../libs/db.js";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export const createDevLog = async (req, res) => {
    const userId = req.user.id
    const { title, tags, description, isAnonymous } = req.body
    if (!title || !tags || !description) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const devLog = await db.devLog.create({
            data: {
                title,
                tags,
                description,
                isAnonymous,
                userId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Dev log created successfully",
            devLog
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while creating dev log"
        })
    }
}

export const getDevLogs = async (req, res) => {
    const { filter } = req.query
    try {
        const orderBy = filter === 'upvoted' ? { upvotes: 'desc' } : { createdAt: 'desc' }
        const devLogs = await db.devLog.findMany({
            orderBy,
            include: {
                user: true,
                reactions: true,
            },
        })
        return res.status(200).json({
            success: true,
            message: "Dev logs fetched successfully",
            devLogs
        })
    } catch (error) {
        console.error(error)
        return res.status(200).json({
            success: false,
            message: "Error while fetching dev logs"
        })
    }
}

export const getMyDevLogs = async (req, res) => {
    try {
        const devLogs = await db.devLog.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                reactions: true,
            },
        })

        return res.status(200).json({
            success: true,
            message: "My dev logs fetched successfully",
            devLogs
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while fetching my dev logs"
        })
    }
}

export const reactToDevLog = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
    try {
        const existingReaction = await prisma.devLogReaction.findFirst({
            where: {
                devLogId: id,
                userId: req.user.id,
                type,
            },
        });

        if (existingReaction) {
            await db.devLogReaction.delete({
                where: {
                    id: existingReaction.id
                }
            })

            return res.status(200).json({
                success: true,
                message: "Reaction removed",
            })
        } else {
            await db.devLogReaction.create({
                data: {
                    devLogId: id,
                    userId: req.user.id,
                    type,
                },
            });
            return res.status(201).json({
                success: true,
                message: 'Reaction added.'
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while reacting to dev log"
        });
    }
}

export const generateDescription = async (req, res) => {
    const { title, tags } = req.body;
    const prompt = `Provide 3 concise DevLog descriptions for a post titled "${title}" with tags ${tags.join(', ')}.`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                timeout: 10000,
            }
        );
        const suggestions = response.data.candidates[0].content.parts[0].text
            .split('\n')
            .filter((line) => line.trim() !== '');

        return res.status(200).json({
            success: true,
            message: "Suggestions fetched successfully",
            suggestions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching suggestions",
        })
    }
}