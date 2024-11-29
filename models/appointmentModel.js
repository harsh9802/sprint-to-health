import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js"; // Assuming you have these utility functions

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: [true, "Doctor name is required"],
    minlength: [3, "Doctor name must be at least 3 characters long"],
    maxlength: [100, "Doctor name must be less than 100 characters"],
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
        return /^[a-zA-Z\s]+$/.test(val);
      },
      message:
        "Patient name must only contain alphabetic characters and spaces",
    },
  },
  appointmentDate: {
    type: Date,
    required: true,
    set: function (value) {
      if (typeof value === "string") {
        return new Date(value);
      }
      return value;
    },
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    minlength: [3, "Location must be at least 3 characters long"],
    maxlength: [255, "Location must be less than 255 characters"],
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    enum: {
      values: [
        "Cardiology",
        "Dermatology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
      ],
      message: "{VALUE} is not a valid specialization",
    },
  },
  appointmentType: {
    type: String,
    required: [true, "Appointment type is required"],
    enum: {
      values: ["In-person", "Virtual"],
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
      this.patientName = user.name;
    } else {
      return next(new AppError("Patient not found", 404));
    }
  }
  next();
});

// Pre-save hook to encrypt sensitive fields
appointmentSchema.pre("save", function (next) {
  if (this.doctorName) {
    this.doctorName = encrypt(this.doctorName);
  }
  if (this.patientName) {
    this.patientName = encrypt(this.patientName);
  }
  if (this.location) {
    this.location = encrypt(this.location);
  }
  next();
});

// Pre-find hook to decrypt sensitive fields after retrieval
appointmentSchema.post("find", function (docs) {
  docs.forEach((doc) => {
    if (doc.doctorName) {
      doc.doctorName = decrypt(doc.doctorName);
    }
    if (doc.patientName) {
      doc.patientName = decrypt(doc.patientName);
    }
    if (doc.location) {
      doc.location = decrypt(doc.location);
    }
  });
});

// Pre-findOne hook to decrypt sensitive fields after retrieval
appointmentSchema.post("findOne", function (doc) {
  if (doc) {
    if (doc.doctorName) {
      doc.doctorName = decrypt(doc.doctorName);
    }
    if (doc.patientName) {
      doc.patientName = decrypt(doc.patientName);
    }
    if (doc.location) {
      doc.location = decrypt(doc.location);
    }
  }
});

// Pre-findOneAndUpdate hook to encrypt updated sensitive fields
appointmentSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update && update.$set) {
    if (update.$set.doctorName) {
      update.$set.doctorName = encrypt(update.$set.doctorName);
    }
    if (update.$set.patientName) {
      update.$set.patientName = encrypt(update.$set.patientName);
    }
    if (update.$set.location) {
      update.$set.location = encrypt(update.$set.location);
    }
  }

  next();
});

// Post-findOneAndUpdate hook to decrypt sensitive fields
appointmentSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    if (doc.doctorName) {
      doc.doctorName = decrypt(doc.doctorName);
    }
    if (doc.patientName) {
      doc.patientName = decrypt(doc.patientName);
    }
    if (doc.location) {
      doc.location = decrypt(doc.location);
    }
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
