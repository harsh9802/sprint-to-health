import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import Appointment from "../models/appointmentModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handleFactory.js";

// Add an appointment

// Create appointment
export const addAppointment = catchAsync(async (req, res, next) => {
  const userId = req.body.patient ? req.body.patient : req.user.id;

  // Ensure necessary fields are included in the body
  if (
    !req.body.doctorName ||
    !req.body.appointmentDate ||
    !req.body.location ||
    !req.body.specialization ||
    !req.body.appointmentType
  ) {
    return next(
      new AppError(
        "Missing required fields: doctorName, appointmentDate, location, specialization, and appointmentType are required.",
        400
      )
    );
  }

  // Ensure the appointmentDate is a valid Date object
  const appointmentDate = new Date(req.body.appointmentDate);
  if (isNaN(appointmentDate)) {
    return next(new AppError("Invalid date format for appointmentDate.", 400));
  }

  // Prepare the data object
  const data = { ...req.body, appointmentDate };

  if (userId) {
    data.patient = userId;
  } else {
    return next(new AppError("Patient id is required.", 400));
  }

  // Create the appointment in the database
  const appointment = await Appointment.create(data);

  // Send success response
  res.status(201).json({
    status: "success",
    data: appointment,
  });
});

// Get appointments

// Get one appointment by id
export const getAppointment = factory.getOne(Appointment);
// Get all appointments in the database
export const getAllAppointments = factory.getAll(Appointment);
// Get upcoming appointments

// Get upcoming appointment function
export const getUpcomingAppointments = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(
      new AppError("You need to be logged in to get your appointments.", 400)
    );
  }

  // Retrieve the duration from the request body
  let duration = req.body.duration;

  // If no duration is provided, default to 7 days
  if (!duration) {
    duration = 7; // Default duration
  }

  // Check if the duration is a valid number and is positive
  if (isNaN(duration) || duration <= 0) {
    return next(new AppError("Duration must be a positive number.", 400));
  }

  // Get current date and calculate the end date based on duration
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + duration); // Set endDate based on duration

  console.log("currentDate", currentDate);
  console.log("endDate", endDate);

  // Query for appointments within the calculated date range
  const upcomingAppointments = await Appointment.find({
    patient: userId,
    appointmentDate: { $gte: currentDate, $lte: endDate },
  }).sort({ appointmentDate: 1 });

  console.log("user:", userId);
  console.log("upcoming appointments", upcomingAppointments.length);

  // Handle case where no appointments are found
  if (!upcomingAppointments.length) {
    return next(
      new AppError(`No appointments found in the next ${duration} days.`, 404)
    );
  }

  // Return the results
  res.status(200).json({
    status: "success",
    data: upcomingAppointments,
  });
});

// Update appointment by id
export const updateAppointment = factory.updateOne(Appointment);

// Delete appointment
export const deleteAppointment = factory.deleteOne(Appointment);

// Middleware to check if the user is the owner of the appointment
export const checkAppointmentOwnership = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if the logged-in user is the patient associated with the appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this appointment" });
    }

    // Proceed to the next middleware/controller if ownership check passes
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
