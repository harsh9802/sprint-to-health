import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: [true, "Doctor name is required"], // Ensure doctor name is provided
    minlength: [3, "Doctor name must be at least 3 characters long"], // Min length of 3
    maxlength: [100, "Doctor name must be less than 100 characters"], // Max length of 100
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Patient is required"],
  },
  patientName: {
    type: String,
    trim: true,
    validate: {
      validator: function (val) {
        return /^[a-zA-Z\s]+$/.test(val); // Allow only alphabetic characters and spaces
      },
      message:
        "Patient name must only contain alphabetic characters and spaces",
    },
  },
  appointmentDate: {
    type: Date,
    required: true,
    // If there's custom date handling logic, ensure it's correctly parsing the date
    set: function (value) {
      // Ensure we return a proper Date object
      if (typeof value === "string") {
        return new Date(value);
      }
      return value;
    },
  },
  location: {
    type: String,
    required: [true, "Location is required"], // Ensure location is provided
    minlength: [3, "Location must be at least 3 characters long"], // Min length of 3
    maxlength: [255, "Location must be less than 255 characters"], // Max length of 255
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"], // Ensure specialization is provided
    enum: {
      values: [
        "Cardiology",
        "Dermatology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
      ], // Limit possible values
      message: "{VALUE} is not a valid specialization",
    },
  },
  appointmentType: {
    type: String,
    required: [true, "Appointment type is required"], // Ensure appointment type is provided
    enum: {
      values: ["In-person", "Virtual"], // Limit appointment type to these two options
      message: "{VALUE} is not a valid appointment type",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to set patientName from User model before saving
appointmentSchema.pre("save", async function (next) {
  if (this.patient) {
    const user = await mongoose.model("User").findById(this.patient);
    if (user) {
      this.patientName = user.name; // Ensure that patientName is set from the User model
    } else {
      return next(new AppError("Patient not found", 404));
    }
  }
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
