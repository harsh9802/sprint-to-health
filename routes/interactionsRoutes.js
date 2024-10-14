import express from "express";

import * as interactionsController from "../controllers/interactionsController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Protect the interactions to logged in users only
router.use(authController.protect);

// Conversation routes
// Create Interaction
router.post("/", interactionsController.createInteraction);

router.get("/history", interactionsController.getInteractions);

export default router;
