import { db } from "../libs/db.js"
import { getJudge0LangaugeId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js"

export const createProblem = async (req, res) => {
    const {title, description, difficulty, tags, examples, constraints, hints, testcases, codeSnippets, refrenseSolutions} = req.body
    if(!title || !description || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !refrenseSolutions) {
        return res.status(400).json({ error: "All fields are required" })
    }

    if(req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "You are not authorized to create a problem" })
    }
 
    try {
        for(const [language, solutionCode] of Object.entries(refrenseSolutions)){
            const languageId = getJudge0LangaugeId(language)

            if(!languageId) {
                return res.status(400).json({ error: `Language ${language} is not supported` })
            }

            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_ouput: output
            }))

            const submissionResult = await submitBatch(submissions)

            const tokens = submissionResult.map((res) => res.token)

            const results = await pollBatchResults(tokens)

            for(let i=0; i<results.length; i++){
                const {status} = results[i]

                if(status.id !== 3) {
                    return res.status(400).json({ error: `Test case ${i+1} failed for language ${language}` })
                }
            }

            // Save the problem to the database
            const newProblem = await db.problem.create({title, description, difficulty, tags, examples, constraints, hints, testcases, codeSnippets, refrenseSolutions, userId: req.user.id})
            return res.status(201).json({ message: "Problem created successfully", problem: newProblem })
        }
        
    } catch (error) {
        
    }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {}

export const getAllProblemsSolvedByUser = async (req, res) => {}