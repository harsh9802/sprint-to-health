import express from "express";
import * as llmController from "../controllers/llmController.js";


const router = express.Router();

router.post("/callChat", llmController.fetchChatGPTResponse);

export default router;
