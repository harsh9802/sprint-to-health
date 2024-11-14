import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Protect all routes for logged-in users only
router.use(authController.protect);

// Appointment routes
// Create an appointment - user can add a new appointment
router.post("/", appointmentController.addAppointment);

// Get appointments for the week/input-duration
router.get("/myAppointments", appointmentController.getUpcomingAppointments);

// id route for appointment
router
  .route("/myAppointments/:id")
  .get(
    appointmentController.checkAppointmentOwnership,
    appointmentController.getAppointment
  )
  .patch(
    appointmentController.checkAppointmentOwnership,
    appointmentController.updateAppointment
  )
  .delete(
    appointmentController.checkAppointmentOwnership,
    appointmentController.deleteAppointment
  );

// Middleware to restrict the following methods to admins only
router.use(authController.restrictTo("admin"));

// Get all appointments
router.get("/admin", appointmentController.getAllAppointments);

export default router;
