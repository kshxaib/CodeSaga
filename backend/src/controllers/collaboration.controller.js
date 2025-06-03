import { db } from "../libs/db.js";
import { activeCollaborations } from "../libs/socketHandler.js";

export const getCollaboration = async (req, res) => {
    try {
        const { collaborationId } = req.params;
        const userId = req.user.id;

        const collaboration = await db.problemCollaboration.findUnique({
            where: { id: collaborationId },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                },
                problem: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        codeSnippets: true
                    }
                }
            }
        });

        if (!collaboration || !collaboration.participants.some(p => p.id === userId)) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this collaboration"
            });
        }

        return res.status(200).json({
            success: true,
            collaboration
        });

    } catch (error) {
        console.error("Error getting collaboration:", error);
        res.status(500).json({
            success: false,
            message: "Error getting collaboration"
        });
    }
};

export const updateCollaborationCode = async (req, res) => {
    try {
        const { collaborationId } = req.params;
        const userId = req.user.id;
        const { code, language } = req.body;

        const collaboration = await db.problemCollaboration.findUnique({
            where: { id: collaborationId },
            include: {
                participants: true
            }
        });

        if (!collaboration || !collaboration.participants.some(p => p.id === userId)) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this collaboration"
            });
        }

        const updatedCollaboration = await db.problemCollaboration.update({
            where: { id: collaborationId },
            data: { currentCode: code, language },
            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        image: true
                    }
                }
            }
        });

        // Broadcast the update to all collaboration participants
        req.io.to(`collaboration:${collaborationId}`).emit("codeUpdated", {
            code,
            language,
            updatedBy: userId,
            timestamp: new Date()
        });

        return res.status(200).json({
            success: true,
            collaboration: updatedCollaboration
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update collaboration'
        });
    }
};

export const leaveCollaboration = async (req, res) => {
    try {
        const { collaborationId } = req.params;
        const userId = req.user.id;

        const collaboration = await db.problemCollaboration.findUnique({
            where: { id: collaborationId },
            include: { participants: true }
        });

        if (!collaboration || !collaboration.participants.some(p => p.id === userId)) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this collaboration"
            });
        }

        await db.problemCollaboration.update({
            where: { id: collaborationId },
            data: {
                participants: {
                    disconnect: { id: userId }
                }
            }
        });

        req.io.to(`collaboration:${collaborationId}`).emit("participantLeft", {
            userId,
            username: req.user.username,
            activeParticipants: Array.from(activeCollaborations.get(collaborationId) || [])
        });

        return res.status(200).json({
            success: true,
            message: "Left collaboration successfully"
        });

    } catch (error) {
        console.error("Error leaving collaboration:", error);
        res.status(500).json({
            success: false,
            message: "Error leaving collaboration"
        });
    }
};

export const createCollaboration = async (req, res) => {
    try {
        const { problemId } = req.body;
        const userId = req.user.id;

        const problem = await db.problem.findUnique({
            where: { id: problemId }
        });

        if (!problem) {
            return res.status(404).json({ success: false, message: "Problem not found" });
        }

        const existingCollab = await db.problemCollaboration.findFirst({
            where: {
                problemId,
                participants: {
                    some: { id: userId }
                }
            }
        });

        if (existingCollab) {
            return res.status(200).json({
                success: true,
                collaborationId: existingCollab.id
            });
        }

        const newCollab = await db.problemCollaboration.create({
            data: {
                problem: { connect: { id: problemId } },
                participants: { connect: { id: userId } },
                currentCode: problem?.codeSnippets?.JAVASCRIPT || "",
                language: "JAVASCRIPT"
            }
        });

        return res.status(201).json({
            success: true,
            collaborationId: newCollab.id
        });
    } catch (error) {
        console.error("Failed to create collaboration:", error);
        res.status(500).json({ success: false, message: "Error creating collaboration" });
    }
};

export const joinCollaboration = async (req, res) => {
    try {
        const { collaborationId } = req.params
        const userId = req.user.id

        const collaboration = await db.problemCollaboration.findUnique({
            where: { id: collaborationId },
            include: {
                participants: true,
                initiator: true
            }
        })

        if (!collaboration) {
            return res.status(404).json({
                success: false,
                message: "Collaboration not found"
            })
        }

        const isAlreadyParticipant = collaboration.participants.some(p => p.id === userId)

        if (isAlreadyParticipant) {
            return res.status(200).json({ success: true, message: "Already a participant" });
        }
        await db.problemCollaboration.update({
            where: { id: collaborationId },
            data: {
                participants: {
                    connect: { id: userId }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Initiator joined the collaboration successfully"
        });
    } catch (error) {
        console.error("Error joining collaboration:", error);
        res.status(500).json({
            success: false,
            message: "Error joining collaboration"
        });

    }
}