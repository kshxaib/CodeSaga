import axios from "axios";
import cron from "node-cron";
import { dailyFacts, setDailyFacts } from "../libs/dailyFacts.js";

const GEMINI_API_KEY = "AIzaSyDk6Agx7qpUAPzv6TUiU1Brc2J6QTo-VKc"
const GEMINI_API_KEY2 = "AIzaSyDk6Agx7qpUAPzv6TUiU1Brc2J6QTo-VKc"


export const guessTheOutput = async (req, res) => {
  const language = req.query.language || "javascript";

  const prompt = `
Give a tricky ${language} code snippet and its actual output in this JSON format only:

{
  "code": "your code here",
  "correct": "correct output",
  "distractors": ["wrong1", "wrong2", "wrong3"]
}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY2}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        timeout: 10000,
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Empty response from Gemini");

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(raw);
    const options = [...parsed.distractors, parsed.correct].sort(() => Math.random() - 0.5);

    res.json({
      code: parsed.code,
      correct: parsed.correct,
      options,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    if (error.response?.status === 503) {
      return res.status(503).json({ error: "Gemini API is temporarily unavailable. Please try again later." });
    }

    res.status(500).json({ error: "Failed to generate question." });
  }
};

export const regexRush = async (req, res) => {
  const prompt = `
  Generate a JSON with a regex pattern string, a list of strings (some matching, some not),
  and the correct answers (which strings match the regex). Example format:
  {
    "pattern": "\\\\d{3}-\\\\d{2}-\\\\d{4}",
    "strings": ["123-45-6789", "abc-12-3456", "999-99-9999", "hello123"],
    "correct": ["123-45-6789", "999-99-9999"]
  }
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      return res.status(500).json({ error: "Empty response from Gemini API" });
    }

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(raw);

    res.json(data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Gemini API" });
  }
}

export const typingSpeedTest = async (req, res) => {
  const { language } = req.body;
  const prompt = `
Generate a short code snippet (5-8 lines max) in ${language}. Only include code. 
Do not include explanation or extra text. Keep it beginner friendly.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );
    console.log(JSON.stringify(response?.data, null, 2));


    let code = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    code = code
      .split('\n')
      .filter(line => !line.trim().startsWith('```'))
      .join('\n')
      .trim();

    res.json({ code });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to fetch code from Gemini" });
  }
}

export const bugHunt = async (req, res) => {
  const prompt = `
Generate a JSON object for a game called "Bug Hunt".
Include:
- language (e.g., "JavaScript")
- buggyCode (with a logical error, not syntax error)
- explanation of the bug
- fixedCode

Format:
{
  "language": "JavaScript",
  "buggyCode": "...",
  "explanation": "...",
  "fixedCode": "..."
}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return res.status(500).json({ error: "Empty Gemini response" });

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);

    res.json(data);
  } catch (err) {
    console.error("Bug Hunt error:", err.message);
    res.status(503).json({ error: "Gemini API unavailable, try again later." });
  }
};

export const bugHuntValidate = async (req, res) => {
  const { buggyCode, userFix } = req.body;

  const prompt = `
You are an AI code reviewer.
Here is some buggy code:\n${buggyCode}
Here is a user's attempted fix:\n${userFix}

Please evaluate if the fix correctly resolves the bug(s). 
Respond with a JSON like this:
{
  "isCorrect": true/false,
  "feedback": "A short explanation of why the fix is correct or not."
}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(raw);

    res.json(result);
  } catch (error) {
    console.error("Error evaluating bug fix:", error.message);
    res.status(500).json({ error: "AI evaluation failed" });
  }
};

export const BinaryClicker = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    // Try to parse JSON, fallback to raw text
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      result = raw;
    }

    res.json({ result });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content" });
  }
}

export const shortcutNinja = async (req, res) => {
  const { topic = "IDE keyboard shortcuts" } = req.body;

  try {
    const prompt = `Generate a quiz question about ${topic} with the question and correct answer formatted as JSON:
    {
      "question": "your question here",
      "answer": "correct shortcut here",
      "hint": "optional hint"
    }`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const questionData = JSON.parse(raw);

    res.json(questionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate question" });
  }
}

export const checkShortcutAnswer = async (req, res) => {
  const { question, userAnswer } = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({ error: "Missing question or userAnswer" });
  }

  const prompt = `
You are an expert on IDE keyboard shortcuts.
Check if the following answer is correct for this question.

Question: "${question}"
User Answer: "${userAnswer}"

Respond in JSON format:
{
  "correct": true/false,
  "explanation": "short explanation of correctness or correct answer"
}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(raw);

    res.json(result);
  } catch (error) {
    console.error("Error in checkShortcutAnswer:", error.message);
    res.status(500).json({ error: "Failed to validate answer with AI" });
  }
};

export const emojiPictionary = async (req, res) => {
  const prompt = `Create an emoji-based programming puzzle. The puzzle should be related to a programming concept or term it should minimum 5-6 puzzles.

Respond in JSON format like:
{
  "emoji": "🧠🔁",
  "term": "recursion",
  "hint": "A function that calls itself"
}`;


  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    JSON.stringify(response.data, null, 2)

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(raw);

    res.json(data);
  } catch (e) {
    console.error("❌ Error generating puzzle:", e.message);
    res.status(500).json({ error: "AI failed to generate emoji puzzle" });
  }

};

export const emojiPictionaryAnswer = async (req, res) => {
  const { guess, correctTerm } = req.body;

  if (!guess || !correctTerm) {
    return res.status(400).json({ result: "Invalid input" });
  }

  const prompt = `A user is playing Emoji Pictionary. The correct programming term is "${correctTerm}". They guessed: "${guess}". Determine if their guess is semantically correct. Reply as JSON:

  {
    "isCorrect": true,
    "feedback": "Your guess is close, but not exact. Try again!",
    "confidence": "high | medium | low"
  }`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(raw);

    res.json({
      result: data.isCorrect ? "✅ Correct!" : "❌ Incorrect",
      feedback: data.feedback,
      confidence: data.confidence,
      correct: data.isCorrect,
    });
  } catch (e) {
    console.error("AI check failed:", e.message);
    res.status(500).json({ error: "Failed to check answer with AI" });
  }
};

export const emojiPictionaryAiExplanation = async (req, res) => {
  const { term, context } = req.body;

  if (!term) {
    return res.status(400).json({ error: "Term is required" });
  }

  const prompt = `Explain the programming/tech term "${term}" in simple terms. ${context ? `Context: ${context}` : ""
    }

  Requirements:
  - Keep it concise (2-3 sentences)
  - Use simple language
  - Include a practical example if possible
  - Format as plain text (no markdown)
  - Make it beginner-friendly`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let explanation = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    explanation = explanation.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();

    res.json({
      explanation,
      term,
    });
  } catch (e) {
    console.error("Error generating explanation:", e.message);
    res.status(500).json({ error: "AI failed to generate explanation" });
  }
};

export const generateRopeData = async (req, res) => {
  const prompt = `Generate a unique Rope Burning puzzle for programming learners, along with a helpful hint and a beginner-friendly concept explanation.

Respond as JSON:
{
  "puzzle": "What is the fastest way to burn a rope?",
  "hint": "Light both ends of the rope at the same time",
  "explanation": "The rope burns faster when both ends are lit at the same time."
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY2}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);

    res.json(data);
  } catch (e) {
    console.error("❌ Error generating rope data:", e.message);
    res.status(500).json({ error: "Failed to generate rope data" });
  }
};

export const validateRopeAnswer = async (req, res) => {
  const { guess, correctAnswer } = req.body;

  if (!guess || !correctAnswer) {
    return res.status(400).json({ error: "Missing guess or correctAnswer" });
  }

  const prompt = `User guessed: "${guess}"
The correct answer is: "${correctAnswer}"
Is the user's guess logically correct for the Rope Burning puzzle? Reply as JSON:
{
  "isCorrect": true,
  "feedback": "Feedback message",
  "confidence": "high | medium | low"
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY2}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);

    res.json(data);
  } catch (e) {
    console.error("❌ Error validating answer:", e.message);
    res.status(500).json({ error: "Failed to validate answer" });
  }
};

export const generateRiverData = async (req, res) => {
  const prompt = `Generate a creative variation of the River Crossing puzzle.
Respond in JSON format:
{
  "puzzle": "You must ferry a wolf, a goat, and a cabbage across a river. The boat can carry only one item at a time with you. You cannot leave the wolf alone with the goat, or the goat with the cabbage. How do you get all safely across?",
  "hint": "Try moving the goat first and think about bringing items back.",
  "explanation": "This classic puzzle uses constraints. The solution involves making trips and sometimes bringing an item back to prevent unsafe pairings."
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBFHimTR8evYGwrS4adBqtLIw7H0ABNDJM`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );


    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);
    console.log(data);

    res.json(data);
  } catch (e) {
    console.error("❌ Error generating river data:", e.message);
    res.status(500).json({ error: "Failed to generate river data" });
  }
};

export const validateRiverAnswer = async (req, res) => {
  const { guess, correctAnswer } = req.body;

  if (!guess || !correctAnswer) {
    return res.status(400).json({ error: "Missing guess or correctAnswer" });
  }

  const prompt = `User guessed: "${guess}"
The correct answer is: "${correctAnswer}"
Is the user's guess logically correct for this variation of the River Crossing puzzle? Reply in JSON:
{
  "isCorrect": true | false,
  "feedback": "Brief explanation",
  "confidence": "high | medium | low"
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBFHimTR8evYGwrS4adBqtLIw7H0ABNDJM`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    let raw = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);

    res.json(data);
  } catch (e) {
    console.error("❌ Error validating answer:", e.message);
    res.status(200).json({
      isCorrect: false,
      feedback: "Validation temporarily unavailable.",
      confidence: "low",
    });
  }
};

export const fetchDailyFact = async () => {
  try {
    const prompt = "Give me 5 interesting daily tech facts as a numbered list. Make them surprising and educational about technology, programming, or computer science.";

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBFHimTR8evYGwrS4adBqtLIw7H0ABNDJM`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const parsedFacts = text.split(/\n\d+\.\s/).filter(Boolean);

    setDailyFacts(parsedFacts);
  } catch (err) {
    console.error("❌ Error fetching facts:", err.response?.data || err.message);
    setTimeout(fetchDailyFact, 30 * 60 * 1000); 
  }
};

cron.schedule("0 8 * * *", fetchDailyFact, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

const now = new Date();
if (now.getHours() >= 8) {
  fetchDailyFact();
}

export const getDailyFacts = (req, res) => {
  console.log("📤 Sending dailyFacts to client:", dailyFacts);
  res.json({ facts: dailyFacts });
};

// fetchDailyFact();


