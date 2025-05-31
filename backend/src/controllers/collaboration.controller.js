import { db } from "../libs/db.js";

export const getCollaborationByProblem = async (req, res) => {
    try {
        const { problemId } = req.query;
        const userId = req.user.id;

        const collaboration = await db.problemCollaboration.findFirst({
            where: { 
                problemId,
                participants: { some: { id: userId } }
            },
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

        if (!collaboration) {
            return res.status(404).json({ 
                success: false, 
                message: 'No collaboration found for this problem' 
            });
        }

        return res.json({
            success: true,
            data: {
                id: collaboration.id,
                problemId: collaboration.problemId,
                participants: collaboration.participants,
                currentCode: collaboration.currentCode,
                language: collaboration.language,
                maxParticipants: collaboration.maxParticipants
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

export const getCollaborationById = async (req, res) => {
    try {
        const { collaborationId } = req.params;
        const userId = req.user.id;

        const collaboration = await db.problemCollaboration.findUnique({
            where: { 
                id: collaborationId,
                participants: { some: { id: userId } }
            },
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
                        title: true
                    }
                }
            }
        });

        if (!collaboration) {
            return res.status(404).json({ 
                success: false, 
                message: 'Collaboration not found or access denied' 
            });
        }

        return res.json({
            success: true,
            data: {
                id: collaboration.id,
                problemId: collaboration.problemId,
                problemTitle: collaboration.problem.title,
                participants: collaboration.participants,
                currentCode: collaboration.currentCode,
                language: collaboration.language,
                maxParticipants: collaboration.maxParticipants
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
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
                participants: {
                    select: { id: true }
                }
            }
        });

        if (!collaboration.participants.some(p => p.id === userId)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this collaboration'
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

        return res.json({
            success: true,
            data: {
                id: updatedCollaboration.id,
                currentCode: updatedCollaboration.currentCode,
                language: updatedCollaboration.language,
                participants: updatedCollaboration.participants
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to update collaboration' 
        });
    }
};