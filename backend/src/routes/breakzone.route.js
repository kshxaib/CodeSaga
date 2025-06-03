import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { BinaryClicker, bugHunt, bugHuntValidate, checkShortcutAnswer, 
emojiPictionary, emojiPictionaryAiExplanation, emojiPictionaryAnswer, 
generateRiverData, generateRopeData, guessTheOutput, regexRush, shortcutNinja, 
typingSpeedTest, validateRiverAnswer, validateRopeAnswer 
,getDailyFacts} from '../controllers/breakzone.controller.js';

const breakzoneRoutes = express.Router();

breakzoneRoutes.post("/guess-output", authMiddleware, guessTheOutput)
breakzoneRoutes.post("/regex-rush", authMiddleware, regexRush)
breakzoneRoutes.post("/typing-test", authMiddleware, typingSpeedTest)
breakzoneRoutes.post("/bug-hunt", authMiddleware, bugHunt)   
breakzoneRoutes.post("/bug-hunt/validate", authMiddleware, bugHuntValidate)   
breakzoneRoutes.post("/binary-clicker", authMiddleware, BinaryClicker)   
breakzoneRoutes.post("/shortcut-ninja", authMiddleware, shortcutNinja)   
breakzoneRoutes.post("/shortcut-ninja/check", authMiddleware, checkShortcutAnswer)   
breakzoneRoutes.post("/emoji-pictionary", authMiddleware, emojiPictionary)   
breakzoneRoutes.post("/emoji-pictionary/answer", authMiddleware, emojiPictionaryAnswer)   
breakzoneRoutes.post("/emoji-pictionary/ai-explaination", authMiddleware, emojiPictionaryAiExplanation)   
breakzoneRoutes.post("/rope-burning", authMiddleware, generateRopeData)   
breakzoneRoutes.post("/rope-burning/validate", authMiddleware, validateRopeAnswer)   
breakzoneRoutes.post("/river-crossing", authMiddleware, generateRiverData)   
breakzoneRoutes.post("/river-crossing/validate", authMiddleware, validateRiverAnswer)   
breakzoneRoutes.get("/daily-facts", getDailyFacts);

export default breakzoneRoutes;