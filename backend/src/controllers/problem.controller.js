import { db } from "../libs/db.js";
import {
  getJudge0LangaugeId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import Fuse from "fuse.js";
import { cleanNullBytes } from "../libs/judge0.lib.js";


export const createProblem = async (req, res) => {
 req.body = cleanNullBytes(req.body);

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    testcases,
    codeSnippets,
    referenceSolutions,
    editorial,
  } = req.body;

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LangaugeId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);

      const tokens = submissionResult.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              message: `Test case ${i + 1} failed for language ${language}`,
            });
        }
      }

      // Save the problem to the database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          hints,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          editorial,
          referenceSolutions,
          userId: req.user.id,
        },
      });
      return res
        .status(201)
        .json({
          success: true,
          message: "Problem created successfully",
          problem: newProblem,
        });
    }
  } catch (error) {
      console.error("Error while creating problem", error);
    res.status(500).json({ message: "Error while creating problem" });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json({ message: "No problems found" });
    }

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching problems" });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
      include: {
    solvedBy: true,
  },
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Problem fetched successfully",
        problem,
      });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching problem" });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const cleanedBody = cleanNullBytes(req.body);

  if (!id) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this problem" });
    }

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      testcases,
      codeSnippets,
      editorial,
      referenceSolutions,
    } = cleanedBody;

    if (
      !description ||
      !title ||
      !difficulty ||
      !tags ||
      !examples ||
      !constraints ||
      !testcases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate reference solutions with test cases
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LangaugeId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            message: `Test case ${i + 1} failed for language ${language}`,
            details: result,
          });
        }
      }
    }

    const updatedProblem = await db.problem.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        testcases,
        codeSnippets,
        referenceSolutions,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({ message: "Error while updating problem" });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this problem" });
    }

    await db.problem.delete({
      where: {
        id: id,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Problem deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error while deleting problem" });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json({ message: "No problems found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while fetching problems",
    });
  }
};
export const searchProblems = async (req, res) => {
  const { search } = req.query;

  try {
    const searchLower = search.toLowerCase();
    const searchUpper = searchLower.toUpperCase();
    const DIFFICULTY_ENUM = ["EASY", "MEDIUM", "HARD"]; 
    const isValidDifficulty = DIFFICULTY_ENUM.includes(searchUpper);

    // Get all problems for fuzzy matching
    const allProblems = await db.problem.findMany();

    const fuse = new Fuse(allProblems, {
      keys: ["title", "description", "tags"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    // Perform fuzzy search
    let results = fuse.search(searchLower).map((r) => r.item);

    // If valid difficulty, filter it in as well
    if (isValidDifficulty) {
      results = results.filter((p) => p.difficulty === searchUpper);
    }

    return res.status(200).json({
      success: true,
      message: results.length ? "Search results" : "No matching problems found",
      problems: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      message: "Search failed",
    });
  }
};

export const getRecommendedProblems = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const solvedProblems = await db.problemSolved.findMany({
      where: {
        userId: currentUserId,
      },
      include: {
        problem: {
          select: {
            tags: true,
          },
        },
      },
    });

    const userTags = solvedProblems.flatMap((sp) => sp.problem.tags);
    const uniqueTags = [...new Set(userTags)];

    let recommended = await db.problem.findMany({
      where: {
        AND: [
          { tags: { hasSome: uniqueTags } },
          { NOT: { solvedBy: { some: { userId: currentUserId } } } },
        ],
      },
      take: 5,
    });

    if (recommended.length === 0) {
      recommended = await db.problem.findMany({
        where: {
          NOT: { solvedBy: { some: { userId: currentUserId } } },
        },
        take: 5,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recommended problems fetched successfully",
      recommended,
    });
  } catch (error) {
    console.error("Error fetching recommended problems:", error);
    return res.status(500).json({
      message: "Internal server error while fetching recommended problems",
    });
  }
};

export const reactToProblem = async (req, res) => {
  const {isLike, problemId } = req.body;
  const userId = req.user.id;

  if(!userId){
    return res.status(400).json({ message: "Please login to react" });
  }

  if(!problemId){
    return res.status(400).json({ message: "Problem ID is required" });
  }

  if (typeof isLike !== 'boolean') {
    return res.status(400).json({ message: "Invalid reaction" });
  }

  try {
    const existingReaction = await db.problemReaction.findUnique({
      where: {problemId_userId: { problemId, userId }},
    });
    
    let likeChange = 0
    let dislikeChange = 0

    if(!existingReaction){
      await db.problemReaction.create({
        data: {userId, problemId, isLike}
      })
      likeChange = isLike ? 1 : 0
      dislikeChange = isLike ? 0 : 1
    } else if(existingReaction.isLike !== isLike){
      await db.problemReaction.update({
        where : {id: existingReaction.id},
        data: {isLike}
      })
      likeChange = isLike ? 1 : -1
      dislikeChange = isLike ? -1 : 1
    }

    if(likeChange !== 0 || dislikeChange !== 0 ){
      await db.problem.update({
        where: {id: problemId},
        data: {
          likes: {
            increment: likeChange
          },
          dislikes: {
            increment: dislikeChange
          }
        }
      })
    }

    const problem = await db.problem.findUnique({
      where: {id: problemId},
      select: {
        likes: true,
        dislikes: true,
      }
    })

    return res.status(200).json({
      success: true,
      message: `${isLike ? 'Liked' : 'Disliked'} successfully`,
      problem,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

export const getRandomProblem = async (req, res) => {
  try {
    const totalProblems = await db.problem.count();

    if(totalProblems === 0) {
      return res.status(404).json({ success: false, message: "No problems available" });
    }

    const randomIndex = Math.floor(Math.random() * totalProblems);

    const randomProblem = await db.problem.findFirst({
      skip: randomIndex,
      take: 1,
    });
    
    return res.status(200).json({
      success: true,
      message: "Random problem fetched successfully",
      problem: randomProblem,
    });
  } catch (error) {
    console.error('Error fetching random problem:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export const checkProblemInPlaylist = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;

  try {
    const found = await db.problemInPlaylist.findFirst({
      where: {
        problemId: problemId,
        playlist: {
          userId: userId,
        },
      },
    });

    if(!found) {
      return res.status(200).json({ 
        success: true,
        exists: false 
      });
    }

    return res.status(200).json({ 
      success: true,
      exists: true 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong" 
    });
  }
};
