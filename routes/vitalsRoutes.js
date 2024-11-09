import express from "express";
import * as vitalsController from "../controllers/vitalsController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Protect all routes for logged-in users only
router.use(authController.protect, authController.restrictTo("admin"));

// Vitals routes

// Admin-specific routes
router
  .route("/")
  .get(vitalsController.getAllVitals)
  .post(vitalsController.createVital);

router
  .route("/:id")
  .get(vitalsController.getVital)
  .patch(vitalsController.updateVital)
  .delete(vitalsController.deleteVital);

export default router;
