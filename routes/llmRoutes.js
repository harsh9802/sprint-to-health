import express from "express";
import * as llmController from "../controllers/llmController.js";


const router = express.Router();

router.post("/callChat", llmController.fetchChatGPTResponse);
router.post("/summarizeDashboard", llmController.getSummaryFromDashboard);
router.post("/askQuestions", llmController.fetchResponse);

export default router;
