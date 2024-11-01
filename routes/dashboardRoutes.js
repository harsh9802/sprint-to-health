import express from "express";
import * as vitalsRecordsController from "../controllers/vitalsRecordsController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Protect all routes for logged-in users only
// router.use(authController.protect);

// Dashboard routes

// Create a vital record - user can create a new vital record
router.post("/", vitalsRecordsController.createVitalsRecord);
// Get specific vital records for the logged-in user (latest for given vital IDs)
router.get(
  "/myVitals",
  vitalsRecordsController.getLatestVitalsRecordsForVitals
);

// Get all latest vital records for the logged-in user
router.get("/allMyVitals", vitalsRecordsController.getAllLatestVitalsRecords);


router.post("/getLatestVitals", vitalsRecordsController.getVitalsValuesForLast24Hours);

// Middleware to restrict the following methods to admins only
router.use(authController.restrictTo("admin"));

// Admin-specific routes
router.route("/admin").get(vitalsRecordsController.getAllVitalsRecords); // Admin can view all records

router
  .route("/admin/:id")
  .get(vitalsRecordsController.getVitalsRecord) // Admin can get a specific record
  .patch(vitalsRecordsController.updateVitalsRecord) // Admin can update a record
  .delete(vitalsRecordsController.deleteVitalsRecord); // Admin can delete a record

export default router;
