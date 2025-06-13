import { db } from "../libs/db.js"
import { cleanNullBytes, getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js"

export const createContest = async (req, res) => {
  try {
    const { name, description, startTime, endTime, maxParticipants, problemIds } = req.body
    console.log(req.user)
    const userId = req.user.id

    // Validate required fields
    if (!name || !description || !startTime || !endTime || !problemIds?.length) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

  
    // Validate dates
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: "Start time must be in the future",
      })
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      })
    }

      console.log("Received startTime:", startTime);  // Should be ISO string with 'Z'
    console.log("Parsed start:", start);


    // Verify all problems exist
    const problems = await db.problem.findMany({
      where: { id: { in: problemIds } },
      select: { id: true, title: true, difficulty: true },
    })

    if (problems.length !== problemIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some problems not found",
      })
    }

    // Create contest with problems
    const contest = await db.contest.create({
      data: {
        name,
        description,
        startTime: start,
        endTime: end,
        maxParticipants: maxParticipants || null,
        createdBy: userId,
        problems: {
          create: problemIds.map((problemId, index) => ({
            problemId,
            order: index + 1,
            points: 100, // Default points
          })),
        },
      },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      contest,
      message: "Contest created successfully",
    })
  } catch (error) {
    console.error("Create contest error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating contest",
    })
  }
}

// Get all contests
export const getAllContests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const where = {}
    if (status) {
      where.status = status
    }

    const contests = await db.contest.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        participants: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      skip: Number.parseInt(skip),
      take: Number.parseInt(limit),
    })

    const total = await db.contest.count({ where })

    // Update contest status based on current time
    const now = new Date()
    const updatedContests = contests.map((contest) => {
      let currentStatus = contest.status
      if (now < contest.startTime) {
        currentStatus = "UPCOMING"
      } else if (now >= contest.startTime && now <= contest.endTime) {
        currentStatus = "LIVE"
      } else {
        currentStatus = "COMPLETED"
      }

      return {
        ...contest,
        status: currentStatus,
        participantCount: contest.participants.length,
      }
    })

    res.status(200).json({
      success: true,
      contests: updatedContests,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get contests error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching contests",
    })
  }
}

// Get contest by ID
export const getContestById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                description: true,
                examples: true,
                constraints: true,
                testcases: true,
                codeSnippets: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: { totalScore: "desc" },
        },
      },
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    // Check if user is registered
    const isRegistered = contest.participants.some((p) => p.userId === userId)

    // Update contest status
    const now = new Date()
    let currentStatus = contest.status
    if (now < contest.startTime) {
      currentStatus = "UPCOMING"
    } else if (now >= contest.startTime && now <= contest.endTime) {
      currentStatus = "LIVE"
    } else {
      currentStatus = "COMPLETED"
    }

    res.status(200).json({
      success: true,
      contest: {
        ...contest,
        status: currentStatus,
        isRegistered,
        participantCount: contest.participants.length,
      },
    })
  } catch (error) {
    console.error("Get contest error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching contest",
    })
  }
}

// Register for contest
export const registerForContest = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    // Check if contest hasn't started
    if (new Date() >= contest.startTime) {
      return res.status(400).json({
        success: false,
        message: "Cannot register after contest has started",
      })
    }

    // Check if already registered
    const existingParticipant = contest.participants.find((p) => p.userId === userId)

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this contest",
      })
    }

    // Check max participants
    if (contest.maxParticipants && contest.participants.length >= contest.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Contest is full",
      })
    }

    // Register user
    await db.contestParticipant.create({
      data: {
        contestId: id,
        userId,
      },
    })

    res.status(200).json({
      success: true,
      message: "Successfully registered for contest",
    })
  } catch (error) {
    console.error("Register contest error:", error)
    res.status(500).json({
      success: false,
      message: "Error registering for contest",
    })
  }
}

// Get contest leaderboard
export const getContestLeaderboard = async (req, res) => {
  try {
    const { id } = req.params

    const participants = await db.contestParticipant.findMany({
      where: { contestId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: [{ totalScore: "desc" }, { joinedAt: "asc" }],
    })

    // Update rankings
    const rankedParticipants = participants.map((participant, index) => ({
      ...participant,
      rank: index + 1,
    }))

    res.status(200).json({
      success: true,
      leaderboard: rankedParticipants,
    })
  } catch (error) {
    console.error("Get leaderboard error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    })
  }
}

// Helper function to update contest rankings
const updateContestRankings = async (contestId) => {
  try {
    const participants = await db.contestParticipant.findMany({
      where: { contestId },
      orderBy: [{ totalScore: "desc" }, { joinedAt: "asc" }],
    })

    // Update ranks
    for (let i = 0; i < participants.length; i++) {
      await db.contestParticipant.update({
        where: { id: participants[i].id },
        data: { rank: i + 1 },
      })
    }
  } catch (error) {
    console.error("Update rankings error:", error)
  }
}

// Get contest statistics
export const getContestStats = async (req, res) => {
  try {
    const { id } = req.params

    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        participants: true,
        submissions: {
          include: {
            user: {
              select: { username: true },
            },
            problem: {
              select: { title: true },
            },
          },
        },
        problems: {
          include: {
            problem: {
              select: { title: true, difficulty: true },
            },
          },
        },
      },
    })

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      })
    }

    // Calculate statistics
    const totalParticipants = contest.participants.length
    const totalSubmissions = contest.submissions.length
    const acceptedSubmissions = contest.submissions.filter((s) => s.status === "Accepted").length
    const acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0

    // Problem-wise stats
    const problemStats = contest.problems.map((cp) => {
      const problemSubmissions = contest.submissions.filter((s) => s.problemId === cp.problemId)
      const problemAccepted = problemSubmissions.filter((s) => s.status === "Accepted").length

      return {
        problemId: cp.problemId,
        title: cp.problem.title,
        difficulty: cp.problem.difficulty,
        totalSubmissions: problemSubmissions.length,
        acceptedSubmissions: problemAccepted,
        acceptanceRate: problemSubmissions.length > 0 ? (problemAccepted / problemSubmissions.length) * 100 : 0,
      }
    })

    // Language distribution
    const languageStats = contest.submissions.reduce((acc, submission) => {
      acc[submission.language] = (acc[submission.language] || 0) + 1
      return acc
    }, {})

    res.status(200).json({
      success: true,
      stats: {
        totalParticipants,
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate: Math.round(acceptanceRate * 100) / 100,
        problemStats,
        languageStats,
      },
    })
  } catch (error) {
    console.error("Get contest stats error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching contest statistics",
    })
  }
}

export const getContestProblems = async (req, res) => {
  try {
    const contest = await db.contest.findUnique({
      where: { id: req.params.contestId },
      include: {
        problems: {
          include: { problem: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    res.status(200).json({
      success: true,
      problems: contest.problems,
    });
  } catch (error) {
    console.error("Error fetching contest problems:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contest problems",
    });
  }
}

export const submitContestSolution = async (req, res) => {
  try {
    const { problemId, sourceCode, language, status, score } = req.body;
    const userId = req.user.id;
    const contestId = req.params.contestId;

    const now = new Date();

    // Check if contest is live
    const contest = await db.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    if (now < new Date(contest.startTime) || now > new Date(contest.endTime)) {
      return res.status(400).json({
        success: false,
        message: "Contest is not currently active",
      });
    }

    // Check if user is registered
    const participant = await db.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "You are not registered for this contest",
      });
    }

    // Check if problem exists in contest
    const contestProblem = await db.contestProblem.findFirst({
      where: {
        contestId,
        problemId,
      },
    });

    if (!contestProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found in contest",
      });
    }

    // Check if user already has an accepted submission
    const existingAccepted = await db.contestSubmission.findFirst({
      where: {
        contestId,
        problemId,
        userId,
        status: "Accepted",
      },
    });

    if (existingAccepted) {
      return res.status(200).json({
        success: true,
        message: "You have already solved this problem. Further submissions won't be counted.",
      });
    }

    // Create submission
    const submission = await db.contestSubmission.create({
      data: {
        contestId,
        userId,
        problemId,
        sourceCode,
        language,
        status,
        score: status === "Accepted" ? score : 0,
        timeTaken: Math.floor(
          (now - new Date(contest.startTime)) / (1000 * 60)
        ),
      },
    });

    // Only update score if this submission is accepted
    if (status === "Accepted") {
      const totalScore = await db.contestSubmission.aggregate({
        where: {
          contestId,
          userId,
        },
        _sum: {
          score: true,
        },
      });

      await db.contestParticipant.update({
        where: { id: participant.id },
        data: {
          totalScore: totalScore._sum.score || 0,
        },
      });
    }

    res.status(201).json({
      success: true,
      submission,
      message: status === "Accepted"
        ? "Solution accepted and score updated"
        : "Submission recorded",
    });
  } catch (error) {
    console.error("Error submitting contest solution:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting solution",
    });
  }
};

export const getContestSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contestId, problemId } = req.params;

    const submissions = await db.contestSubmission.findMany({
      where: {
        contestId,
        userId,
        problemId,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching contest submissions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
    });
  }
};

export const getContestScore = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    // Check if user is registered for the contest
    const participant = await db.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId,
        },
      },
      select: {
        totalScore: true,
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        message: "You are not registered for this contest",
      });
    }

    res.status(200).json({
      success: true,
      score: participant.totalScore || 0,
    });
  } catch (error) {
    console.error("Error fetching contest score:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contest score",
    });
  }
};