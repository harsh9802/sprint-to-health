import Appointment from "../models/appointmentModel.js";
import catchAsync from "../utils/catchAsync.js";

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

  // Render the dashboard with appointments
  res.status(200).render("appointmentDashboard", {
    title: "Appointments Dashboard",
    user: res.locals.user,
    appointments,
    cssPath: "/css/appointment.css",
    additionalJs: "/js/appointmentDashboard.js",
  });
});
