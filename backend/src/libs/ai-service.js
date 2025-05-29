import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getCodeCompletion(prompt, context, language, maxTokens = 100, attempt = 1) {
  console.log(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const fullPrompt = `
You are an expert ${language} programmer.
Provide only code completions for the following code context.
Rules:
1. Return only the next few lines of code.
2. Preserve indentation and code style.
3. No explanations or markdown formatting.
4. Keep output short (max ${maxTokens} tokens).

Context:
${context}

Current line:
${prompt}
    `.trim();

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();

    const cleanText = text.replace(/```[\w]*\n?/g, '').trim();

    return {
      success: true,
      completion: cleanText,
    };

  } catch (error) {
    console.error("AI completion error:", error);

    if (error.status === 429 && attempt <= 3) {
      const wait = 5000 + Math.random() * 3000;
      console.warn(`Retrying after ${wait / 1000}s...`);
      await sleep(wait);
      return getCodeCompletion(prompt, context, language, maxTokens, attempt + 1);
    }

    return {
      success: false,
      error: `[AI Error]: ${error.message || "Unknown error"}`,
    };
  }
}
