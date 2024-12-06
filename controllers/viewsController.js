import Appointment from "../models/appointmentModel.js";
import catchAsync from "../utils/catchAsync.js";
import Email from "../utils/email.js";
import moment from "moment";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
export const getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log in to your account",
    cssPath: "/css/style.css",
  });
};

export const getHealthDashboard = (req, res) => {
  let user = res.locals.user;
  user["age"] = calculateAge(user.dateOfBirth);
  res.render("healthDashboard", {
    title: "Health Dashboard",
    user: res.locals.user,
    additionalJs: "/js/healthDashboard.js",
    cssPath: "/css/healthdashboard.css",
  });
};

export const getAppointmentDashboard = catchAsync(async (req, res, next) => {
  const userId = res.locals.user.id;

  if (!userId) {
    return next(
      new AppError("You must be logged in to view appointments.", 400)
    );
  }

  // Define the date range for the next 30 days
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 30);

  // Query appointments for the next 30 days
  const appointments = await Appointment.find({
    patient: userId,
    appointmentDate: { $gte: currentDate, $lte: endDate },
  }).sort({ appointmentDate: 1 });

  // Check for appointments in the next 7 days
  const sevenDaysLater = moment().add(7, "days").toDate();
  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.appointmentDate) <= sevenDaysLater
  );

  // If there are upcoming appointments, send an email
  const baseUrl = `${req.protocol}://${req.get("host")}/appointment-dashboard`;

  if (upcomingAppointments.length > 0) {
    const email = new Email(req.user, baseUrl);
    await email.send("appointmentReminder", "Upcoming Appointments Reminder", {
      appointments: upcomingAppointments,
      url: baseUrl,
    });
  }

  // Render the dashboard with appointments
  res.status(200).render("appointmentDashboard", {
    title: "Appointments Dashboard",
    user: res.locals.user,
    appointments,
    cssPath: "/css/appointment.css",
    additionalJs: "/js/appointmentDashboard.js",
  });
});

export const getVoiceAssistant = (req, res) => {
  res.render("voice-assistant", {
    title: "Sprint2Health Voice Assistant",
    additionalJs: "/js/assistantHandler.js",
  });
};
