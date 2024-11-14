import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import { faker } from "@faker-js/faker";

// Connect to MongoDB (similar to server.js)
const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      "<DB_PASSWORD>",
      process.env.DATABASE_PASSWORD
    );

    await mongoose.connect(DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure code if the connection fails
  }
};

// Function to get a user by their userId (which is _id in the database)
const getUserById = async (userId) => {
  try {
    // Find the user by ObjectId
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

// Function to generate random appointment data
const generateRandomAppointment = (userId, patientName) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1); // Random future date in next 30 days

  return {
    doctorName: faker.person.fullName(), // Use fullName() instead of deprecated findName()
    patient: userId, // Reference the user by their ID
    patientName: patientName, // Add the patient's name
    appointmentDate: futureDate, // Make sure this is a Date object
    location: faker.location.streetAddress(),
    specialization: faker.helpers.arrayElement([
      "Cardiology",
      "Dermatology",
      "Neurology",
      "Orthopedics",
      "Pediatrics",
    ]),
    appointmentType: faker.helpers.arrayElement(["In-person", "Virtual"]),
  };
};

// Function to seed multiple appointments for a given user
const seedAppointments = async (userId) => {
  try {
    // Ensure the user exists
    const user = await getUserById(userId);
    if (!user) {
      console.log("User not found");
      return;
    }

    const patientName = user.name; // Get the patient's name from the User model

    // Generate multiple appointments (e.g., 10 appointments)
    const appointments = [];
    for (let i = 0; i < 10; i++) {
      const appointmentData = generateRandomAppointment(userId, patientName);
      appointments.push(appointmentData);
    }

    // Insert the appointments into the database
    await Appointment.create(appointments);

    console.log(
      `${appointments.length} appointments successfully added to user ${userId}`
    );
  } catch (error) {
    console.error("Error seeding appointments:", error);
  }
};

// Main function to connect to the database and seed appointments
export const main = async (userId) => {
  await connectDB(); // Connect to MongoDB
  await seedAppointments(userId); // Seed appointments for the user
  await mongoose.disconnect(); // Disconnect after seeding
};

// Run the main function
main().catch((error) => {
  console.error("Error running the seed script:", error);
  mongoose.disconnect();
});
