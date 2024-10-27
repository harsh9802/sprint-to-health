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
  .get(vitalsController.getAllVitals) // Admin can view all records
  .post(vitalsController.createVital); // Admin can create a record

router
  .route("/:id")
  .get(vitalsController.getVital) // Admin can get a specific vital
  .patch(vitalsController.updateVital) // Admin can update a vital
  .delete(vitalsController.deleteVital); // Admin can delete a vital

export default router;
