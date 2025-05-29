// routes/ai.route.js
import express from "express";
import { getCodeCompletion } from "../libs/ai-service.js";

const router = express.Router();

router.post("/completion", async (req, res) => {
  try {
    const { prompt, context, language, maxTokens } = req.body;
    
    if (!prompt || !context || !language) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields: prompt, context, language" 
      });
    }

    const result = await getCodeCompletion(
      prompt, 
      context, 
      language,
      maxTokens
    );
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

export default router;