import {
  cleanNullBytes,
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import {db} from "../libs/db.js";
import { updateUserStreak } from "../libs/updateUserStreak.js";

export const executeCode = async (req, res) => {
  try {
    const cleanedBody = cleanNullBytes(req.body);
    const { source_code, language_id, stdin, expected_outputs, problemId } = cleanedBody;
    expected_outputs.forEach((output) => console.log(typeof(output)));
    const userId = req.user.id;

    if (!source_code || !language_id || !stdin || !expected_outputs) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!Array.isArray(stdin) || !Array.isArray(expected_outputs)) {
      return res.status(400).json({ success: false, message: "Stdin and expected_outputs must be arrays" });
    }

    if (stdin.length !== expected_outputs.length) {
      return res.status(400).json({ success: false, message: "Test case count mismatch" });
    }

    const submissions = stdin.map((input, idx) => ({
      source_code,
      language_id,
      stdin: input,
      expected_output: expected_outputs[idx],
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map(res => res.token);
    const results = await pollBatchResults(tokens);

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
        status: result.status?.description || `Status ID: ${result.status_id}`,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} sec` : undefined,
      };
    });

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailResults.map(r => r.stdout)),
        stderr: detailResults.some(r => r.stderr) ? JSON.stringify(detailResults.map(r => r.stderr)) : null,
        compileOutput: detailResults.some(r => r.compile_output) ? JSON.stringify(detailResults.map(r => r.compile_output)) : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailResults.some(r => r.memory) ? JSON.stringify(detailResults.map(r => r.memory)) : null,
        time: detailResults.some(r => r.time) ? JSON.stringify(detailResults.map(r => r.time)) : null,
      },
    });

    if (allPassed) {
      await updateUserStreak(userId);
      await db.ProblemSolved.upsert({
        where: { userId_problemId: { userId, problemId } },
        update: {},
        create: { userId, problemId },
      });
    }

    await db.TestCaseResult.createMany({
      data: detailResults.map((r, index) => ({
        submissionId: submission.id,
        testCase: index + 1,
        passed: r.passed,
        stdout: r.stdout,
        expected: r.expected,
        stderr: r.stderr,
        compileOutput: r.compile_output,
        status: r.status,
        memory: r.memory,
        time: r.time,
      })),
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    return res.status(200).json({
      success: true,
      submission: submissionWithTestCase,
      message: "Code executed successfully",
    });
  } catch (error) {
    console.error("Execution Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while executing code",
    });
  }
};
