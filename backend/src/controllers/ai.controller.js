import axios from "axios";
import { db } from "../libs/db.js";

const AI_API_KEY = process.env.AI_API_KEY;

export const getCodeCompletion = async (req, res) => {
    const userRole = req.user.role;
    try {
        if (userRole !== "PRO") {
            return res.status(403).json({
                success: false,
                message: "Only pro users can use this feature"
            })
        }

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required"
            })
        }
        const prompt = `You are an AI assistant. Continue the following ${language} code naturally. Only return a single relevant line , not the full solution. Do not repeat any line from the input.
        Code:${code}
        Next line:`;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 100,
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const completion = response.data.choices[0].message.content.trim();

        res.json({
            success: true,
            completion
        });
    } catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting AI completion'
        });
    }
}


export const getCodeReview = async (req, res) => {
    const userRole = req.user.role;
    try {
        if (userRole !== "PRO") {
            return res.status(403).json({
                success: false,
                message: "Only pro users can use this feature"
            });
        }

        const { code, language, submissionId } = req.body;

        if (!code || !language || !submissionId) {
            return res.status(400).json({
                success: false,
                message: "Code, language, and submission ID are required"
            });
        }

        // Check if submission is accepted (you'll need to implement this check)
        const submission = await checkSubmissionStatus(submissionId);
        if (!submission || submission.status !== "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Code review is only available for accepted submissions"
            });
        }

        const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide:
        1. A brief review of the code quality
        2. Suggestions for optimization (if any)
        3. Time and space complexity analysis (Big O notation)
        
        Code:
        ${code}
        
        Review:`;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const review = response.data.choices[0].message.content.trim();

        res.json({
            success: true,
            review
        });
    } catch (error) {
        console.error('AI review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting AI code review'
        });
    }
};

async function checkSubmissionStatus(submissionId) {
    try {
        const submission = await db.submission.findUnique({
            where: { id: submissionId },
            include: {
                testCases: true
            }
        });

        if (!submission) {
            return null;
        }

        const allPassed = submission.testCases.every(tc => tc.passed);
        
        return {
            status: allPassed ? "Accepted" : "Rejected",
            submission
        };
    } catch (error) {
        console.error("Error checking submission status:", error);
        return null;
    }
}