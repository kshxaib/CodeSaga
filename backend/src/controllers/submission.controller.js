import { db } from "../libs/db.js";

export const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;
        const submission = await db.submission.findMany({
            where: {
                userId
            }
        })

        return res.status(200).json({
            success: true,
            message: "All submissions fetched successfully",
            submission
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching submissions",
        })
    }
}

export const getSubmissionsForProblem = async (req, res) => {
    console.log("Fetching submissions for problem:", req.params.problemId);
    try {
        const userId = req.user.id
        const problemId = req.params.problemId;

        const submissions = await db.submission.findMany({
            where: {
                userId,
                problemId
            }
        })

        console.log("Submissions fetched:", submissions);
        return res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching submissions",
        })
    }
}

export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId
        const submission = await db.submission.count({
            where: {
                problemId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            count: submission
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching submissions",
        })
    }
}