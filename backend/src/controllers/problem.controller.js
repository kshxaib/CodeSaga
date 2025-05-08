import { db } from "../libs/db.js"
import { getJudge0LangaugeId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js"

export const createProblem = async (req, res) => {
    const {title, description, difficulty, tags, examples, constraints, hints, testcases, codeSnippets, referenceSolutions} = req.body
    if(!title || !description || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !referenceSolutions) {
        return res.status(400).json({ error: "All fields are required" })
    }
 
    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LangaugeId(language)

            if(!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` })
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            const submissionResult = await submitBatch(submissions)

            const tokens = submissionResult.map((res) => res.token)

            const results = await pollBatchResults(tokens)

            for(let i=0; i<results.length; i++){
                const result = results[i]
                console.log("Result-----", result);

                if(result.status.id !== 3) {
                    return res.status(400).json({ error: `Test case ${i+1} failed for language ${language}` })
                }
            }

            // Save the problem to the database
            const newProblem = await db.problem.create({data:{title, description, hints, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId: req.user.id}})
            return res.status(201).json({ success: true, message: "Problem created successfully", problem: newProblem })
        }
        
    } catch (error) {
        res.status(500).json({error: "Error while creating problem"})
    }
}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany()

        if(!problems) {
            return res.status(404).json({ error: "No problems found" })
        }

        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems
        })
    } catch (error) {
        return res.status(500).json({ error: "Error while fetching problems" })
    }
}

export const getProblemById = async (req, res) => {
    const {id} = req.params
    if(!id) {
        return res.status(400).json({ error: "Problem ID is required" })
    }

    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id
            }
        })
        if(!problem) {
            return res.status(404).json({ error: "Problem not found" })
        }

        return res.status(200).json({ success: true, message: "Problem fetched successfully", problem })
    } catch (error) {
        return res.status(500).json({ error: "Error while fetching problem" })
    }
}

export const updateProblem = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.status(400).json({ error: "Problem ID is required" })
    }

    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id
            }
        })

        if (!problem) {
            return res.status(404).json({ error: "Problem not found" })  
        }

        if (problem.userId !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to update this problem" })
        }

        const {title, description, difficulty, tags, examples, constraints, hints, testcases, codeSnippets, referenceSolutions} = req.body

        if(!description || !title || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !referenceSolutions) {
            return res.status(400).json({ error: "All fields are required" })
        }

        // Validate reference solutions with test cases
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LangaugeId(language)

            if(!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` })
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            const submissionResult = await submitBatch(submissions)
            const tokens = submissionResult.map((res) => res.token)
            const results = await pollBatchResults(tokens)

            for(let i=0; i<results.length; i++){
                const result = results[i]
                if(result.status.id !== 3) {
                    return res.status(400).json({ 
                        error: `Test case ${i+1} failed for language ${language}`,
                        details: result
                    })
                }
            }
        }

        const updatedProblem = await db.problem.update({
            where: {
                id: id
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
                referenceSolutions
            }
        })

        return res.status(200).json({ 
            success: true, 
            message: "Problem updated successfully", 
            problem: updatedProblem 
        })
        
    } catch (error) {
        console.error("Error updating problem:", error);
        return res.status(500).json({ error: "Error while updating problem" })
    }
}

export const deleteProblem = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.status(400).json({ error: "Problem ID is required" })
    }

    try {
        const problem = await db.problem.findUnique({
            where: {
                id: id
            }
        })

        if(!problem){
            return res.status(404).json({ error: "Problem not found" })
        }

        if(problem.userId !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to delete this problem" })
        }

        await db.problem.delete({
            where: {
                id: id
            }
        })

        return res.status(200).json({ success: true, message: "Problem deleted successfully" })

    } catch (error) {
        return res.status(500).json({ error: "Error while deleting problem" })
    }

}

export const getAllProblemsSolvedByUser = async (req, res) => {}