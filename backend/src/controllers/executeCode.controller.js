import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import {db} from "../libs/db.js";
import { updateUserStreak } from "../libs/updateUserStreak.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    if (!source_code || !language_id || !stdin || !expected_outputs) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(stdin) || !Array.isArray(expected_outputs)) {
      return res
        .status(400)
        .json({ error: "Stdin and expected_outputs must be arrays" });
    }

    // prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send batch submission to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    // Check if all test cases passed
    let allPassed = true;
    const detailResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[index]?.trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };
    });

    console.log("Detail Results:", detailResults);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailResults.map((result) => result.stdout)),
        stderr: detailResults.some((result) => result.stderr)
          ? JSON.stringify(detailResults.map((result) => result.stderr))
          : null,
        compileOutput: detailResults.some((result) => result.compile_output)
          ? JSON.stringify(detailResults.map((result) => result.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailResults.some((result) => result.memory)
          ? JSON.stringify(detailResults.map((result) => result.memory))
          : null,
        time: detailResults.some((result) => result.time)
          ? JSON.stringify(detailResults.map((result) => result.time))
          : null,
      },
    });

    console.log("Submission:", submission);

    // If all passed, and the problem is not already solved, mark it as solved 
    if(allPassed){
        await updateUserStreak(userId);
        await db.ProblemSolved.upsert({
            where: {
                userId_problemId: {
                    userId: userId,
                    problemId: problemId
                }
            },
            update: {},
            create: {
                userId: userId,
                problemId: problemId
            }
        })
    }

    // await checkAndAwardBadges(userId, {problemId, solveTime: submission.time})

    // Save individual test case results to the database
    const testCaseResults = detailResults.map((result, index) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
    }))

    console.log("Test Case Results:", testCaseResults);

    await db.TestCaseResult.createMany({
        data: testCaseResults

    })

    const submissionWithTestCase = await db.submission.findUnique({
        where: {
            id: submission.id
        },
        include: {
            testCases: true
        }
    })

    console.log("Submission with Test Cases:", submissionWithTestCase);

    return res.status(200).json({
        success: true,
        submission: submissionWithTestCase,
      message: "Code executed successfully",
    });
  } catch (error) {
    console.error("Execution Error:", error)
    return res.status(500).json({
      error: "Error while executing code",
    });
  }
};
